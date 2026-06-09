@echo off
echo.
echo ============================================================
echo   Fake News Classifier - Full Stack Setup
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/4] Installing backend dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Training model...
python train_and_save_model.py
if errorlevel 1 (
    echo Error: Failed to train model
    pause
    exit /b 1
)

echo.
echo [3/4] Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ============================================================
echo   Setup Complete!
echo ============================================================
echo.
echo Next steps:
echo   Terminal 1: cd backend ^&^& python app.py
echo   Terminal 2: cd frontend ^&^& npm start
echo.
echo   Backend API:  http://localhost:5000
echo   Frontend UI:  http://localhost:3000
echo.
pause
