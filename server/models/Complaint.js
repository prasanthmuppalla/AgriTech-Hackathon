const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return 'CP' + Date.now().toString().slice(-6);
    }
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'ration',
      'water',
      'electricity', 
      'road',
      'healthcare',
      'agriculture',
      'corruption',
      'other'
    ]
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  location: {
    village: String,
    district: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'in-progress', 'resolved', 'rejected', 'closed'],
    default: 'pending',
    index: true
  },
  assignedTo: {
    department: {
      type: String,
      enum: [
        'district-collector',
        'water-department',
        'electricity-board',
        'health-department',
        'agriculture-department',
        'panchayat',
        'police',
        'other'
      ]
    },
    officerName: String,
    officerId: String,
    contactNumber: String
  },
  timeline: [{
    status: String,
    comment: String,
    updatedBy: String,
    updatedAt: {
      type: Date,
      default: Date.now
    },
    attachments: [String]
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  expectedResolutionDate: {
    type: Date,
    default: function() {
      // Default resolution time based on priority
      const days = {
        'urgent': 1,
        'high': 3,
        'medium': 7,
        'low': 15
      };
      return new Date(Date.now() + days[this.priority] * 24 * 60 * 60 * 1000);
    }
  },
  actualResolutionDate: {
    type: Date,
    default: null
  },
  resolutionDetails: {
    summary: String,
    actionTaken: String,
    resolvedBy: String,
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    feedback: String
  },
  credits: {
    awarded: {
      type: Number,
      default: 0
    },
    awardedAt: {
      type: Date,
      default: null
    },
    reason: String
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  tags: [String],
  relatedComplaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }],
  publicVisibility: {
    type: Boolean,
    default: false
  },
  escalationLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 3 // 0: Local, 1: District, 2: State, 3: Central
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
complaintSchema.index({ farmerId: 1, status: 1 });
complaintSchema.index({ category: 1, status: 1 });
complaintSchema.index({ priority: 1, status: 1 });
complaintSchema.index({ 'location.district': 1, 'location.state': 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ expectedResolutionDate: 1 });
complaintSchema.index({ complaintId: 1 });

// Virtual for days since filed
complaintSchema.virtual('daysSinceFiled').get(function() {
  const now = new Date();
  const diffTime = now - this.createdAt;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for days until expected resolution
complaintSchema.virtual('daysUntilResolution').get(function() {
  if (this.status === 'resolved' || this.status === 'closed') return 0;
  
  const now = new Date();
  const diffTime = this.expectedResolutionDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update lastUpdated
complaintSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  
  // Set urgent flag based on priority
  this.isUrgent = this.priority === 'urgent';
  
  // Auto-assign department based on category
  if (!this.assignedTo.department) {
    const departmentMapping = {
      'ration': 'district-collector',
      'water': 'water-department',
      'electricity': 'electricity-board',
      'healthcare': 'health-department',
      'agriculture': 'agriculture-department',
      'road': 'panchayat',
      'corruption': 'district-collector',
      'other': 'district-collector'
    };
    this.assignedTo.department = departmentMapping[this.category];
  }
  
  next();
});

// Static method to get complaints by farmer
complaintSchema.statics.getByFarmer = function(farmerId, status = null) {
  const query = { farmerId };
  if (status) query.status = status;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('farmerId', 'name phone profile.location');
};

// Static method to get complaints by department
complaintSchema.statics.getByDepartment = function(department, status = null) {
  const query = { 'assignedTo.department': department };
  if (status) query.status = status;
  
  return this.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .populate('farmerId', 'name phone profile.location');
};

// Instance method to update status
complaintSchema.methods.updateStatus = function(newStatus, comment, updatedBy) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    comment: comment,
    updatedBy: updatedBy
  });
  
  if (newStatus === 'resolved') {
    this.actualResolutionDate = new Date();
    
    // Award credits based on priority and resolution time
    const creditMapping = {
      'urgent': 25,
      'high': 20,
      'medium': 15,
      'low': 10
    };
    
    // Bonus for early resolution
    const expectedDays = Math.ceil((this.expectedResolutionDate - this.createdAt) / (1000 * 60 * 60 * 24));
    const actualDays = Math.ceil((this.actualResolutionDate - this.createdAt) / (1000 * 60 * 60 * 24));
    
    let credits = creditMapping[this.priority];
    if (actualDays <= expectedDays / 2) {
      credits += 5; // Early resolution bonus
    }
    
    this.credits.awarded = credits;
    this.credits.awardedAt = new Date();
    this.credits.reason = `Complaint resolved - ${this.priority} priority`;
  }
  
  return this.save();
};

// Instance method to add feedback
complaintSchema.methods.addFeedback = function(rating, feedback) {
  this.resolutionDetails.satisfactionRating = rating;
  this.resolutionDetails.feedback = feedback;
  
  // Award bonus credits for feedback
  if (rating >= 4) {
    this.credits.awarded += 5;
    this.credits.reason += ' + Positive feedback bonus';
  }
  
  return this.save();
};

module.exports = mongoose.model('Complaint', complaintSchema);