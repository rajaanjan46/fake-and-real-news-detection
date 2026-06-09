"""
Flask API for Fake News Classifier
Start with: python app.py
API endpoints:
  POST /predict - Predict if text is real or fake
  GET  /health - Health check
  GET  /model-info - Model information
  GET  /history - Prediction history
  DELETE /history - Clear prediction history
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# Download NLTK data
nltk.download('stopwords', quiet=True)
nltk.download('punkt_tab', quiet=True)

# Load models
try:
    model = joblib.load("model.pkl")
    vectorizer = joblib.load("vectorizer.pkl")
    print("✓ Models loaded successfully")
    models_loaded = True
except FileNotFoundError:
    print("✗ Error: model.pkl or vectorizer.pkl not found!")
    print("  Run: python train_and_save_model.py")
    model = None
    vectorizer = None
    models_loaded = False

STOPWORDS = set(stopwords.words("english"))
HISTORY_FILE = "prediction_history.json"

def load_history():
    """Load prediction history from file"""
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    return []

def save_history(history):
    """Save prediction history to file"""
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f)

def clean_text(text):
    """Clean and tokenize text"""
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"[^a-z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in STOPWORDS and len(t) > 2]
    return " ".join(tokens)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": models_loaded
    })

@app.route('/api/health', methods=['GET'])
def api_health():
    """API health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": models_loaded
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict if text is real or fake
    Expected JSON: {"text": "article text here"}
    """
    if model is None or vectorizer is None:
        return jsonify({
            "error": "Models not loaded. Run train_and_save_model.py first"
        }), 500

    try:
        data = request.get_json()
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "Text field is required"}), 400

        # Clean and vectorize
        cleaned = clean_text(text)
        vec = vectorizer.transform([cleaned])

        # Predict
        prediction = model.predict(vec)[0]
        probabilities = model.predict_proba(vec)[0]

        label = "FAKE" if prediction == 1 else "REAL"
        prob_real = float(probabilities[0]) * 100
        prob_fake = float(probabilities[1]) * 100
        confidence = max(prob_real, prob_fake)

        result = {
            "prediction": label,
            "confidence": f"{confidence:.1f}%",
            "prob_real": f"{prob_real:.1f}%",
            "prob_fake": f"{prob_fake:.1f}%",
            "text_preview": text[:100] + "..." if len(text) > 100 else text,
            "timestamp": datetime.now().isoformat()
        }

        # Save to history
        history = load_history()
        history.append(result)
        # Keep only last 50 predictions
        if len(history) > 50:
            history = history[-50:]
        save_history(history)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def api_predict():
    """API predict endpoint - same as /predict"""
    return predict()

@app.route('/history', methods=['GET'])
def get_history():
    """Get prediction history"""
    history = load_history()
    return jsonify({"history": history[::-1]})  # Return in reverse order (newest first)

@app.route('/api/history', methods=['GET'])
def api_get_history():
    """API get history endpoint"""
    return get_history()

@app.route('/history', methods=['DELETE'])
def clear_history():
    """Clear prediction history"""
    save_history([])
    return jsonify({"message": "History cleared"})

@app.route('/api/history', methods=['DELETE'])
def api_clear_history():
    """API clear history endpoint"""
    return clear_history()

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        "model": "Multinomial Naive Bayes",
        "vectorizer": "TF-IDF (max_features=5000, ngram_range=(1,2))",
        "status": "loaded" if models_loaded else "not loaded",
        "version": "1.0",
        "description": "Fake News Classifier trained on combined real and fake news datasets"
    })

@app.route('/api/model-info', methods=['GET'])
def api_model_info():
    """API model info endpoint"""
    return model_info()

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """
    Predict multiple texts at once
    Expected JSON: {"texts": ["text1", "text2", ...]}
    """
    if model is None or vectorizer is None:
        return jsonify({
            "error": "Models not loaded"
        }), 500

    try:
        data = request.get_json()
        texts = data.get("texts", [])

        if not texts:
            return jsonify({"error": "texts array is required"}), 400

        results = []
        for text in texts:
            cleaned = clean_text(text)
            vec = vectorizer.transform([cleaned])
            prediction = model.predict(vec)[0]
            probabilities = model.predict_proba(vec)[0]
            
            label = "FAKE" if prediction == 1 else "REAL"
            results.append({
                "text": text[:50] + "...",
                "prediction": label,
                "confidence": f"{max(probabilities) * 100:.1f}%"
            })

        return jsonify({"results": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("Starting Fake News Classifier API")
    print("="*60)
    print("Available endpoints:")
    print("  GET  /health or /api/health")
    print("  GET  /model-info or /api/model-info")
    print("  POST /predict or /api/predict - {\"text\": \"...\"}")
    print("  GET  /history or /api/history")
    print("  DELETE /history or /api/history")
    print("  POST /batch-predict - {\"texts\": [\"...\", \"...\"]}")
    print("\nServer running at http://localhost:5000")
    print("React frontend: http://localhost:3000")
    print("="*60 + "\n")
    app.run(debug=True, port=5000)
