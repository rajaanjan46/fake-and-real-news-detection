# Fake and Real News Classifier
### APR_DS/DA_ML_2026 | Due: June 15

---

## Setup

```bash
pip install -r requirements.txt
python fake_news_classifier.py
```

## Dataset
Download from Kaggle:
https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset

Place `Fake.csv` and `True.csv` in this folder.

---

## What the code does (assignment checklist)

| Task                              | Where in code     |
|-----------------------------------|-------------------|
| Load and combine datasets         | STEP 1            |
| Clean and tokenize text           | STEP 2            |
| Convert text to vectors (TF-IDF)  | STEP 3            |
| Train NLP models (NB + LSTM)      | STEP 4A + 4B      |
| Evaluate accuracy and F1-score    | STEP 5            |
| Predict news authenticity         | STEP 6            |

---

## Models used

| Model              | Speed  | Accuracy (typical) |
|--------------------|--------|--------------------|
| Naive Bayes        | Fast   | ~94%               |
| Logistic Regression| Medium | ~98%               |
| BiLSTM             | Slow   | ~99%               |

---

## Interview talking points

**"Why TF-IDF over bag-of-words?"**
TF-IDF penalizes common words that appear in every document (like "the", "said")
and upweights rare but informative words. This gives better signal for classification.

**"Why F1-score over accuracy?"**
Fake news datasets are class-imbalanced. A model that always predicts "Real"
can get 60%+ accuracy but 0% recall on fakes. F1-score balances precision and recall.

**"Why Bidirectional LSTM?"**
Standard LSTM reads text left-to-right. Bidirectional LSTM reads both ways,
capturing context from both directions — e.g. "not good" vs "good not".

**"What's the limitation of this model?"**
It's trained on news from a specific time period. New misinformation styles,
new political topics, or domain shifts can reduce accuracy — this is called
"concept drift" and requires retraining or continuous learning.
