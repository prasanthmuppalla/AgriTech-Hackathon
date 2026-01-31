const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
    index: true
  },
  cropType: {
    type: String,
    required: true,
    enum: ['Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Corn', 'Millet', 'Mustard', 'Sugarcane', 'Cotton', 'Other']
  },
  variety: {
    type: String,
    default: null // e.g., "Basmati", "Desi Wheat"
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'quintal', 'ton', 'bag'],
    default: 'quintal'
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  quality: {
    type: String,
    enum: ['Premium', 'Grade A', 'Grade B', 'Standard'],
    default: 'Standard'
  },
  harvestDate: {
    type: Date,
    default: null
  },
  location: {
    village: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      default: null
    }
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    preferredTime: {
      type: String,
      default: 'Anytime'
    }
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'cancelled'],
    default: 'active',
    index: true
  },
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  inquiries: [{
    buyerName: String,
    buyerPhone: String,
    message: String,
    inquiredAt: {
      type: Date,
      default: Date.now
    }
  }],
  isOrganic: {
    type: Boolean,
    default: false
  },
  certifications: [{
    type: String,
    enum: ['Organic', 'Fair Trade', 'ISO', 'FSSAI']
  }],
  availableFrom: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  groupSelling: {
    isGroupListing: {
      type: Boolean,
      default: false
    },
    groupId: {
      type: String,
      default: null
    },
    targetQuantity: {
      type: Number,
      default: null
    },
    currentQuantity: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
listingSchema.index({ farmerId: 1 });
listingSchema.index({ cropType: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ 'location.district': 1, 'location.state': 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ expiresAt: 1 });

// Virtual for calculating days remaining
listingSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const diffTime = this.expiresAt - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate total price
listingSchema.pre('save', function(next) {
  if (this.isModified('quantity') || this.isModified('pricePerUnit')) {
    this.totalPrice = this.quantity * this.pricePerUnit;
  }
  next();
});

module.exports = mongoose.model('Listing', listingSchema);