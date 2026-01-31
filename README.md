# 🌾 Agritech & Rural Services Platform

A comprehensive digital platform for farmers combining marketplace, welfare distribution, and complaint management systems with Aadhaar-based authentication and multilingual support.

![Platform Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Languages](https://img.shields.io/badge/Languages-English%20%7C%20Hindi%20%7C%20Telugu-blue)
![Authentication](https://img.shields.io/badge/Auth-Aadhaar%20Based-orange)

## 🎯 **Core Features**

### 🔐 **Aadhaar-Based Authentication**
- **Step-by-step verification** with name, Aadhaar number, and OTP
- **Demo farmer database** with realistic Indian farmer profiles
- **Secure JWT token** authentication
- **Mobile-first** responsive design

### 🌐 **Multilingual Support**
- **English** (Default)
- **Hindi** (हिंदी) with Devanagari fonts
- **Telugu** (తెలుగు) with Telugu fonts
- **Real-time translation** of entire interface
- **Persistent language** selection

### 📱 **Three Main Modules**

#### 1. 🛒 **Digital Marketplace**
- **Crop Selling**: Create listings with type, quantity, and price
- **Market Rates**: Real-time prices with trend indicators
- **Group Selling**: Join farmer cooperatives for better prices
- **My Listings**: Manage active and completed sales

#### 2. 📦 **Ration Distribution**
- **Digital Ration Card**: View card details and quota
- **QR Code Scanning**: Verify distribution points
- **Government Schemes**: Access welfare programs
- **Quota Tracking**: Monitor monthly allocations

#### 3. 📞 **Complaint System**
- **File Complaints**: Submit issues with categorization
- **Track Status**: Monitor complaint resolution
- **Helpline Numbers**: Quick access to support
- **Feedback System**: Rate service quality

## 🚀 **Quick Start**

### **Option 1: Demo Pages (Recommended)**
1. Open `login.html` in your browser
2. Use demo credentials:
   - **Name**: Any name (e.g., "Ram Kumar")
   - **Aadhaar**: `123456789012`, `234567890123`, or `345678901234`
   - **OTP**: Any 6-digit code
3. Select language and explore features

### **Option 2: Full Stack Development**
```bash
# Install all dependencies
npm run install:all

# Start all services
npm run dev
```

## 📁 **Project Structure**

```
agritech-platform/
├── 📱 Frontend Pages
│   ├── login.html              # Aadhaar authentication
│   ├── language-selection.html # Language preference
│   ├── dashboard.html          # Main feature selection
│   ├── marketplace.html        # Digital marketplace
│   ├── ration.html            # Ration distribution
│   └── complaints.html        # Complaint system
│
├── ⚛️ React/Next.js App
│   ├── client/
│   │   ├── app/               # Next.js 13+ app directory
│   │   ├── components/        # Reusable components
│   │   └── contexts/          # React contexts
│
├── 🖥️ Backend Services
│   ├── server/                # Node.js/Express API
│   │   ├── routes/           # API endpoints
│   │   ├── models/           # MongoDB schemas
│   │   └── middleware/       # Authentication & validation
│
├── 🤖 AI Service
│   └── ai-service/           # Python/Flask microservice
│
└── 📄 Configuration
    ├── package.json          # Root dependencies
    ├── install.bat          # Windows installation
    └── start-dev.bat        # Development startup
```

## 🛠️ **Technology Stack**

### **Frontend**
- **HTML5/CSS3/JavaScript** - Demo pages
- **React/Next.js** - Full application
- **Tailwind CSS** - Styling framework
- **Font Awesome** - Icons
- **Google Fonts** - Multilingual typography

### **Backend**
- **Node.js/Express** - REST API server
- **MongoDB** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication tokens
- **Mongoose** - MongoDB ODM

### **AI Service**
- **Python/Flask** - Microservice framework
- **NLP Libraries** - Text processing
- **Computer Vision** - Image analysis
- **Weather APIs** - Real-time data

### **Authentication & Security**
- **Aadhaar Integration** - Government ID verification
- **OTP Verification** - SMS-based 2FA
- **Encrypted Storage** - Secure data handling
- **CORS Protection** - Cross-origin security

## 🎨 **Design Features**

### **Visual Excellence**
- **Gradient backgrounds** with smooth transitions
- **Card-based layouts** with hover animations
- **Progress indicators** for multi-step processes
- **Status badges** and notifications
- **Floating animations** for key elements

### **User Experience**
- **Mobile-first** responsive design
- **Touch-friendly** interface elements
- **Loading states** with spinners
- **Error handling** with helpful messages
- **Keyboard navigation** support

### **Accessibility**
- **Screen reader** compatible
- **High contrast** color schemes
- **Large touch targets** for mobile
- **Multilingual fonts** for proper rendering

## 📊 **Demo Data**

### **Farmer Profiles**
```javascript
// Aadhaar: 123456789012
{
  name: "Ram Kumar Sharma",
  village: "Rampur",
  district: "Meerut", 
  state: "Uttar Pradesh",
  crops: ["Wheat", "Rice", "Sugarcane"],
  landSize: "2.5 acres"
}

// Aadhaar: 234567890123  
{
  name: "Sunita Devi",
  village: "Gokulpur",
  district: "Ghaziabad",
  crops: ["Tomato", "Potato", "Onion"],
  landSize: "1.8 acres"
}
```

### **Market Prices**
- **Wheat**: ₹2,350/quintal (+5%)
- **Rice**: ₹2,150/quintal (-2%)
- **Tomato**: ₹45/kg (+8%)
- **Onion**: ₹35/kg (+3%)

## 🔧 **Installation & Setup**

### **Prerequisites**
- **Node.js** (v18+)
- **Python** (v3.8+)
- **MongoDB** (local or Atlas)

### **Windows Quick Setup**
```bash
# Run automated installation
install.bat

# Start all services
start-dev.bat
```

### **Manual Setup**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies  
cd server && npm install && cd ..

# Install AI service dependencies
cd ai-service && pip install -r requirements.txt && cd ..

# Configure environment
cp server/.env.example server/.env

# Start services
npm run dev
```

## 🌍 **Deployment**

### **Frontend (Static)**
- Deploy HTML pages to **Netlify**, **Vercel**, or **GitHub Pages**
- Configure custom domain and SSL

### **Full Stack**
- **Frontend**: Vercel/Netlify
- **Backend**: Railway/Render/Heroku
- **Database**: MongoDB Atlas
- **AI Service**: Google Cloud Run/AWS Lambda

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Government of India** - Aadhaar integration guidelines
- **Farmers** - Real-world feedback and requirements
- **Open Source Community** - Libraries and frameworks
- **Design Inspiration** - Modern agricultural platforms

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/yourusername/agritech-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/agritech-platform/discussions)
- **Email**: support@agritech-platform.com

---

**Made with ❤️ for Indian Farmers** 🇮🇳