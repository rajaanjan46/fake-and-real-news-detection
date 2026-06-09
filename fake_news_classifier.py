# ============================================================
# FAKE AND REAL NEWS CLASSIFIER — APR_DS/DA_ML_2026
# Full NLP Pipeline: TF-IDF + Naive Bayes + LSTM
# Dataset: https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset
# ============================================================

# ── STEP 0: Install dependencies (run once) ──────────────────
# pip install pandas numpy scikit-learn matplotlib seaborn
# pip install tensorflow keras nltk gensim wordcloud

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import re
import nltk
import warnings
warnings.filterwarnings('ignore')

nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# ============================================================
# STEP 1: LOAD AND COMBINE DATASETS
# ============================================================
# Download from Kaggle:
#   Fake.csv  — fake news articles
#   True.csv  — real news articles
# Place both files in the same folder as this script.

def load_data():
    fake = pd.read_csv("Fake.csv")
    real = pd.read_csv("True.csv")

    # Label: 0 = Real, 1 = Fake
    fake["label"] = 1
    real["label"] = 0

    # Combine title + text into one column
    fake["content"] = fake["title"] + " " + fake["text"]
    real["content"] = real["title"] + " " + real["text"]

    df = pd.concat([fake[["content", "label"]],
                    real[["content", "label"]]], ignore_index=True)

    df = df.dropna(subset=["content"])       # remove nulls
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)  # shuffle

    print(f"Total samples : {len(df)}")
    print(f"Fake articles : {df['label'].sum()}")
    print(f"Real articles : {(df['label'] == 0).sum()}")
    return df

df = load_data()

# ============================================================
# STEP 2: CLEAN AND TOKENIZE TEXT
# ============================================================

STOPWORDS = set(stopwords.words("english"))

def clean_text(text):
    text = text.lower()                          # lowercase
    text = re.sub(r"http\S+|www\S+", "", text)  # remove URLs
    text = re.sub(r"[^a-z\s]", "", text)        # remove punctuation & numbers
    text = re.sub(r"\s+", " ", text).strip()    # collapse whitespace

    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in STOPWORDS and len(t) > 2]
    return " ".join(tokens)

print("\nCleaning text...")
df["clean"] = df["content"].apply(clean_text)
print("Sample cleaned text:")
print(df["clean"].iloc[0][:200])

# ============================================================
# STEP 3: CONVERT TEXT TO VECTORS (TF-IDF)
# ============================================================

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer

X = df["clean"]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# TF-IDF: converts text to numerical feature matrix
# max_features=50000 means top 50k terms by frequency
# ngram_range=(1,2) includes unigrams and bigrams
tfidf = TfidfVectorizer(max_features=50000, ngram_range=(1, 2))
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf  = tfidf.transform(X_test)

print(f"\nTF-IDF matrix shape: {X_train_tfidf.shape}")
print(f"Train size: {X_train_tfidf.shape[0]}, Test size: {X_test_tfidf.shape[0]}")

# ============================================================
# STEP 4A: TRAIN — NAIVE BAYES MODEL
# ============================================================

from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, f1_score,
                              classification_report, confusion_matrix)

print("\n" + "="*50)
print("MODEL 1: Naive Bayes")
print("="*50)

nb_model = MultinomialNB(alpha=0.1)   # alpha = Laplace smoothing
nb_model.fit(X_train_tfidf, y_train)

y_pred_nb = nb_model.predict(X_test_tfidf)

print(f"Accuracy : {accuracy_score(y_test, y_pred_nb):.4f}")
print(f"F1-Score : {f1_score(y_test, y_pred_nb):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred_nb, target_names=["Real", "Fake"]))

# ── Bonus: Logistic Regression (better baseline) ─────────────
print("="*50)
print("MODEL 2: Logistic Regression (Bonus)")
print("="*50)

lr_model = LogisticRegression(max_iter=1000, C=1.0)
lr_model.fit(X_train_tfidf, y_train)

y_pred_lr = lr_model.predict(X_test_tfidf)

print(f"Accuracy : {accuracy_score(y_test, y_pred_lr):.4f}")
print(f"F1-Score : {f1_score(y_test, y_pred_lr):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred_lr, target_names=["Real", "Fake"]))

# ============================================================
# STEP 4B: LSTM NOT AVAILABLE
# ============================================================
# TensorFlow doesn't support Python 3.14 yet - skipping LSTM model

# ============================================================
# STEP 5: EVALUATE ACCURACY AND F1-SCORE (PLOTS)
# ============================================================

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.suptitle("Fake News Classifier — Model Evaluation", fontsize=14, fontweight="bold")

# ── Plot 1: Confusion Matrix — Naive Bayes ────────────────────
cm_nb = confusion_matrix(y_test, y_pred_nb)
sns.heatmap(cm_nb, annot=True, fmt="d", cmap="Blues",
            xticklabels=["Real", "Fake"], yticklabels=["Real", "Fake"], ax=axes[0])
axes[0].set_title("Naive Bayes — Confusion Matrix")
axes[0].set_xlabel("Predicted")
axes[0].set_ylabel("Actual")

# ── Plot 2: Model Comparison Bar Chart ───────────────────────
cm_lr = confusion_matrix(y_test, y_pred_lr)
sns.heatmap(cm_lr, annot=True, fmt="d", cmap="Greens",
            xticklabels=["Real", "Fake"], yticklabels=["Real", "Fake"], ax=axes[1])
axes[1].set_title("Logistic Regression — Confusion Matrix")
axes[1].set_xlabel("Predicted")
axes[1].set_ylabel("Actual")

plt.tight_layout()
plt.savefig("evaluation_plots.png", dpi=150, bbox_inches="tight")
plt.show()
print("Plots saved to evaluation_plots.png")

# ============================================================
# STEP 6: RESULTS SUMMARY
# ============================================================
print("\n" + "="*50)
print("FINAL RESULTS SUMMARY")
print("="*50)
models_list = ["Naive Bayes", "Logistic Regression"]
accuracies_list = [
    accuracy_score(y_test, y_pred_nb),
    accuracy_score(y_test, y_pred_lr)
]
f1_list = [
    f1_score(y_test, y_pred_nb),
    f1_score(y_test, y_pred_lr)
]

for model, acc, f1 in zip(models_list, accuracies_list, f1_list):
    print(f"{model:20s} - Accuracy: {acc:.4f}, F1-Score: {f1:.4f}")

print("="*50)
