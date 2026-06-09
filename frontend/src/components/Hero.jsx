import React from 'react';
import { FiShield, FiZap, FiLayers, FiArrowDown } from 'react-icons/fi';
import { useTheme } from '../ThemeContext';

const FEATURES = [
  { icon: FiZap, label: 'Instant Detection', desc: 'Results in under a second' },
  { icon: FiLayers, label: 'TF-IDF + ML', desc: 'Two models, cross-validated' },
  { icon: FiShield, label: '98%+ Accuracy', desc: 'Trained on 44k+ articles' },
];

export default function Hero() {
  const { isDark } = useTheme();

  return (
    <section className={`relative pt-32 pb-24 px-4 overflow-hidden`}>
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-600/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-8 ${
          isDark
            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            : 'bg-blue-50 text-blue-600 border border-blue-200'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          NLP · Machine Learning · Real-Time
        </div>

        {/* Headline */}
        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Fake News{' '}
          <span className="gradient-text">Detection</span>
          <br />
          <span className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            System
          </span>
        </h1>

        {/* Subheadline */}
        <p className={`max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed mb-12 ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Paste any news headline or article. Our AI — trained on{' '}
          <span className={isDark ? 'text-slate-200 font-medium' : 'text-slate-800 font-medium'}>
            44,898 verified articles
          </span>{' '}
          — instantly classifies it as real or misinformation with confidence scoring.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a href="#analyze"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200">
            <FiZap size={18} />
            Analyze News Now
          </a>
          <a href="#models"
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base border transition-all duration-200 hover:-translate-y-0.5 ${
              isDark
                ? 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900'
            }`}>
            View Model Stats
          </a>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className={`flex items-center gap-3 px-5 py-3 rounded-2xl card-hover ${
              isDark
                ? 'glass border-slate-700/50'
                : 'glass-light border-slate-200/80 shadow-sm'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
                <Icon size={15} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <div className="text-left">
                <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {label}
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <FiArrowDown className={`animate-bounce ${isDark ? 'text-slate-600' : 'text-slate-400'}`} size={20} />
        </div>
      </div>
    </section>
  );
}
