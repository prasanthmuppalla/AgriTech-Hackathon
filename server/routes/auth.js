const express = require('express')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const Farmer = require('../models/Farmer')
const auth = require('../middleware/auth')

const router = express.Router()

// Demo farmer database (will be replaced by MongoDB data)
const demoFarmers = {
  '123456789012': {
    name: 'Ram Kumar Sharma',
    fatherName: 'Shyam Lal Sharma',
    village: 'Rampur',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    rationCard: 'UP1234567890',
    landSize: '2.5 acres',
    crops: ['Wheat', 'Rice', 'Sugarcane'],
    phone: '9876543210'
  },
  '234567890123': {
    name: 'Sunita Devi',
    fatherName: 'Rajesh Kumar',
    village: 'Gokulpur',
    district: 'Ghaziabad',
    state: 'Uttar Pradesh',
    rationCard: 'UP2345678901',
    landSize: '1.8 acres',
    crops: ['Tomato', 'Potato', 'Onion'],
    phone: '9765432109'
  },
  '345678901234': {
    name: 'Mukesh Patel',
    fatherName: 'Harishchandra Patel',
    village: 'Kisanganj',
    district: 'Bulandshahr',
    state: 'Uttar Pradesh',
    rationCard: 'UP3456789012',
    landSize: '3.2 acres',
    crops: ['Corn', 'Millet', 'Mustard'],
    phone: '9654321098'
  }
}

// Verify Aadhaar and get farmer details
router.post('/verify-aadhaar', [
  body('aadhaarNumber').isLength({ min: 12, max: 12 }).withMessage('Aadhaar number must be 12 digits'),
  body('name').notEmpty().withMessage('Name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    const { aadhaarNumber, name } = req.body

    // First check in MongoDB
    let farmer = await Farmer.findOne({ aadhaarNumber })
    
    if (farmer) {
      // Farmer exists in database
      return res.json({
        success: true,
        message: 'Farmer found in database',
        farmer: {
          name: farmer.name,
          fatherName: farmer.fatherName,
          village: farmer.profile.location.village,
          district: farmer.profile.location.district,
          state: farmer.profile.location.state,
          rationCard: farmer.welfare.rationCard.number,
          landSize: farmer.profile.farmDetails.totalLand,
          crops: farmer.profile.farmDetails.crops.map(crop => crop.name),
          phone: farmer.phone
        }
      })
    }

    // Check in demo data
    const demoFarmer = demoFarmers[aadhaarNumber]
    if (demoFarmer) {
      // Create new farmer in database from demo data
      farmer = new Farmer({
        aadhaarNumber,
        name: demoFarmer.name,
        fatherName: demoFarmer.fatherName,
        phone: demoFarmer.phone,
        profile: {
          location: {
            village: demoFarmer.village,
            district: demoFarmer.district,
            state: demoFarmer.state
          },
          farmDetails: {
            totalLand: demoFarmer.landSize,
            crops: demoFarmer.crops.map(crop => ({ name: crop }))
          }
        },
        welfare: {
          rationCard: {
            number: demoFarmer.rationCard,
            category: 'BPL',
            familyMembers: 4,
            monthlyQuota: {
              rice: 5,
              wheat: 5,
              sugar: 1,
              kerosene: 2
            }
          }
        }
      })

      await farmer.save()

      return res.json({
        success: true,
        message: 'Farmer details found',
        farmer: {
          name: demoFarmer.name,
          fatherName: demoFarmer.fatherName,
          village: demoFarmer.village,
          district: demoFarmer.district,
          state: demoFarmer.state,
          rationCard: demoFarmer.rationCard,
          landSize: demoFarmer.landSize,
          crops: demoFarmer.crops,
          phone: demoFarmer.phone
        }
      })
    }

    return res.status(404).json({
      success: false,
      message: 'No farmer record found for this Aadhaar number'
    })

  } catch (error) {
    console.error('Aadhaar verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    })
  }
})

// Verify OTP and complete login
router.post('/verify-otp', [
  body('aadhaarNumber').isLength({ min: 12, max: 12 }),
  body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    const { aadhaarNumber, otp, preferredLanguage } = req.body

    // In demo mode, accept any 6-digit OTP
    // In production, verify OTP from SMS service

    // Find farmer in database
    const farmer = await Farmer.findOne({ aadhaarNumber })
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      })
    }

    // Update farmer login details
    farmer.lastLogin = new Date()
    farmer.loginCount += 1
    farmer.isVerified = true
    
    if (preferredLanguage) {
      farmer.profile.language = preferredLanguage
    }

    await farmer.save()

    // Generate JWT token
    const token = jwt.sign(
      { 
        farmerId: farmer._id,
        aadhaarNumber: farmer.aadhaarNumber,
        name: farmer.name
      },
      process.env.JWT_SECRET || 'demo-secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      farmer: {
        id: farmer._id,
        name: farmer.name,
        fatherName: farmer.fatherName,
        village: farmer.profile.location.village,
        district: farmer.profile.location.district,
        state: farmer.profile.location.state,
        phone: farmer.phone,
        preferredLanguage: farmer.profile.language,
        loginCount: farmer.loginCount
      }
    })

  } catch (error) {
    console.error('OTP verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
})

// Get farmer profile
router.get('/profile', auth, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId)

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      })
    }

    res.json({
      success: true,
      farmer: {
        id: farmer._id,
        name: farmer.name,
        fatherName: farmer.fatherName,
        aadhaarNumber: farmer.aadhaarNumber,
        phone: farmer.phone,
        village: farmer.profile.location.village,
        district: farmer.profile.location.district,
        state: farmer.profile.location.state,
        rationCard: farmer.welfare.rationCard.number,
        landSize: farmer.profile.farmDetails.totalLand,
        crops: farmer.profile.farmDetails.crops.map(crop => crop.name),
        preferredLanguage: farmer.profile.language,
        lastLogin: farmer.lastLogin,
        loginCount: farmer.loginCount
      }
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// Legacy endpoints for compatibility
router.post('/send-otp', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Please use Aadhaar-based authentication',
    redirect: '/verify-aadhaar'
  })
})

router.post('/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Please use Aadhaar-based authentication',
    redirect: '/verify-aadhaar'
  })
})

// Get current user (legacy)
router.get('/me', auth, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId).select('-__v')
    res.json({ user: farmer })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router