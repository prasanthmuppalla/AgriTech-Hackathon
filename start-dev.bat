@echo off
echo Starting Agritech Rural Platform in development mode...
echo.

echo Checking if MongoDB is running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MongoDB is running
) else (
    echo ⚠️  MongoDB not detected. Make sure MongoDB is running or use MongoDB Atlas
    echo You can start MongoDB with: net start MongoDB
    echo.
)

echo Starting all services...
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000  
echo - AI Service: http://localhost:5001
echo.
echo Press Ctrl+C to stop all services
echo.

npm run dev