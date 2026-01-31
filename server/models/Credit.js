const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
    index: true
  },
  transactionType: {
    type: String,
    enum: ['earned', 'redeemed', 'bonus', 'penalty', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: [
      'complaint-resolved',
      'feedback-bonus',
      'early-resolution',
      'extra-ration',
      'priority-support',
      'scheme-info',
      'referral-bonus',
      'system-adjustment'
    ],
    required: true
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'sourceModel'
  },
  sourceModel: {
    type: String,
    enum: ['Complaint', 'Listing', 'RationRecord']
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  balanceBefore: {
    type: Number,
    required: true,
    default: 0
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  metadata: {
    complaintId: String,
    priority: String,
    category: String,
    resolutionTime: Number, // in days
    rating: Number,
    redemptionDetails: {
      itemType: String,
      quantity: Number,
      deliveryAddress: String,
      deliveryStatus: String
    }
  },
  processedBy: {
    type: String,
    default: 'system'
  },
  expiresAt: {
    type: Date,
    default: null // Credits don't expire by default
  }
}, {
  timestamps: true
});

// Indexes for better performance
creditSchema.index({ farmerId: 1, createdAt: -1 });
creditSchema.index({ transactionType: 1 });
creditSchema.index({ source: 1 });
creditSchema.index({ status: 1 });
creditSchema.index({ createdAt: -1 });

// Static method to get farmer's credit balance
creditSchema.statics.getFarmerBalance = async function(farmerId) {
  const result = await this.aggregate([
    { $match: { farmerId: mongoose.Types.ObjectId(farmerId), status: 'completed' } },
    {
      $group: {
        _id: null,
        totalEarned: {
          $sum: {
            $cond: [
              { $in: ['$transactionType', ['earned', 'bonus']] },
              '$amount',
              0
            ]
          }
        },
        totalRedeemed: {
          $sum: {
            $cond: [
              { $eq: ['$transactionType', 'redeemed'] },
              '$amount',
              0
            ]
          }
        }
      }
    }
  ]);
  
  if (result.length === 0) return 0;
  return result[0].totalEarned - result[0].totalRedeemed;
};

// Static method to get farmer's credit history
creditSchema.statics.getFarmerHistory = function(farmerId, limit = 50) {
  return this.find({ farmerId, status: 'completed' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('sourceId');
};

// Static method to award credits
creditSchema.statics.awardCredits = async function(farmerId, amount, source, description, metadata = {}) {
  const currentBalance = await this.getFarmerBalance(farmerId);
  
  const creditTransaction = new this({
    farmerId,
    transactionType: 'earned',
    amount,
    source,
    description,
    balanceBefore: currentBalance,
    balanceAfter: currentBalance + amount,
    metadata
  });
  
  return await creditTransaction.save();
};

// Static method to redeem credits
creditSchema.statics.redeemCredits = async function(farmerId, amount, source, description, metadata = {}) {
  const currentBalance = await this.getFarmerBalance(farmerId);
  
  if (currentBalance < amount) {
    throw new Error('Insufficient credit balance');
  }
  
  const creditTransaction = new this({
    farmerId,
    transactionType: 'redeemed',
    amount,
    source,
    description,
    balanceBefore: currentBalance,
    balanceAfter: currentBalance - amount,
    metadata
  });
  
  return await creditTransaction.save();
};

// Instance method to process redemption
creditSchema.methods.processRedemption = function(status, details = {}) {
  this.status = status;
  if (details) {
    this.metadata.redemptionDetails = { ...this.metadata.redemptionDetails, ...details };
  }
  return this.save();
};

module.exports = mongoose.model('Credit', creditSchema);