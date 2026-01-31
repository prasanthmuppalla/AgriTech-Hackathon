# 🎯 Complaints System with Credit Rewards

## 📋 **System Overview**

The complaints system allows farmers to file complaints to higher authorities and earn credits when issues are resolved. Credits can be redeemed for extra ration, priority support, and other benefits.

## 🔄 **Complete Workflow**

### **1. Farmer Files Complaint**
```
Login → Complaints Page → Fill Form → Submit
```
- **Categories**: Ration, Water, Electricity, Road, Healthcare, Agriculture, Corruption
- **Priority Levels**: Low, Medium, High, Urgent
- **Auto-Assignment**: System assigns to appropriate department

### **2. Authority Reviews Complaint**
```
Pending → Reviewing → In-Progress → Resolved/Rejected
```
- **Department Assignment**: Based on complaint category
- **Timeline Tracking**: Every status change is logged
- **Expected Resolution**: Auto-calculated based on priority

### **3. Credit Rewards System**
```
Complaint Resolved → Credits Awarded → Farmer Notification
```
- **Base Credits**: 10-25 based on priority level
- **Early Resolution Bonus**: +5 credits if resolved quickly
- **Feedback Bonus**: +5 credits for positive feedback (4+ stars)

### **4. Credit Redemption**
```
Credits Earned → Credit Store → Redeem Items → Delivery/Pickup
```

## 💰 **Credit System Details**

### **Earning Credits**
| Action | Credits | Conditions |
|--------|---------|------------|
| Low Priority Resolved | 10 | Basic resolution |
| Medium Priority Resolved | 15 | Standard resolution |
| High Priority Resolved | 20 | Important issue |
| Urgent Priority Resolved | 25 | Critical issue |
| Early Resolution Bonus | +5 | Resolved before expected date |
| Positive Feedback | +5 | Rating 4+ stars |

### **Redeeming Credits**
| Item | Cost | Description |
|------|------|-------------|
| Extra Rice (1kg) | 20 | Additional ration quota |
| Priority Support | 15 | Fast-track future complaints |
| Scheme Information | 5 | Government scheme details |

## 🗄️ **Database Structure**

### **Complaint Model**
```javascript
{
  complaintId: "CP123456",
  farmerId: ObjectId,
  category: "water|ration|electricity|...",
  priority: "low|medium|high|urgent",
  title: "Brief description",
  description: "Detailed issue description",
  status: "pending|reviewing|resolved|...",
  assignedTo: {
    department: "water-department",
    officerName: "John Doe"
  },
  timeline: [
    {
      status: "pending",
      comment: "Complaint filed",
      updatedBy: "system",
      updatedAt: Date
    }
  ],
  credits: {
    awarded: 15,
    awardedAt: Date,
    reason: "Complaint resolved - medium priority"
  }
}
```

### **Credit Model**
```javascript
{
  farmerId: ObjectId,
  transactionType: "earned|redeemed",
  amount: 15,
  source: "complaint-resolved",
  description: "Credits for resolved complaint",
  balanceBefore: 10,
  balanceAfter: 25,
  metadata: {
    complaintId: "CP123456",
    priority: "medium",
    rating: 5
  }
}
```

## 🔌 **API Endpoints**

### **Farmer Endpoints**
```javascript
// File new complaint
POST /api/complaints/file
{
  "category": "water",
  "priority": "high",
  "title": "Water supply issue",
  "description": "No water for 3 days",
  "location": {
    "village": "Rampur",
    "district": "Meerut"
  }
}

// Get my complaints
GET /api/complaints/my-complaints?status=pending&page=1

// Get credit balance
GET /api/complaints/credits/balance

// Redeem credits
POST /api/complaints/credits/redeem
{
  "itemType": "extra-ration",
  "amount": 20,
  "deliveryAddress": "Village address"
}

// Add feedback
POST /api/complaints/CP123456/feedback
{
  "rating": 5,
  "feedback": "Issue resolved quickly"
}
```

### **Authority Endpoints**
```javascript
// Update complaint status
PUT /api/complaints/CP123456/status
{
  "status": "resolved",
  "comment": "Water pipeline repaired",
  "updatedBy": "Water Department Officer",
  "resolutionDetails": {
    "summary": "Pipeline leak fixed",
    "actionTaken": "Replaced damaged section",
    "resolvedBy": "Water Department"
  }
}

// Get department complaints
GET /api/complaints?department=water-department&status=pending
```

## 🚀 **Setup Instructions**

### **1. Database Setup**
```bash
# Run the setup script
setup-database.bat

# Or manually:
cd server
npm install
npm run seed
```

### **2. Start Services**
```bash
# Start MongoDB (if not running)
net start MongoDB

# Start server
cd server
npm run dev

# Server runs on http://localhost:5000
```

### **3. Test the System**
```bash
# Open complaints.html in browser
# Login with demo credentials:
# Aadhaar: 123456789012
# OTP: Any 6-digit number

# Test workflow:
1. File a new complaint
2. Check complaint status
3. View credit balance
4. Redeem credits in credit store
```

## 📱 **Frontend Features**

### **Complaints Page (`complaints.html`)**
- **Multilingual**: English, Hindi, Telugu support
- **Responsive Design**: Works on mobile and desktop
- **Real-time Updates**: Status changes reflect immediately
- **Credit Display**: Shows current balance prominently
- **Form Validation**: Prevents invalid submissions

### **Key Components**
1. **File Complaint Form**: Category, priority, description
2. **My Complaints List**: Status tracking with timeline
3. **Credit Balance Card**: Current credits and earning history
4. **Credit Store Modal**: Redemption options
5. **Helpline Numbers**: Emergency contact information

## 🔧 **Authority Dashboard** (Future Enhancement)

```javascript
// Authority can:
- View assigned complaints by department
- Update complaint status with comments
- Upload resolution documents
- Generate department reports
- Track resolution metrics
```

## 📊 **Analytics & Reporting**

```javascript
// System tracks:
- Complaint resolution times
- Credit distribution patterns
- Department performance metrics
- Farmer satisfaction ratings
- Popular complaint categories
```

## 🎯 **Demo Scenarios**

### **Scenario 1: Water Supply Issue**
1. Farmer files urgent water complaint
2. System assigns to Water Department
3. Authority updates status to "reviewing"
4. Issue resolved within 2 days
5. Farmer gets 25 + 5 = 30 credits
6. Farmer redeems 20 credits for extra rice

### **Scenario 2: Ration Card Problem**
1. Farmer reports ration card not working
2. Assigned to Food & Civil Supplies
3. Database issue identified and fixed
4. Farmer provides 5-star feedback
5. Earns 15 + 5 = 20 credits total

## 🔐 **Security Features**

- **JWT Authentication**: Secure API access
- **Input Validation**: Prevents malicious data
- **Rate Limiting**: Prevents spam complaints
- **Audit Trail**: Complete complaint history
- **Data Encryption**: Sensitive information protected

---

**Your complaints system is now ready with full credit rewards functionality! 🎉**