const express = require('express')
const auth = require('../middleware/auth')
const axios = require('axios')
const router = express.Router()

// Chat with AI advisory
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, language } = req.body
    
    // Forward to AI service
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:5001'}/chat`, {
      message,
      language,
      farmer_profile: req.farmer?.profile || {}
    })
    
    res.json(aiResponse.data)
  } catch (error) {
    console.error('AI service error:', error.message)
    res.json({
      response: "I'm currently unavailable. Please try again later or contact your local agriculture officer.",
      language: req.body.language || 'en'
    })
  }
})

// Image analysis for pest/disease detection
router.post('/analyze-image', auth, async (req, res) => {
  try {
    const { image, type } = req.body
    
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:5001'}/image-analysis`, {
      image,
      type
    })
    
    res.json(aiResponse.data)
  } catch (error) {
    console.error('Image analysis error:', error.message)
    res.status(500).json({ error: 'Image analysis failed' })
  }
})

// Get weather information
router.get('/weather', auth, (req, res) => {
  // Mock weather data
  const weather = {
    current: {
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      condition: 'Partly Cloudy'
    },
    forecast: [
      { date: '2024-01-01', temp: { min: 22, max: 30 }, condition: 'Light Rain', rainfall: 5 },
      { date: '2024-01-02', temp: { min: 24, max: 32 }, condition: 'Sunny', rainfall: 0 },
      { date: '2024-01-03', temp: { min: 23, max: 29 }, condition: 'Cloudy', rainfall: 0 }
    ]
  }
  
  res.json(weather)
})

module.exports = router