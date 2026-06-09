"""
Train and save the Fake News Classifier model
Run this once to generate model.pkl and vectorizer.pkl
"""

import pandas as pd
import numpy as np
import re
import nltk
import joblib
import warnings
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

warnings.filterwarnings('ignore')

# Download NLTK data
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

print("Loading data...")
fake = pd.read_csv("Fake.csv")
real = pd.read_csv("True.csv")

# Prepare data
fake["label"] = 1
real["label"] = 0

fake["content"] = fake["title"] + " " + fake["text"]
real["content"] = real["title"] + " " + real["text"]

df = pd.concat([fake[["content", "label"]], real[["content", "label"]]], ignore_index=True)
df = df.dropna(subset=["content"])
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

print(f"Total samples: {len(df)}")
print(f"Fake articles: {df['label'].sum()}")
print(f"Real articles: {(df['label'] == 0).sum()}")

# Clean text
STOPWORDS = set(stopwords.words("english"))

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"[^a-z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in STOPWORDS and len(t) > 2]
    return " ".join(tokens)

print("\nCleaning text...")
df["clean"] = df["content"].apply(clean_text)

# Split data
X = df["clean"]
y = df["label"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# TF-IDF
print("Creating TF-IDF vectors...")
tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)

print(f"TF-IDF matrix shape: {X_train_tfidf.shape}")

# Train Naive Bayes
print("\nTraining Naive Bayes model...")
nb_model = MultinomialNB(alpha=0.1)
nb_model.fit(X_train_tfidf, y_train)

# Evaluate
from sklearn.metrics import accuracy_score, f1_score, classification_report
y_pred = nb_model.predict(X_test_tfidf)
accuracy = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"\n✓ Model Training Complete")
print(f"  Accuracy: {accuracy:.4f}")
print(f"  F1-Score: {f1:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["Real", "Fake"]))

# Save models
print("\nSaving models...")
joblib.dump(nb_model, "model.pkl")
joblib.dump(tfidf, "vectorizer.pkl")
print("✓ Models saved: model.pkl, vectorizer.pkl")
