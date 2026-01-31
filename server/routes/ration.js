const express = require('express');
const { body, validationResult } = require('express-validator');
const { Distributor, Shipment, RationRecord, GovernmentScheme } = require('../models/RationDistribution');
const Farmer = require('../models/Farmer');
const Credit = require('../models/Credit');
const auth = require('../middleware/auth');

const router = express.Router();

// Get farmer's ration card details and quota
router.get('/card-details', auth, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Get current month's ration record
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let rationRecord = await RationRecord.findOne({
      farmerId: req.farmerId,
      month: currentMonth,
      year: currentYear
    }).populate('distributorId');

    // Create new record if doesn't exist
    if (!rationRecord) {
      const assignedDistributor = await Distributor.findOne({
        'location.district': farmer.profile.location.district,
        status: 'active'
      });

      if (assignedDistributor) {
        rationRecord = new RationRecord({
          farmerId: req.farmerId,
          distributorId: assignedDistributor._id,
          month: currentMonth,
          year: currentYear,
          allocatedQuota: farmer.welfare.rationCard.monthlyQuota,
          remainingQuota: farmer.welfare.rationCard.monthlyQuota,
          qrCode: `QR${farmer.aadhaarNumber}${currentMonth}${currentYear}`
        });
        await rationRecord.save();
        await rationRecord.populate('distributorId');
      }
    }

    res.json({
      success: true,
      cardDetails: {
        cardNumber: farmer.welfare.rationCard.number,
        holderName: farmer.name,
        fatherName: farmer.fatherName,
        category: farmer.welfare.rationCard.category,
        familyMembers: farmer.welfare.rationCard.familyMembers,
        status: 'active',
        validUntil: 'Dec 2025'
      },
      monthlyQuota: rationRecord ? {
        allocated: rationRecord.allocatedQuota,
        distributed: rationRecord.totalDistributed,
        remaining: rationRecord.remainingQuota,
        utilizationPercentage: rationRecord.quotaUtilization
      } : null,
      assignedCenter: rationRecord?.distributorId ? {
        name: rationRecord.distributorId.name,
        address: `${rationRecord.distributorId.location.village}, ${rationRecord.distributorId.location.district}`,
        phone: rationRecord.distributorId.contact.phone,
        officer: rationRecord.distributorId.contact.officerName,
        status: rationRecord.distributorId.status,
        operatingHours: rationRecord.distributorId.operatingHours
      } : null,
      qrCode: rationRecord?.qrCode
    });
  } catch (error) {
    console.error('Get card details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ration card details'
    });
  }
});

// Get nearby distribution centers
router.get('/distribution-centers', auth, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId);
    const { district, state } = farmer.profile.location;

    const centers = await Distributor.find({
      'location.district': district,
      'location.state': state,
      status: { $in: ['active', 'restocking'] }
    }).select('name location contact operatingHours status currentStock');

    const centersWithDistance = centers.map(center => ({
      id: center._id,
      name: center.name,
      address: `${center.location.village || ''} ${center.location.district}`.trim(),
      phone: center.contact.phone,
      officer: center.contact.officerName,
      status: center.status,
      operatingHours: center.operatingHours,
      stockStatus: {
        rice: center.currentStock.rice > 100 ? 'good' : center.currentStock.rice > 50 ? 'low' : 'critical',
        wheat: center.currentStock.wheat > 100 ? 'good' : center.currentStock.wheat > 50 ? 'low' : 'critical'
      },
      // Simulate distance calculation
      distance: Math.floor(Math.random() * 15) + 1
    }));

    res.json({
      success: true,
      centers: centersWithDistance.sort((a, b) => a.distance - b.distance)
    });
  } catch (error) {
    console.error('Get distribution centers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch distribution centers'
    });
  }
});

// Verify QR code at distribution center
router.post('/verify-qr', [
  body('qrCode').notEmpty(),
  body('distributorId').notEmpty()
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

    const { qrCode, distributorId } = req.body;

    // Find ration record by QR code
    const rationRecord = await RationRecord.findOne({ qrCode })
      .populate('farmerId')
      .populate('distributorId');

    if (!rationRecord) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR code'
      });
    }

    // Verify distributor
    if (rationRecord.distributorId._id.toString() !== distributorId) {
      return res.status(400).json({
        success: false,
        message: 'QR code not valid for this distribution center'
      });
    }

    // Check if already completed for this month
    if (rationRecord.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Monthly quota already collected'
      });
    }

    res.json({
      success: true,
      message: 'QR code verified successfully',
      farmerDetails: {
        name: rationRecord.farmerId.name,
        fatherName: rationRecord.farmerId.fatherName,
        rationCard: rationRecord.farmerId.welfare.rationCard.number,
        category: rationRecord.farmerId.welfare.rationCard.category
      },
      availableQuota: rationRecord.remainingQuota,
      recordId: rationRecord._id
    });
  } catch (error) {
    console.error('QR verification error:', error);
    res.status(500).json({
      success: false,
      message: 'QR verification failed'
    });
  }
});

// Distribute ration items
router.post('/distribute', [
  body('recordId').notEmpty(),
  body('items').isArray(),
  body('items.*.commodity').isIn(['rice', 'wheat', 'sugar', 'kerosene', 'oil']),
  body('items.*.quantity').isNumeric()
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

    const { recordId, items, verifiedBy } = req.body;

    const rationRecord = await RationRecord.findById(recordId)
      .populate('distributorId');

    if (!rationRecord) {
      return res.status(404).json({
        success: false,
        message: 'Ration record not found'
      });
    }

    // Validate quantities against remaining quota
    for (const item of items) {
      if (item.quantity > rationRecord.remainingQuota[item.commodity]) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quota for ${item.commodity}. Available: ${rationRecord.remainingQuota[item.commodity]}`
        });
      }

      // Check distributor stock
      if (item.quantity > rationRecord.distributorId.currentStock[item.commodity]) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock at distribution center for ${item.commodity}`
        });
      }
    }

    // Process distribution
    for (const item of items) {
      // Add to distributed items
      rationRecord.distributedItems.push({
        commodity: item.commodity,
        quantity: item.quantity,
        verificationMethod: 'qr-code',
        verifiedBy: verifiedBy || 'System'
      });

      // Update totals
      rationRecord.totalDistributed[item.commodity] += item.quantity;
      rationRecord.remainingQuota[item.commodity] -= item.quantity;

      // Update distributor stock
      await rationRecord.distributorId.updateStock(item.commodity, item.quantity, 'subtract');
    }

    // Update status
    const hasRemainingQuota = Object.values(rationRecord.remainingQuota).some(qty => qty > 0);
    rationRecord.status = hasRemainingQuota ? 'partial' : 'completed';

    await rationRecord.save();

    res.json({
      success: true,
      message: 'Ration distributed successfully',
      distributedItems: items,
      updatedQuota: {
        distributed: rationRecord.totalDistributed,
        remaining: rationRecord.remainingQuota,
        status: rationRecord.status
      }
    });
  } catch (error) {
    console.error('Distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Distribution failed'
    });
  }
});

// Get farmer's ration history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const history = await RationRecord.find({ farmerId: req.farmerId })
      .populate('distributorId', 'name location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await RationRecord.countDocuments({ farmerId: req.farmerId });

    res.json({
      success: true,
      history: history.map(record => ({
        month: record.month,
        year: record.year,
        status: record.status,
        distributedItems: record.distributedItems,
        totalDistributed: record.totalDistributed,
        distributionCenter: record.distributorId?.name,
        distributedAt: record.updatedAt
      })),
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ration history'
    });
  }
});

// Get government schemes
router.get('/schemes', auth, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId);
    const { category, language = 'en' } = req.query;

    let query = { status: 'active' };
    if (category) query.category = category;

    const schemes = await GovernmentScheme.find(query);

    const eligibleSchemes = schemes.filter(scheme => scheme.checkEligibility(farmer));
    const otherSchemes = schemes.filter(scheme => !scheme.checkEligibility(farmer));

    const formatScheme = (scheme) => ({
      id: scheme._id,
      schemeId: scheme.schemeId,
      name: scheme.name[language] || scheme.name.en,
      description: scheme.description[language] || scheme.description.en,
      category: scheme.category,
      benefits: scheme.benefits,
      applicationProcess: scheme.applicationProcess,
      validUntil: scheme.validUntil,
      isEligible: scheme.checkEligibility(farmer)
    });

    res.json({
      success: true,
      eligibleSchemes: eligibleSchemes.map(formatScheme),
      otherSchemes: otherSchemes.map(formatScheme)
    });
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch government schemes'
    });
  }
});

// Real-time distribution dashboard data
router.get('/dashboard/live-data', async (req, res) => {
  try {
    const { district, state } = req.query;

    // Get active distributors
    const distributors = await Distributor.find({
      ...(district && { 'location.district': district }),
      ...(state && { 'location.state': state }),
      status: 'active'
    });

    // Get recent shipments
    const recentShipments = await Shipment.find({
      status: { $in: ['in-transit', 'delivered'] },
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    }).populate('toDistributor', 'name location')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate statistics
    const totalStock = distributors.reduce((acc, dist) => {
      acc.rice += dist.currentStock.rice;
      acc.wheat += dist.currentStock.wheat;
      acc.sugar += dist.currentStock.sugar;
      return acc;
    }, { rice: 0, wheat: 0, sugar: 0 });

    const activeDeliveries = await Shipment.countDocuments({
      status: 'in-transit'
    });

    const totalBeneficiaries = distributors.reduce((acc, dist) => 
      acc + dist.assignedBeneficiaries.length, 0);

    // Get today's distribution records
    const today = new Date();
    const todayDistributions = await RationRecord.countDocuments({
      'distributedItems.distributedAt': {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      }
    });

    const totalAllocations = await RationRecord.countDocuments({
      month: today.getMonth() + 1,
      year: today.getFullYear()
    });

    const distributionRate = totalAllocations > 0 ? 
      Math.round((todayDistributions / totalAllocations) * 100) : 0;

    res.json({
      success: true,
      liveStats: {
        activeDeliveries,
        totalStock: totalStock.rice + totalStock.wheat + totalStock.sugar,
        beneficiaries: totalBeneficiaries,
        distributionRate
      },
      distributors: distributors.map(dist => ({
        id: dist._id,
        name: dist.name,
        distributorId: dist.distributorId,
        officer: dist.contact.officerName,
        status: dist.status,
        currentStock: dist.currentStock,
        location: dist.location
      })),
      recentShipments: recentShipments.map(shipment => ({
        shipmentId: shipment.shipmentId,
        destination: shipment.toDistributor.name,
        items: shipment.items,
        status: shipment.status,
        createdAt: shipment.createdAt
      })),
      liveTimeline: await generateLiveTimeline()
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// Generate live timeline events
async function generateLiveTimeline() {
  const events = [];
  
  // Recent distributions
  const recentDistributions = await RationRecord.find({
    'distributedItems.distributedAt': {
      $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
    }
  }).populate('distributorId', 'name')
    .sort({ 'distributedItems.distributedAt': -1 })
    .limit(5);

  recentDistributions.forEach(record => {
    const latestDistribution = record.distributedItems[record.distributedItems.length - 1];
    const timeAgo = Math.floor((Date.now() - latestDistribution.distributedAt) / (1000 * 60));
    
    events.push({
      time: `${timeAgo} min ago`,
      event: `Ration distributed at ${record.distributorId.name}`,
      type: 'success'
    });
  });

  // Recent shipments
  const recentShipmentUpdates = await Shipment.find({
    'timeline.timestamp': {
      $gte: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  }).populate('toDistributor', 'name')
    .sort({ 'timeline.timestamp': -1 })
    .limit(3);

  recentShipmentUpdates.forEach(shipment => {
    const latestUpdate = shipment.timeline[shipment.timeline.length - 1];
    const timeAgo = Math.floor((Date.now() - latestUpdate.timestamp) / (1000 * 60));
    
    events.push({
      time: `${timeAgo} min ago`,
      event: `Shipment ${shipment.status} - ${shipment.toDistributor.name}`,
      type: shipment.status === 'delivered' ? 'success' : 'info'
    });
  });

  return events.sort((a, b) => 
    parseInt(a.time) - parseInt(b.time)
  ).slice(0, 5);
}

// Redeem credits for extra ration
router.post('/redeem-credits', [
  auth,
  body('commodity').isIn(['rice', 'wheat', 'sugar']),
  body('quantity').isNumeric(),
  body('creditsToRedeem').isNumeric()
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

    const { commodity, quantity, creditsToRedeem } = req.body;

    // Check credit balance
    const currentBalance = await Credit.getFarmerBalance(req.farmerId);
    if (currentBalance < creditsToRedeem) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credit balance'
      });
    }

    // Get current month's ration record
    const currentDate = new Date();
    const rationRecord = await RationRecord.findOne({
      farmerId: req.farmerId,
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    });

    if (!rationRecord) {
      return res.status(404).json({
        success: false,
        message: 'No ration record found for current month'
      });
    }

    // Process credit redemption
    const redemption = await Credit.redeemCredits(
      req.farmerId,
      creditsToRedeem,
      'extra-ration',
      `Extra ${commodity}: ${quantity}kg`,
      {
        redemptionDetails: {
          itemType: 'extra-ration',
          commodity,
          quantity,
          deliveryStatus: 'pending'
        }
      }
    );

    // Add to ration record
    rationRecord.creditRedemptions.push({
      creditTransactionId: redemption._id,
      commodity,
      extraQuantity: quantity,
      redeemedAt: new Date()
    });

    // Update allocated quota
    rationRecord.allocatedQuota[commodity] += quantity;
    rationRecord.remainingQuota[commodity] += quantity;

    await rationRecord.save();

    res.json({
      success: true,
      message: 'Credits redeemed successfully for extra ration',
      redemption: {
        commodity,
        quantity,
        creditsUsed: creditsToRedeem,
        newBalance: currentBalance - creditsToRedeem
      },
      updatedQuota: rationRecord.allocatedQuota
    });
  } catch (error) {
    console.error('Credit redemption error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Credit redemption failed'
    });
  }
});

module.exports = router;