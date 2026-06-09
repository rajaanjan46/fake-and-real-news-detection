import React from 'react';
import { FiShield, FiGithub, FiCode, FiHeart } from 'react-icons/fi';
import { useTheme } from '../ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`mt-16 border-t py-10 px-4 ${
      isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/60'
    }`}>
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <FiShield size={15} className="text-white" />
              </div>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>TruthLens</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              An AI-powered fake news detection system built as a full-stack ML project.
              For educational and research purposes.
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>Tech Stack</div>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'Flask', 'scikit-learn', 'TF-IDF', 'Naive Bayes', 'Logistic Regression', 'Tailwind CSS', 'Chart.js'].map(t => (
                <span key={t} className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                  isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-600'
                }`}>{t}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>Links</div>
            <div className="flex flex-col gap-2">
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className={`flex items-center gap-2 text-xs transition-colors hover:text-blue-400 ${
                  isDark ? 'text-slate-500' : 'text-slate-500'
                }`}>
                <FiGithub size={12} />
                GitHub Repository
              </a>
              <a href="https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset"
                target="_blank" rel="noreferrer"
                className={`flex items-center gap-2 text-xs transition-colors hover:text-blue-400 ${
                  isDark ? 'text-slate-500' : 'text-slate-500'
                }`}>
                <FiCode size={12} />
                Kaggle Dataset
              </a>
            </div>
          </div>
        </div>

        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <p className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            Built with <FiHeart size={11} className="text-red-400" /> for Final Year ML Project · APR_DS/DA_ML_2026
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-700' : 'text-slate-400'}`}>
            For demo & educational use only. Not for production fact-checking.
          </p>
        </div>
      </div>
    </footer>
  );
}
