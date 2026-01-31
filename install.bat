@echo off
echo Installing Agritech Rural Platform...
echo.

echo [1/4] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing root dependencies
    pause
    exit /b 1
)

echo [2/4] Installing client dependencies...
cd client
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)
cd ..

echo [3/4] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies
    pause
    exit /b 1
)
cd ..

echo [4/4] Installing AI service dependencies...
cd ai-service
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing AI service dependencies
    echo Make sure Python and pip are installed
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ Installation completed successfully!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running (or use MongoDB Atlas)
echo 2. Copy server/.env.example to server/.env and configure
echo 3. Run: npm run dev
echo.
pause