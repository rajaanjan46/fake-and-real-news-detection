#!/bin/bash

echo ""
echo "============================================================"
echo "   Fake News Classifier - Full Stack Setup"
echo "============================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

echo "[1/4] Installing backend dependencies..."
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "[2/4] Training model..."
python train_and_save_model.py
if [ $? -ne 0 ]; then
    echo "Error: Failed to train model"
    exit 1
fi

echo ""
echo "[3/4] Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "============================================================"
echo "   Setup Complete!"
echo "============================================================"
echo ""
echo "Next steps:"
echo "   Terminal 1: cd backend && python app.py"
echo "   Terminal 2: cd frontend && npm start"
echo ""
echo "   Backend API:  http://localhost:5000"
echo "   Frontend UI:  http://localhost:3000"
echo ""
