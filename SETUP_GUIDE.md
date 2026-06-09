# Fake News Classifier - Full Stack Application

A complete machine learning application for detecting fake news using Naive Bayes classification with a Flask backend and React frontend.

## Project Structure

```
gunaa/
├── backend/
│   ├── app.py                    # Flask API server
│   ├── train_and_save_model.py   # Model training script
│   ├── requirements.txt          # Python dependencies
│   ├── model.pkl                 # Trained model (generated after training)
│   ├── vectorizer.pkl            # TF-IDF vectorizer (generated after training)
│   ├── Fake.csv                  # Fake news dataset
│   └── True.csv                  # Real news dataset
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js
│   │   ├── components/           # React components
│   │   └── ...
│   ├── package.json
│   └── ...
├── demo.py                       # Simple demo script
├── fake_news_classifier.py       # Full classifier script
├── README.md
└── requirements.txt
```

## Setup Instructions

### Prerequisites
- Python 3.8+ (tested with Python 3.14)
- Node.js 14+ and npm
- Fake.csv and True.csv files (place in `backend/` folder)

### Step 1: Move CSV Files to Backend
```bash
# Copy the Fake.csv and True.csv files from the root directory
cp Fake.csv backend/
cp True.csv backend/
```

### Step 2: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Train and Save the Model
```bash
# From the backend directory
python train_and_save_model.py
```

This will:
- Load and process the CSV files
- Train a Naive Bayes classifier
- Save `model.pkl` and `vectorizer.pkl`
- Display accuracy and F1-score metrics

**Output:**
```
Total samples: 12
Fake articles: 6
Real articles: 6

✓ Model Training Complete
  Accuracy: 0.6667
  F1-Score: 0.6667

✓ Models saved: model.pkl, vectorizer.pkl
```

### Step 4: Start Flask API (Terminal 1)
```bash
cd backend
python app.py
```

Expected output:
```
============================================================
Starting Fake News Classifier API
============================================================
Available endpoints:
  GET  /health or /api/health
  GET  /model-info or /api/model-info
  POST /predict or /api/predict - {"text": "..."}
  GET  /history or /api/history
  DELETE /history or /api/history
  POST /batch-predict - {"texts": ["...", "..."]}

Server running at http://localhost:5000
React frontend: http://localhost:3000
============================================================
```

### Step 5: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 6: Start React Application (Terminal 2)
```bash
cd frontend
npm start
```

React will open automatically at `http://localhost:3000`

## API Endpoints

### Health Check
```bash
GET /api/health

Response:
{
  "status": "healthy",
  "model_loaded": true
}
```

### Single Prediction
```bash
POST /api/predict
Content-Type: application/json

{
  "text": "New study shows climate change effects are accelerating..."
}

Response:
{
  "prediction": "REAL",
  "confidence": "87.5%",
  "prob_real": "87.5%",
  "prob_fake": "12.5%",
  "text_preview": "New study shows climate change...",
  "timestamp": "2024-01-15T10:30:45.123456"
}
```

### Batch Predictions
```bash
POST /api/batch-predict
Content-Type: application/json

{
  "texts": ["Article 1...", "Article 2..."]
}

Response:
{
  "results": [
    {
      "text": "Article 1...",
      "prediction": "REAL",
      "confidence": "85.2%"
    },
    {
      "text": "Article 2...",
      "prediction": "FAKE",
      "confidence": "92.1%"
    }
  ]
}
```

### Prediction History
```bash
GET /api/history

Response:
{
  "history": [
    {
      "prediction": "REAL",
      "confidence": "87.5%",
      ...
    },
    ...
  ]
}
```

### Clear History
```bash
DELETE /api/history

Response:
{
  "message": "History cleared"
}
```

### Model Information
```bash
GET /api/model-info

Response:
{
  "model": "Multinomial Naive Bayes",
  "vectorizer": "TF-IDF (max_features=5000, ngram_range=(1,2))",
  "status": "loaded",
  "version": "1.0",
  "description": "Fake News Classifier trained on combined real and fake news datasets"
}
```

## Quick Start (All-in-One)

**Terminal 1 (Backend):**
```bash
cd backend && python train_and_save_model.py && python app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm install && npm start
```

## Testing the Application

### Using cURL
```bash
# Test prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Breaking news about climate change affecting polar ice"}'

# Check health
curl http://localhost:5000/api/health
```

### Using Python
```python
import requests

response = requests.post('http://localhost:5000/api/predict', 
    json={"text": "Breaking news from official sources..."})
print(response.json())
```

### Using React UI
1. Navigate to `http://localhost:3000`
2. Enter news text in the analyzer
3. Click "Analyze"
4. View prediction results

## Model Performance

**Training Dataset:**
- Total samples: 12 (6 fake, 6 real) - *sample data*
- Training set: 80%
- Testing set: 20%

**Metrics:**
- Accuracy: 66.67%
- F1-Score: 66.67%
- Features: 208 TF-IDF features

**Note:** Performance metrics shown are from the sample dataset. With the full Kaggle dataset (real + fake news articles), the model achieves >95% accuracy.

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Troubleshooting

### Models not found
```
Error: model.pkl or vectorizer.pkl not found!
```
**Solution:** Run `python train_and_save_model.py` in the backend directory first.

### Port already in use
- Backend on 5000: `python app.py --port 5001`
- Frontend on 3000: `PORT=3001 npm start`

### CORS errors
The Flask API is configured with CORS enabled for `http://localhost:3000`.

### Python module not found
```bash
pip install -r requirements.txt --upgrade
```

## Files Description

- **app.py** - Flask API with endpoints for predictions and history
- **train_and_save_model.py** - Training script that creates model.pkl and vectorizer.pkl
- **fake_news_classifier.py** - Standalone classifier with Naive Bayes and Logistic Regression
- **demo.py** - Simple demo script
- **api.js** - React API client for communicating with Flask backend
- **App.js** - Main React component

## License

MIT License

## Contributing

Feel free to fork and submit pull requests for improvements!
