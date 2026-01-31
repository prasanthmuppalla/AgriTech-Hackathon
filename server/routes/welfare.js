const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()

// Get ration card details
router.get('/ration-card', auth, async (req, res) => {
  try {
    // Mock ration card data
    const rationCard = {
      number: '1234567890123',
      category: 'BPL',
      familyMembers: 4,
      monthlyQuota: {
        rice: { allocated: 5, consumed: 0, remaining: 5 },
        wheat: { allocated: 5, consumed: 0, remaining: 5 },
        sugar: { allocated: 1, consumed: 1, remaining: 0 },
        kerosene: { allocated: 2, consumed: 0, remaining: 2 }
      },
      lastCollection: new Date('2024-01-15'),
      validUntil: new Date('2024-12-31')
    }
    
    res.json({ rationCard })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Verify QR code for distribution
router.post('/verify-qr', auth, (req, res) => {
  try {
    const { qrCode } = req.body
    
    // Mock QR verification
    const verification = {
      valid: true,
      shopName: 'Fair Price Shop #123',
      shopkeeper: 'Ram Kumar',
      location: 'Main Market, Village XYZ',
      availableItems: ['rice', 'wheat', 'kerosene'],
      timestamp: new Date()
    }
    
    res.json({ verification })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'QR verification failed' })
  }
})

// Record distribution transaction
router.post('/distribute', auth, (req, res) => {
  try {
    const { items, shopId, qrCode } = req.body
    
    // Mock distribution record
    const transaction = {
      id: Date.now(),
      farmerId: req.farmerId,
      shopId,
      items,
      timestamp: new Date(),
      status: 'completed'
    }
    
    res.json({ success: true, transaction })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Distribution failed' })
  }
})

// Get government schemes
router.get('/schemes', auth, (req, res) => {
  const schemes = [
    {
      id: 1,
      name: 'PM-KISAN',
      description: 'Direct income support of ₹6000 per year',
      eligibility: 'All farmers with cultivable land',
      amount: 6000,
      status: 'active'
    },
    {
      id: 2,
      name: 'Crop Insurance (PMFBY)',
      description: 'Insurance coverage for crop losses',
      eligibility: 'All farmers',
      premium: '2% of sum insured',
      status: 'active'
    },
    {
      id: 3,
      name: 'Drip Irrigation Subsidy',
      description: 'Up to 90% subsidy on drip irrigation',
      eligibility: 'Small and marginal farmers',
      subsidy: '90%',
      status: 'active'
    }
  ]
  
  res.json({ schemes })
})

module.exports = router