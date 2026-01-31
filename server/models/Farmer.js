const mongoose = require('mongoose')

const farmerSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[6-9]\d{9}$/
  },
  name: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profile: {
    language: {
      type: String,
      enum: ['en', 'hi', 'ta', 'te', 'bn'],
      default: 'en'
    },
    location: {
      state: String,
      district: String,
      village: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    farmDetails: {
      totalLand: Number, // in acres
      crops: [{
        name: String,
        area: Number,
        season: String,
        variety: String
      }],
      soilType: String,
      irrigationType: String
    },
    documents: {
      aadhaar: String,
      rationCard: String,
      landRecords: String,
      bankAccount: {
        accountNumber: String,
        ifsc: String,
        bankName: String
      }
    }
  },
  welfare: {
    rationCard: {
      number: String,
      category: {
        type: String,
        enum: ['APL', 'BPL', 'AAY']
      },
      familyMembers: Number,
      monthlyQuota: {
        rice: Number,
        wheat: Number,
        sugar: Number,
        kerosene: Number
      },
      lastCollection: Date
    },
    schemes: [{
      schemeName: String,
      applicationId: String,
      status: String,
      appliedDate: Date,
      amount: Number
    }]
  },
  marketplace: {
    rating: {
      type: Number,
      default: 5.0
    },
    totalSales: {
      type: Number,
      default: 0
    },
    completedOrders: {
      type: Number,
      default: 0
    },
    preferredBuyers: [String]
  },
  financial: {
    creditScore: {
      type: Number,
      default: 650
    },
    loans: [{
      loanId: String,
      amount: Number,
      purpose: String,
      status: String,
      appliedDate: Date
    }],
    insurance: [{
      policyId: String,
      type: String,
      premium: Number,
      coverage: Number,
      expiryDate: Date
    }]
  }
}, {
  timestamps: true
})

// Indexes for better performance
farmerSchema.index({ phone: 1 })
farmerSchema.index({ 'profile.location.district': 1 })
farmerSchema.index({ 'welfare.rationCard.number': 1 })

module.exports = mongoose.model('Farmer', farmerSchema)