const mongoose = require('mongoose');
const Farmer = require('../models/Farmer');
const Complaint = require('../models/Complaint');
const Credit = require('../models/Credit');
require('dotenv').config();

// Demo farmers data
const demoFarmers = [
  {
    aadhaarNumber: '123456789012',
    name: 'Ram Kumar Sharma',
    fatherName: 'Shyam Lal Sharma',
    phone: '9876543210',
    profile: {
      language: 'hi',
      location: {
        village: 'Rampur',
        district: 'Meerut',
        state: 'Uttar Pradesh',
        pincode: '250001'
      },
      farmDetails: {
        totalLand: '2.5 acres',
        crops: [
          { name: 'Wheat', area: 1.5, season: 'Rabi' },
          { name: 'Rice', area: 1.0, season: 'Kharif' }
        ]
      }
    },
    welfare: {
      rationCard: {
        number: 'UP1234567890',
        category: 'BPL',
        familyMembers: 4,
        monthlyQuota: {
          rice: 5,
          wheat: 5,
          sugar: 1,
          kerosene: 2
        }
      }
    }
  },
  {
    aadhaarNumber: '234567890123',
    name: 'Sunita Devi',
    fatherName: 'Rajesh Kumar',
    phone: '9765432109',
    profile: {
      language: 'hi',
      location: {
        village: 'Gokulpur',
        district: 'Ghaziabad',
        state: 'Uttar Pradesh',
        pincode: '201001'
      },
      farmDetails: {
        totalLand: '1.8 acres',
        crops: [
          { name: 'Tomato', area: 0.8, season: 'Summer' },
          { name: 'Potato', area: 1.0, season: 'Winter' }
        ]
      }
    },
    welfare: {
      rationCard: {
        number: 'UP2345678901',
        category: 'BPL',
        familyMembers: 3,
        monthlyQuota: {
          rice: 4,
          wheat: 4,
          sugar: 1,
          kerosene: 1.5
        }
      }
    }
  },
  {
    aadhaarNumber: '345678901234',
    name: 'Mukesh Patel',
    fatherName: 'Harishchandra Patel',
    phone: '9654321098',
    profile: {
      language: 'en',
      location: {
        village: 'Kisanganj',
        district: 'Bulandshahr',
        state: 'Uttar Pradesh',
        pincode: '203001'
      },
      farmDetails: {
        totalLand: '3.2 acres',
        crops: [
          { name: 'Corn', area: 1.5, season: 'Kharif' },
          { name: 'Mustard', area: 1.7, season: 'Rabi' }
        ]
      }
    },
    welfare: {
      rationCard: {
        number: 'UP3456789012',
        category: 'APL',
        familyMembers: 5,
        monthlyQuota: {
          rice: 6,
          wheat: 6,
          sugar: 1.5,
          kerosene: 2.5
        }
      }
    }
  }
];

// Demo complaints data
const demoComplaints = [
  {
    category: 'water',
    priority: 'high',
    title: 'Water Supply Disruption in Rampur Village',
    description: 'There has been no water supply for the past 3 days in our village. The hand pump is not working and the pipeline seems to be damaged. This is affecting irrigation and daily household needs.',
    location: {
      village: 'Rampur',
      district: 'Meerut',
      state: 'Uttar Pradesh'
    },
    status: 'reviewing',
    timeline: [
      {
        status: 'pending',
        comment: 'Complaint filed successfully',
        updatedBy: 'system'
      },
      {
        status: 'reviewing',
        comment: 'Complaint assigned to Water Department for review',
        updatedBy: 'District Collector Office'
      }
    ]
  },
  {
    category: 'ration',
    priority: 'medium',
    title: 'Ration Card Not Working at Distribution Center',
    description: 'My ration card is not being accepted at the local distribution center. The scanner shows an error every time I try to collect my monthly quota.',
    location: {
      village: 'Rampur',
      district: 'Meerut',
      state: 'Uttar Pradesh'
    },
    status: 'resolved',
    timeline: [
      {
        status: 'pending',
        comment: 'Complaint filed successfully',
        updatedBy: 'system'
      },
      {
        status: 'reviewing',
        comment: 'Complaint forwarded to Food & Civil Supplies Department',
        updatedBy: 'District Collector Office'
      },
      {
        status: 'resolved',
        comment: 'Ration card database updated. Issue resolved.',
        updatedBy: 'Food & Civil Supplies Officer'
      }
    ],
    resolutionDetails: {
      summary: 'Ration card database synchronization issue resolved',
      actionTaken: 'Updated farmer details in central database and reset card status',
      resolvedBy: 'Food & Civil Supplies Department',
      satisfactionRating: 5
    },
    credits: {
      awarded: 15,
      awardedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      reason: 'Complaint resolved - medium priority + feedback bonus'
    },
    actualResolutionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
];

// Demo credit transactions
const demoCreditTransactions = [
  {
    transactionType: 'earned',
    amount: 15,
    source: 'complaint-resolved',
    description: 'Credits for resolved complaint: Ration Card Not Working',
    balanceBefore: 0,
    balanceAfter: 15,
    metadata: {
      complaintId: 'CP123456',
      priority: 'medium',
      category: 'ration',
      resolutionTime: 5,
      rating: 5
    }
  },
  {
    transactionType: 'earned',
    amount: 5,
    source: 'feedback-bonus',
    description: 'Feedback bonus for complaint: Ration Card Issue',
    balanceBefore: 15,
    balanceAfter: 20,
    metadata: {
      complaintId: 'CP123456',
      rating: 5
    }
  },
  {
    transactionType: 'earned',
    amount: 10,
    source: 'complaint-resolved',
    description: 'Credits for resolved complaint: Road Repair Request',
    balanceBefore: 20,
    balanceAfter: 30,
    metadata: {
      complaintId: 'CP123457',
      priority: 'low',
      category: 'road',
      resolutionTime: 10
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agritech_platform');
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Farmer.deleteMany({});
    await Complaint.deleteMany({});
    await Credit.deleteMany({});

    // Seed farmers
    console.log('Seeding farmers...');
    const farmers = await Farmer.insertMany(demoFarmers);
    console.log(`✅ Created ${farmers.length} farmers`);

    // Seed complaints
    console.log('Seeding complaints...');
    const complaints = [];
    for (let i = 0; i < demoComplaints.length; i++) {
      const complaintData = {
        ...demoComplaints[i],
        farmerId: farmers[i % farmers.length]._id
      };
      complaints.push(complaintData);
    }
    const createdComplaints = await Complaint.insertMany(complaints);
    console.log(`✅ Created ${createdComplaints.length} complaints`);

    // Seed credit transactions
    console.log('Seeding credit transactions...');
    const creditTransactions = [];
    for (let i = 0; i < demoCreditTransactions.length; i++) {
      const creditData = {
        ...demoCreditTransactions[i],
        farmerId: farmers[0]._id, // Assign to first farmer
        sourceId: createdComplaints[0]._id,
        sourceModel: 'Complaint'
      };
      creditTransactions.push(creditData);
    }
    await Credit.insertMany(creditTransactions);
    console.log(`✅ Created ${creditTransactions.length} credit transactions`);

    // Create additional sample complaints for other farmers
    console.log('Creating additional sample complaints...');
    const additionalComplaints = [
      {
        farmerId: farmers[1]._id,
        category: 'electricity',
        priority: 'urgent',
        title: 'Power Cut Affecting Irrigation',
        description: 'Frequent power cuts are affecting our irrigation schedule. Crops are getting damaged due to lack of water.',
        location: farmers[1].profile.location,
        status: 'in-progress'
      },
      {
        farmerId: farmers[2]._id,
        category: 'agriculture',
        priority: 'medium',
        title: 'Need Fertilizer Subsidy Information',
        description: 'I need information about the new fertilizer subsidy scheme and how to apply for it.',
        location: farmers[2].profile.location,
        status: 'pending'
      }
    ];

    await Complaint.insertMany(additionalComplaints);
    console.log(`✅ Created ${additionalComplaints.length} additional complaints`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Farmers: ${farmers.length}`);
    console.log(`📝 Complaints: ${createdComplaints.length + additionalComplaints.length}`);
    console.log(`💰 Credit Transactions: ${creditTransactions.length}`);
    
    console.log('\n🔑 Demo Login Credentials:');
    farmers.forEach((farmer, index) => {
      console.log(`${index + 1}. Aadhaar: ${farmer.aadhaarNumber} | Name: ${farmer.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;