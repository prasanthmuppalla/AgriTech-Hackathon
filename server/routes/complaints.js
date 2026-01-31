const express = require('express');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const Credit = require('../models/Credit');
const Farmer = require('../models/Farmer');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all complaints for a farmer
router.get('/my-complaints', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const complaints = await Complaint.getByFarmer(req.farmerId, status)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Complaint.countDocuments({ 
      farmerId: req.farmerId,
      ...(status && { status })
    });
    
    res.json({
      success: true,
      complaints,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints'
    });
  }
});

// Get single complaint details
router.get('/:complaintId', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.complaintId,
      farmerId: req.farmerId
    }).populate('farmerId', 'name phone profile.location');
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    res.json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint details'
    });
  }
});

// File new complaint
router.post('/file', [
  auth,
  body('category').isIn(['ration', 'water', 'electricity', 'road', 'healthcare', 'agriculture', 'corruption', 'other']),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']),
  body('title').notEmpty().isLength({ max: 200 }),
  body('description').notEmpty().isLength({ max: 2000 }),
  body('location.village').optional().isString(),
  body('location.district').optional().isString(),
  body('location.state').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { category, priority, title, description, location, isAnonymous } = req.body;
    
    // Get farmer details for location if not provided
    const farmer = await Farmer.findById(req.farmerId);
    
    const complaint = new Complaint({
      farmerId: req.farmerId,
      category,
      priority,
      title,
      description,
      location: {
        village: location?.village || farmer.profile.location.village,
        district: location?.district || farmer.profile.location.district,
        state: location?.state || farmer.profile.location.state,
        pincode: location?.pincode || farmer.profile.location.pincode
      },
      isAnonymous: isAnonymous || false
    });
    
    await complaint.save();
    
    // Add initial timeline entry
    complaint.timeline.push({
      status: 'pending',
      comment: 'Complaint filed successfully',
      updatedBy: 'system'
    });
    
    await complaint.save();
    
    res.status(201).json({
      success: true,
      message: 'Complaint filed successfully',
      complaint: {
        complaintId: complaint.complaintId,
        status: complaint.status,
        expectedResolutionDate: complaint.expectedResolutionDate,
        assignedTo: complaint.assignedTo
      }
    });
  } catch (error) {
    console.error('File complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to file complaint'
    });
  }
});

// Update complaint status (for authorities)
router.put('/:complaintId/status', [
  body('status').isIn(['pending', 'reviewing', 'in-progress', 'resolved', 'rejected', 'closed']),
  body('comment').notEmpty(),
  body('updatedBy').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { status, comment, updatedBy, resolutionDetails } = req.body;
    
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    // Update complaint status
    await complaint.updateStatus(status, comment, updatedBy);
    
    // If resolved, add resolution details
    if (status === 'resolved' && resolutionDetails) {
      complaint.resolutionDetails.summary = resolutionDetails.summary;
      complaint.resolutionDetails.actionTaken = resolutionDetails.actionTaken;
      complaint.resolutionDetails.resolvedBy = resolutionDetails.resolvedBy;
      await complaint.save();
      
      // Award credits to farmer
      if (complaint.credits.awarded > 0) {
        await Credit.awardCredits(
          complaint.farmerId,
          complaint.credits.awarded,
          'complaint-resolved',
          `Credits for resolved complaint: ${complaint.title}`,
          {
            complaintId: complaint.complaintId,
            priority: complaint.priority,
            category: complaint.category,
            resolutionTime: complaint.daysSinceFiled
          }
        );
      }
    }
    
    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint: {
        complaintId: complaint.complaintId,
        status: complaint.status,
        creditsAwarded: complaint.credits.awarded
      }
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint status'
    });
  }
});

// Add feedback to resolved complaint
router.post('/:complaintId/feedback', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }),
  body('feedback').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { rating, feedback } = req.body;
    
    const complaint = await Complaint.findOne({
      complaintId: req.params.complaintId,
      farmerId: req.farmerId,
      status: 'resolved'
    });
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Resolved complaint not found'
      });
    }
    
    if (complaint.resolutionDetails.satisfactionRating) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already provided for this complaint'
      });
    }
    
    // Add feedback and award bonus credits if rating is good
    await complaint.addFeedback(rating, feedback);
    
    // Award feedback bonus credits
    if (rating >= 4) {
      await Credit.awardCredits(
        req.farmerId,
        5,
        'feedback-bonus',
        `Feedback bonus for complaint: ${complaint.title}`,
        {
          complaintId: complaint.complaintId,
          rating: rating
        }
      );
    }
    
    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      bonusCredits: rating >= 4 ? 5 : 0
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

// Get farmer's credit balance and history
router.get('/credits/balance', auth, async (req, res) => {
  try {
    const balance = await Credit.getFarmerBalance(req.farmerId);
    const history = await Credit.getFarmerHistory(req.farmerId, 20);
    
    res.json({
      success: true,
      balance,
      history
    });
  } catch (error) {
    console.error('Get credit balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit information'
    });
  }
});

// Redeem credits
router.post('/credits/redeem', [
  auth,
  body('itemType').isIn(['extra-ration', 'priority-support', 'scheme-info']),
  body('amount').isInt({ min: 1 }),
  body('deliveryAddress').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    
    const { itemType, amount, deliveryAddress } = req.body;
    
    // Check if farmer has sufficient credits
    const currentBalance = await Credit.getFarmerBalance(req.farmerId);
    
    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credit balance',
        currentBalance,
        required: amount
      });
    }
    
    // Define redemption items and their costs
    const redemptionItems = {
      'extra-ration': { cost: 20, description: 'Extra Rice (1kg)' },
      'priority-support': { cost: 15, description: 'Priority Support Service' },
      'scheme-info': { cost: 5, description: 'Government Scheme Information' }
    };
    
    const item = redemptionItems[itemType];
    if (!item || amount !== item.cost) {
      return res.status(400).json({
        success: false,
        message: 'Invalid redemption item or amount'
      });
    }
    
    // Process redemption
    const redemption = await Credit.redeemCredits(
      req.farmerId,
      amount,
      itemType,
      `Redeemed: ${item.description}`,
      {
        redemptionDetails: {
          itemType,
          quantity: 1,
          deliveryAddress: deliveryAddress || 'Pickup from center',
          deliveryStatus: 'pending'
        }
      }
    );
    
    res.json({
      success: true,
      message: 'Credits redeemed successfully',
      redemption: {
        transactionId: redemption._id,
        item: item.description,
        creditsUsed: amount,
        newBalance: currentBalance - amount,
        deliveryInfo: redemption.metadata.redemptionDetails
      }
    });
  } catch (error) {
    console.error('Redeem credits error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to redeem credits'
    });
  }
});

// Get complaint statistics (for authorities dashboard)
router.get('/stats/overview', async (req, res) => {
  try {
    const { department, district, state } = req.query;
    
    let matchQuery = {};
    if (department) matchQuery['assignedTo.department'] = department;
    if (district) matchQuery['location.district'] = district;
    if (state) matchQuery['location.state'] = state;
    
    const stats = await Complaint.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          reviewing: { $sum: { $cond: [{ $eq: ['$status', 'reviewing'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
          avgResolutionTime: { $avg: '$daysSinceFiled' }
        }
      }
    ]);
    
    const categoryStats = await Complaint.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
        }
      }
    ]);
    
    res.json({
      success: true,
      overview: stats[0] || {},
      byCategory: categoryStats
    });
  } catch (error) {
    console.error('Get complaint stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint statistics'
    });
  }
});

module.exports = router;