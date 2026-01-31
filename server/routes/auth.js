const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const Farmer = require('../models/Farmer')
const auth = require('../middleware/auth')

const router = express.Router()

// Send OTP (Demo - always succeeds)
router.post('/send-otp', [
  body('phone').isMobilePhone('en-IN').withMessage('Invalid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { phone } = req.body
    
    // In production, integrate with SMS service
    // For demo, we'll just return success
    
    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      // Demo: Tell user any OTP works
      demo: 'Use any 6-digit OTP for demo'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Verify OTP and Login
router.post('/login', [
  body('phone').isMobilePhone('en-IN'),
  body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { phone, otp, farmerDetails } = req.body
    
    // For demo, any OTP works
    // In production, verify OTP from Redis/database
    
    let farmer = await Farmer.findOne({ phone })
    
    if (!farmer) {
      // Create new farmer profile with Aadhaar details
      farmer = new Farmer({
        phone,
        name: farmerDetails?.name || `Farmer ${phone.slice(-4)}`,
        isVerified: true,
        profile: {
          language: 'hi',
          location: {
            state: farmerDetails?.state || 'उत्तर प्रदेश',
            district: farmerDetails?.district || 'Demo District',
            village: farmerDetails?.village || 'Demo Village'
          },
          farmDetails: {
            totalLand: parseFloat(farmerDetails?.landSize?.replace(/[^\d.]/g, '')) || 2.5,
            crops: farmerDetails?.crops || ['गेहूं', 'धान'],
            soilType: 'दोमट मिट्टी'
          }
        },
        welfare: {
          rationCard: {
            number: farmerDetails?.rationCard || 'UP1234567890',
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
    }

    const token = jwt.sign(
      { farmerId: farmer._id },
      process.env.JWT_SECRET || 'demo-secret',
      { expiresIn: '30d' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: farmer._id,
        name: farmer.name,
        phone: farmer.phone,
        profile: farmer.profile,
        welfare: farmer.welfare,
        ...farmerDetails
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get current user
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