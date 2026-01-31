@echo off
echo ========================================
echo   AgriTech Platform - Database Setup
echo ========================================
echo.

echo [1/4] Checking MongoDB connection...
mongosh --eval "db.adminCommand('ping')" > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB is not running. Please start MongoDB first.
    echo.
    echo To start MongoDB:
    echo 1. Open Command Prompt as Administrator
    echo 2. Run: net start MongoDB
    echo    OR
    echo 3. Start MongoDB Compass and connect to localhost:27017
    pause
    exit /b 1
)
echo ✅ MongoDB is running

echo.
echo [2/4] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo [3/4] Setting up environment configuration...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from template
) else (
    echo ✅ .env file already exists
)

echo.
echo [4/4] Seeding database with demo data...
node scripts/seedDatabase.js
if %errorlevel% neq 0 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)

echo.
echo ========================================
echo   🎉 Database Setup Complete!
echo ========================================
echo.
echo 📊 Demo Data Created:
echo   • 3 Farmers with Aadhaar authentication
echo   • Sample complaints with different statuses
echo   • Credit transactions and rewards
echo.
echo 🔑 Demo Login Credentials:
echo   • Aadhaar: 123456789012 (Ram Kumar Sharma)
echo   • Aadhaar: 234567890123 (Sunita Devi)
echo   • Aadhaar: 345678901234 (Mukesh Patel)
echo   • OTP: Any 6-digit number
echo.
echo 🚀 Next Steps:
echo   1. Start the server: npm run dev
echo   2. Open complaints.html in browser
echo   3. Login with demo credentials
echo   4. Test complaint filing and credit system
echo.
cd ..
pause