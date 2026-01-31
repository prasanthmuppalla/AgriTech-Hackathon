const express = require('express')
const auth = require('../middleware/auth')
const Farmer = require('../models/Farmer')
const router = express.Router()

// Get farmer profile
router.get('/profile', auth, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId)
    res.json({ farmer })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update farmer profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body
    const farmer = await Farmer.findByIdAndUpdate(
      req.farmerId,
      { $set: updates },
      { new: true }
    )
    
    res.json({ farmer })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Mock dashboard data
    const dashboardData = {
      stats: {
        totalEarnings: 45230,
        groupSales: 12,
        completedOrders: 28,
        rating: 4.8
      },
      recentActivity: [
        {
          type: 'sale',
          description: 'Tomato sale completed',
          amount: 2340,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          type: 'price_alert',
          description: 'Rice price increased by 5%',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        }
      ],
      alerts: [
        {
          type: 'weather',
          message: 'Light rain expected tomorrow. Consider covering sensitive crops.',
          priority: 'medium'
        }
      ]
    }
    
    res.json(dashboardData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router