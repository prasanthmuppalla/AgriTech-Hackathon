# Agritech Rural Platform - Setup Guide

## Prerequisites

Before running the platform, ensure you have:

### Required Software
1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **Python** (v3.8 or higher) - [Download](https://python.org/)
3. **MongoDB** - Choose one option:
   - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/atlas) (Free tier available)

### Optional (for production)
- Redis (for caching)
- Git (for version control)

## Quick Start (Windows)

### Option 1: Automated Installation
```bash
# Run the installation script
install.bat

# Start development servers
start-dev.bat
```

### Option 2: Manual Installation

1. **Install dependencies**
```bash
# Root dependencies
npm install

# Client dependencies  
cd client && npm install && cd ..

# Server dependencies
cd server && npm install && cd ..

# AI service dependencies
cd ai-service && pip install -r requirements.txt && cd ..
```

2. **Configure environment**
```bash
# Copy environment template
copy server\.env.example server\.env

# Edit server/.env with your settings (optional for demo)
```

3. **Start MongoDB**
```bash
# If using local MongoDB
net start MongoDB

# Or start MongoDB manually
mongod
```

4. **Start all services**
```bash
npm run dev
```

## Access the Platform

Once running, access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:5001

## Demo Login

Use these credentials to test:
- **Phone**: Any 10-digit number (e.g., 9876543210)
- **OTP**: Any 6-digit code (e.g., 123456)

## Features to Test

### 1. Marketplace
- View current crop prices
- Create product listings
- Group selling coordination

### 2. AI Advisory  
- Ask farming questions in multiple languages
- Get crop recommendations
- Weather updates
- Pest identification (upload images)

### 3. Welfare Services
- View ration card details
- QR code verification
- Government scheme information
- Distribution tracking

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Start MongoDB service
net start MongoDB

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agritech
```

**Port Already in Use**
```bash
# Kill processes on ports 3000, 5000, 5001
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Python Dependencies Error**
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install dependencies
pip install -r ai-service/requirements.txt
```

**Node.js Version Issues**
```bash
# Check Node.js version
node --version

# Should be v18 or higher
```

## Production Deployment

For production deployment:

1. **Environment Variables**
   - Set proper MongoDB URI
   - Configure JWT secrets
   - Add API keys for external services

2. **Build Frontend**
   ```bash
   cd client && npm run build
   ```

3. **Use Process Manager**
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   ```

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React/Next.js │    │  Node.js/Express│    │   Python/Flask  │
│   Frontend      │◄──►│   Backend API   │◄──►│   AI Service    │
│   (Port 3000)   │    │   (Port 5000)   │    │   (Port 5001)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │    MongoDB      │              │
         │              │    Database     │              │
         │              └─────────────────┘              │
         │                                               │
         └───────────────────────────────────────────────┘
                    WebSocket Connections
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review logs in the terminal
3. Ensure all prerequisites are installed
4. Verify MongoDB is running

## Next Steps

After successful setup:
1. Explore the three main modules
2. Test multilingual support
3. Try voice interactions (if microphone available)
4. Upload images for AI analysis
5. Customize farmer profiles