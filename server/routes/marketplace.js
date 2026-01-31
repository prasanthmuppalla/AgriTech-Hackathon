const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()

// Mock marketplace data
const mockProducts = [
  { id: 1, name: 'Rice', price: 2150, unit: 'quintal', farmer: 'Farmer A', location: 'Punjab' },
  { id: 2, name: 'Wheat', price: 2350, unit: 'quintal', farmer: 'Farmer B', location: 'Haryana' },
  { id: 3, name: 'Tomato', price: 45, unit: 'kg', farmer: 'Farmer C', location: 'Karnataka' }
]

// Get current market prices
router.get('/prices', (req, res) => {
  res.json({ prices: mockProducts })
})

// Create new listing
router.post('/listings', auth, (req, res) => {
  const { crop, quantity, price, description } = req.body
  
  const listing = {
    id: Date.now(),
    farmerId: req.farmerId,
    crop,
    quantity,
    price,
    description,
    status: 'active',
    createdAt: new Date()
  }
  
  res.json({ success: true, listing })
})

// Get farmer's listings
router.get('/my-listings', auth, (req, res) => {
  const mockListings = [
    { id: 1, crop: 'Tomato', quantity: 100, price: 45, status: 'active' },
    { id: 2, crop: 'Rice', quantity: 50, price: 2150, status: 'sold' }
  ]
  
  res.json({ listings: mockListings })
})

module.exports = router