# 🗄️ MongoDB Database Setup Guide

## 📋 **Overview**
We'll create two main collections:
1. **farmers** - Store complete login/farmer details
2. **listings** - Store marketplace crop listings

## 🚀 **Step 1: Setup Local MongoDB**

### **Option A: Using MongoDB Compass (Recommended)**
1. **Open MongoDB Compass**
2. **Connect to Local MongoDB**:
   - Connection String: `mongodb://localhost:27017`
   - Click "Connect"

### **Option B: Start MongoDB Service**
If MongoDB isn't running:
```bash
# Windows (Run as Administrator)
net start MongoDB

# Or start MongoDB manually
mongod --dbpath "C:\data\db"
```

## 🏗️ **Step 2: Create Database Structure**

### **In MongoDB Compass:**
1. **Create Database**: `agritech_platform`
2. **Create Collections**:
   - `farmers` (for login/farmer data)
   - `listings` (for marketplace listings)
   - `complaints` (for complaint system)
   - `ration_records` (for ration distribution)

## 📊 **Step 3: Database Schema**

### **Farmers Collection**
```javascript
{
  _id: ObjectId,
  aadhaarNumber: "123456789012",
  name: "Ram Kumar Sharma",
  fatherName: "Shyam Lal Sharma",
  village: "Rampur",
  district: "Meerut",
  state: "Uttar Pradesh",
  phone: "9876543210",
  rationCard: "UP1234567890",
  landSize: "2.5 acres",
  crops: ["Wheat", "Rice", "Sugarcane"],
  preferredLanguage: "en",
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### **Listings Collection**
```javascript
{
  _id: ObjectId,
  farmerId: ObjectId, // Reference to farmers collection
  cropType: "Wheat",
  quantity: 50,
  unit: "quintal",
  pricePerUnit: 2300,
  totalPrice: 115000,
  description: "High quality wheat harvest",
  location: {
    village: "Rampur",
    district: "Meerut",
    state: "Uttar Pradesh"
  },
  status: "active", // active, sold, expired
  images: ["image1.jpg", "image2.jpg"],
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date
}
```

## ⚙️ **Step 4: Environment Configuration**

Your `.env` file should contain:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/agritech_platform
DB_NAME=agritech_platform

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🔧 **Step 5: Test Connection**

Run this command to test your setup:
```bash
cd server
npm run test-db
```

## 📱 **Step 6: Seed Demo Data**

We'll create a script to populate your database with demo farmers and listings for testing.

## 🌐 **Step 7: API Endpoints**

### **Authentication Endpoints**
- `POST /api/auth/verify-aadhaar` - Verify Aadhaar and get farmer details
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/profile` - Get farmer profile

### **Marketplace Endpoints**
- `GET /api/marketplace/listings` - Get all active listings
- `POST /api/marketplace/listings` - Create new listing
- `PUT /api/marketplace/listings/:id` - Update listing
- `DELETE /api/marketplace/listings/:id` - Delete listing
- `GET /api/marketplace/my-listings` - Get farmer's listings

## 🔄 **Next Steps**
1. Start MongoDB service
2. Update environment variables
3. Run database seed script
4. Test API endpoints
5. Connect frontend to backend

---

**Ready to connect your AgriTech platform to MongoDB! 🚀**