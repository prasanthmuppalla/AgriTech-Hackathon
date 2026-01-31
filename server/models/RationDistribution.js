const mongoose = require('mongoose');

// Distributor/Center Model
const distributorSchema = new mongoose.Schema({
  distributorId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'DIS' + Date.now().toString().slice(-6);
    }
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['primary', 'sub-center', 'mobile', 'district'],
    default: 'primary'
  },
  location: {
    village: String,
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    officerName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: String
  },
  capacity: {
    maxBeneficiaries: {
      type: Number,
      default: 500
    },
    storageCapacity: {
      rice: Number, // in kg
      wheat: Number,
      sugar: Number,
      kerosene: Number, // in liters
      oil: Number // in liters
    }
  },
  currentStock: {
    rice: {
      type: Number,
      default: 0
    },
    wheat: {
      type: Number,
      default: 0
    },
    sugar: {
      type: Number,
      default: 0
    },
    kerosene: {
      type: Number,
      default: 0
    },
    oil: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'restocking'],
    default: 'active'
  },
  operatingHours: {
    openTime: {
      type: String,
      default: '09:00'
    },
    closeTime: {
      type: String,
      default: '17:00'
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  assignedBeneficiaries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer'
  }]
}, {
  timestamps: true
});

// Shipment Model
const shipmentSchema = new mongoose.Schema({
  shipmentId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'SH' + new Date().getFullYear() + Date.now().toString().slice(-6);
    }
  },
  fromWarehouse: {
    name: String,
    location: String,
    warehouseId: String
  },
  toDistributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Distributor',
    required: true
  },
  items: [{
    commodity: {
      type: String,
      enum: ['rice', 'wheat', 'sugar', 'kerosene', 'oil'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'liter'],
      required: true
    },
    batchNumber: String,
    expiryDate: Date,
    quality: {
      type: String,
      enum: ['A', 'B', 'C'],
      default: 'A'
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: String,
    notes: String,
    updatedBy: String
  }],
  transportDetails: {
    vehicleNumber: String,
    driverName: String,
    driverPhone: String,
    estimatedDelivery: Date
  },
  deliveryConfirmation: {
    receivedBy: String,
    receivedAt: Date,
    condition: String,
    discrepancies: String
  }
}, {
  timestamps: true
});

// Ration Record Model
const rationRecordSchema = new mongoose.Schema({
  recordId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'RR' + Date.now().toString().slice(-6);
    }
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  distributorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Distributor',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  allocatedQuota: {
    rice: Number,
    wheat: Number,
    sugar: Number,
    kerosene: Number,
    oil: Number
  },
  distributedItems: [{
    commodity: {
      type: String,
      enum: ['rice', 'wheat', 'sugar', 'kerosene', 'oil'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    distributedAt: {
      type: Date,
      default: Date.now
    },
    verificationMethod: {
      type: String,
      enum: ['qr-code', 'biometric', 'manual'],
      default: 'qr-code'
    },
    verifiedBy: String
  }],
  totalDistributed: {
    rice: {
      type: Number,
      default: 0
    },
    wheat: {
      type: Number,
      default: 0
    },
    sugar: {
      type: Number,
      default: 0
    },
    kerosene: {
      type: Number,
      default: 0
    },
    oil: {
      type: Number,
      default: 0
    }
  },
  remainingQuota: {
    rice: {
      type: Number,
      default: 0
    },
    wheat: {
      type: Number,
      default: 0
    },
    sugar: {
      type: Number,
      default: 0
    },
    kerosene: {
      type: Number,
      default: 0
    },
    oil: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'expired'],
    default: 'pending'
  },
  qrCode: {
    type: String,
    unique: true
  },
  creditRedemptions: [{
    creditTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Credit'
    },
    commodity: String,
    extraQuantity: Number,
    redeemedAt: Date
  }]
}, {
  timestamps: true
});

// Government Scheme Model
const governmentSchemeSchema = new mongoose.Schema({
  schemeId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    en: String,
    hi: String,
    te: String
  },
  description: {
    en: String,
    hi: String,
    te: String
  },
  category: {
    type: String,
    enum: ['subsidy', 'insurance', 'loan', 'direct-benefit', 'training'],
    required: true
  },
  eligibilityCriteria: {
    landSize: {
      min: Number,
      max: Number
    },
    income: {
      min: Number,
      max: Number
    },
    category: [String], // BPL, APL, AAY
    crops: [String],
    age: {
      min: Number,
      max: Number
    }
  },
  benefits: {
    amount: Number,
    frequency: {
      type: String,
      enum: ['one-time', 'monthly', 'quarterly', 'yearly']
    },
    description: String
  },
  applicationProcess: {
    documents: [String],
    steps: [String],
    onlineUrl: String,
    offlineProcess: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  validFrom: Date,
  validUntil: Date
}, {
  timestamps: true
});

// Indexes for better performance
distributorSchema.index({ 'location.district': 1, 'location.state': 1 });
distributorSchema.index({ status: 1 });
distributorSchema.index({ distributorId: 1 });

shipmentSchema.index({ toDistributor: 1, status: 1 });
shipmentSchema.index({ createdAt: -1 });
shipmentSchema.index({ shipmentId: 1 });

rationRecordSchema.index({ farmerId: 1, month: 1, year: 1 });
rationRecordSchema.index({ distributorId: 1, status: 1 });
rationRecordSchema.index({ qrCode: 1 });

governmentSchemeSchema.index({ category: 1, status: 1 });
governmentSchemeSchema.index({ schemeId: 1 });

// Virtual for calculating quota utilization
rationRecordSchema.virtual('quotaUtilization').get(function() {
  const total = this.allocatedQuota.rice + this.allocatedQuota.wheat + this.allocatedQuota.sugar;
  const distributed = this.totalDistributed.rice + this.totalDistributed.wheat + this.totalDistributed.sugar;
  return total > 0 ? (distributed / total) * 100 : 0;
});

// Method to update stock after distribution
distributorSchema.methods.updateStock = function(commodity, quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.currentStock[commodity] = Math.max(0, this.currentStock[commodity] - quantity);
  } else {
    this.currentStock[commodity] += quantity;
  }
  this.currentStock.lastUpdated = new Date();
  return this.save();
};

// Method to check eligibility for scheme
governmentSchemeSchema.methods.checkEligibility = function(farmer) {
  const criteria = this.eligibilityCriteria;
  
  // Check land size
  if (criteria.landSize) {
    const landSize = parseFloat(farmer.profile.farmDetails.totalLand);
    if (landSize < criteria.landSize.min || landSize > criteria.landSize.max) {
      return false;
    }
  }
  
  // Check category
  if (criteria.category && criteria.category.length > 0) {
    if (!criteria.category.includes(farmer.welfare.rationCard.category)) {
      return false;
    }
  }
  
  return true;
};

const Distributor = mongoose.model('Distributor', distributorSchema);
const Shipment = mongoose.model('Shipment', shipmentSchema);
const RationRecord = mongoose.model('RationRecord', rationRecordSchema);
const GovernmentScheme = mongoose.model('GovernmentScheme', governmentSchemeSchema);

module.exports = {
  Distributor,
  Shipment,
  RationRecord,
  GovernmentScheme
};