import React, { useEffect, useState } from 'react';
import { FiDatabase, FiCpu, FiTrendingUp, FiExternalLink } from 'react-icons/fi';
import { useTheme } from '../ThemeContext';
import { getModelInfo } from '../api';

export default function ModelInfo() {
  const { isDark } = useTheme();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    getModelInfo().then(setInfo).catch(() => {});
  }, []);

  const models = info?.models || [
    { name: 'Naive Bayes', type: 'MultinomialNB (alpha=0.1)', accuracy: 0.9421, f1_score: 0.9435 },
    { name: 'Logistic Regression', type: 'LogisticRegression (C=1.0)', accuracy: 0.9887, f1_score: 0.9889 },
  ];

  const StatCard = ({ value, label, color }) => (
    <div className={`text-center p-5 rounded-2xl ${
      isDark ? 'bg-slate-800/60 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'
    }`}>
      <div className={`text-3xl font-black font-mono ${color}`}>{value}</div>
      <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{label}</div>
    </div>
  );

  return (
    <section id="models" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${
            isDark ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-violet-50 text-violet-600 border border-violet-200'
          }`}>
            <FiCpu size={12} />
            Model Architecture
          </div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Under the Hood
          </h2>
          <p className={`mt-3 text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Two classical NLP models, each validated on held-out test data.
          </p>
        </div>

        {/* Pipeline */}
        <div className={`rounded-2xl p-6 mb-8 border ${
          isDark ? 'glass border-slate-700/50' : 'glass-light border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-5">
            <FiDatabase size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              NLP Pipeline
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['Raw Text', 'Lowercase', 'Remove URLs/Punct', 'Tokenize', 'Remove Stopwords', 'TF-IDF Vectorizer', 'ML Classifier', 'Prediction'].map((step, i, arr) => (
              <React.Fragment key={step}>
                <div className={`px-3 py-1.5 rounded-xl text-xs font-medium ${
                  i === arr.length - 1
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white'
                    : isDark
                      ? 'bg-slate-700/80 text-slate-300'
                      : 'bg-slate-100 text-slate-700'
                }`}>
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Dataset stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard value="44,898" label="Total Articles" color={isDark ? 'text-blue-400' : 'text-blue-600'} />
          <StatCard value="23,481" label="Fake Articles" color="text-red-400" />
          <StatCard value="21,417" label="Real Articles" color="text-emerald-400" />
          <StatCard value="50,000" label="TF-IDF Features" color={isDark ? 'text-violet-400' : 'text-violet-600'} />
        </div>

        {/* Model cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {models.map((m, idx) => (
            <div key={m.name} className={`rounded-2xl p-6 border card-hover relative overflow-hidden ${
              isDark ? 'glass border-slate-700/50' : 'glass-light border-slate-200 shadow-sm'
            }`}>
              {idx === 1 && (
                <div className="absolute top-3 right-3">
                  <span className="badge bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                    Active
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  idx === 0
                    ? isDark ? 'bg-orange-500/15' : 'bg-orange-50'
                    : isDark ? 'bg-blue-500/15' : 'bg-blue-50'
                }`}>
                  <FiTrendingUp size={18} className={
                    idx === 0 ? 'text-orange-400' : isDark ? 'text-blue-400' : 'text-blue-600'
                  } />
                </div>
                <div>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {m.name}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {m.type}
                  </div>
                </div>
              </div>

              {[
                { label: 'Accuracy', value: `${(m.accuracy * 100).toFixed(2)}%`, bar: m.accuracy },
                { label: 'F1-Score', value: `${(m.f1_score * 100).toFixed(2)}%`, bar: m.f1_score },
              ].map(({ label, value, bar }) => (
                <div key={label} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
                    <span className={`text-sm font-bold font-mono ${
                      idx === 1
                        ? isDark ? 'text-blue-400' : 'text-blue-600'
                        : isDark ? 'text-orange-400' : 'text-orange-600'
                    }`}>{value}</span>
                  </div>
                  <div className={`h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded-full ${
                        idx === 1
                          ? 'bg-gradient-to-r from-blue-500 to-violet-500'
                          : 'bg-gradient-to-r from-orange-500 to-amber-500'
                      }`}
                      style={{ width: `${bar * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Dataset link */}
        <div className="mt-6 text-center">
          <a href="https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset"
            target="_blank" rel="noreferrer"
            className={`inline-flex items-center gap-2 text-sm hover:text-blue-400 transition-colors ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}>
            <FiDatabase size={13} />
            Kaggle Dataset: Fake and Real News
            <FiExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
