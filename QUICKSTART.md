# 🚀 Quick Start Guide

## One-Time Setup

### 1. Copy Dataset Files to Backend
Make sure `Fake.csv` and `True.csv` are in the `backend/` folder:
```bash
# From project root
cp Fake.csv backend/
cp True.csv backend/
```

### 2. Run Setup Script

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup (if scripts don't work)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python train_and_save_model.py
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## Running the Application

### Start Backend API (Terminal 1)
```bash
cd backend
python app.py
```
✅ API runs at: `http://localhost:5000`

### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
✅ UI opens at: `http://localhost:3000`

---

## Quick Test

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

### Test 2: Make a Prediction
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "New climate study shows alarming trends"}'
```

### Test 3: Use Web UI
1. Open `http://localhost:3000`
2. Paste news text
3. Click "Analyze"
4. View results

---

## Troubleshooting

### ❌ "model.pkl not found"
Run: `cd backend && python train_and_save_model.py`

### ❌ "Port 5000 already in use"
Change port: `python app.py --port 5001`

### ❌ "Port 3000 already in use"  
Change port: `PORT=3001 npm start`

### ❌ "CORS error"
Make sure Flask API is running at `http://localhost:5000`

---

## Project Structure

```
backend/
├── app.py                  ← Flask API server
├── train_and_save_model.py ← Model trainer
├── requirements.txt        ← Python dependencies
├── Fake.csv               ← Dataset
├── True.csv               ← Dataset
├── model.pkl              ← Generated model
└── vectorizer.pkl         ← Generated vectorizer

frontend/
├── src/
│   ├── App.js            ← Main React component
│   ├── api.js            ← API client
│   └── components/       ← React components
├── package.json          ← NPM dependencies
└── public/               ← Static files
```

---

## What's What

| File | Purpose |
|------|---------|
| `app.py` | Flask REST API with prediction endpoints |
| `train_and_save_model.py` | Trains Naive Bayes model, saves to pickle files |
| `model.pkl` | Trained classifier model |
| `vectorizer.pkl` | TF-IDF vectorizer for text preprocessing |
| `App.js` | Main React component |
| `api.js` | Axios client for backend API |

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Check if API is running |
| POST | `/api/predict` | Classify single text |
| GET | `/api/history` | Get prediction history |
| DELETE | `/api/history` | Clear history |
| GET | `/api/model-info` | Get model details |

---

## Next Steps

- 📚 Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed documentation
- 🔧 Modify model parameters in `train_and_save_model.py`
- 💻 Customize React UI components in `frontend/src/components/`
- 📊 Experiment with different classifiers

---

**Questions?** Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) file for more details! 🎯
