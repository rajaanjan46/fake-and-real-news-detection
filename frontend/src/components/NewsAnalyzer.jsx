import React, { useState, useRef } from 'react';
import {
  FiSearch, FiLoader, FiCheckCircle, FiAlertTriangle,
  FiCopy, FiTrash2, FiClock, FiFileText, FiChevronDown
} from 'react-icons/fi';
import { useTheme } from '../ThemeContext';
import { predictNews } from '../api';
import { jsPDF } from 'jspdf';

const SAMPLES = [
  {
    label: '🔴 Likely Fake',
    text: 'SHOCKING: Scientists CONFIRM that drinking bleach cures all known diseases! Big Pharma doesn\'t want you to know this secret remedy that doctors have been hiding for decades. Share before it gets deleted!'
  },
  {
    label: '🟢 Likely Real',
    text: 'The Federal Reserve raised its benchmark interest rate by 25 basis points on Wednesday, the tenth increase since March 2022, as policymakers continued their effort to bring inflation back to the central bank\'s 2% target amid signs the economy is cooling.'
  },
  {
    label: '🔴 Likely Fake',
    text: 'BREAKING: President signs secret executive order banning all elections in 2024. Deep state operatives confirm this will never be reported by mainstream media. The globalists are taking over. URGENT: Forward to everyone!'
  },
  {
    label: '🟢 Likely Real',
    text: 'NASA\'s Perseverance rover has collected its 23rd sample from the Martian surface, a rock core from an ancient river delta that scientists believe holds the greatest potential for containing signs of ancient microbial life.'
  },
];

export default function NewsAnalyzer({ onResult }) {
  const { isDark } = useTheme();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showSamples, setShowSamples] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const MAX_CHARS = 5000;

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 10) {
      setError('Please enter at least 10 characters.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await predictNews(text);
      setResult(data);
      onResult && onResult(data);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === 'ECONNABORTED' || err.message.includes('Network')) {
        setError('Cannot reach the Flask API. Make sure it\'s running on http://localhost:5000');
      } else {
        setError('Prediction failed. Please check the API server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const output = `TruthLens Analysis\n──────────────────\nVerdict: ${result.prediction}\nConfidence: ${result.confidence}%\nTimestamp: ${result.timestamp}\nWords: ${result.word_count}\n\nInput Text:\n${text}`;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 80);
    doc.text('TruthLens — Fake News Detection Report', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Date: ${result.timestamp}`, 14, 32);
    doc.text(`Verdict: ${result.prediction}`, 14, 42);
    doc.text(`Confidence: ${result.confidence}%`, 14, 52);
    doc.text(`Word Count: ${result.word_count}`, 14, 62);
    doc.setFontSize(10);
    doc.text('Analyzed Text:', 14, 75);
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines.slice(0, 40), 14, 83);
    doc.save('truthlens-report.pdf');
  };

  const isFake = result?.prediction === 'FAKE';

  return (
    <section id="analyze" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Analyze News Content
          </h2>
          <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Paste a headline, paragraph, or full article. Works best with 50+ words.
          </p>
        </div>

        {/* Sample Selector */}
        <div className="mb-4">
          <button
            onClick={() => setShowSamples(s => !s)}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-all ${
              isDark
                ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400'
            }`}>
            Try sample articles
            <FiChevronDown size={14} className={`transition-transform ${showSamples ? 'rotate-180' : ''}`} />
          </button>

          {showSamples && (
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {SAMPLES.map((s, i) => (
                <button key={i} onClick={() => { setText(s.text); setShowSamples(false); setResult(null); }}
                  className={`text-left px-4 py-3 rounded-xl text-xs border transition-all hover:-translate-y-0.5 ${
                    isDark
                      ? 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 shadow-sm'
                  }`}>
                  <div className="font-semibold mb-1">{s.label}</div>
                  <div className="line-clamp-2 opacity-70">{s.text}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Card */}
        <div className={`rounded-2xl border overflow-hidden ${
          isDark
            ? 'glass border-slate-700/60 glow-blue'
            : 'glass-light border-slate-200 shadow-lg'
        }`}>
          <div className={`px-4 py-3 border-b flex items-center justify-between ${
            isDark ? 'border-slate-700/60' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <FiFileText size={15} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                News Content
              </span>
            </div>
            <div className={`text-xs font-mono ${
              text.length > MAX_CHARS * 0.9
                ? 'text-red-400'
                : isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {text.length} / {MAX_CHARS}
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Paste a news headline or article here…

Example: 'Scientists discover new treatment for Alzheimer\'s disease in landmark clinical trial...'"
            rows={8}
            className={`w-full px-5 py-4 text-sm leading-relaxed resize-none outline-none font-sans ${
              isDark
                ? 'bg-transparent text-slate-200 placeholder-slate-600'
                : 'bg-transparent text-slate-800 placeholder-slate-400'
            }`}
          />

          <div className={`px-4 py-3 border-t flex items-center justify-between ${
            isDark ? 'border-slate-700/60' : 'border-slate-200'
          }`}>
            <button
              onClick={() => { setText(''); setResult(null); setError(''); }}
              disabled={!text}
              className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-30 ${
                isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700'
              }`}>
              <FiTrash2 size={13} />
              Clear
            </button>

            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200">
              {loading ? (
                <>
                  <FiLoader size={15} className="animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <FiSearch size={15} />
                  Detect Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <FiAlertTriangle size={15} />
            {error}
          </div>
        )}

        {/* Loading shimmer */}
        {loading && (
          <div className="mt-6 rounded-2xl overflow-hidden">
            <div className="shimmer h-40 rounded-2xl" />
          </div>
        )}

        {/* Result Card */}
        {result && !loading && (
          <ResultCard
            result={result}
            isFake={isFake}
            isDark={isDark}
            onCopy={handleCopy}
            copied={copied}
            onExport={handleExportPDF}
          />
        )}
      </div>
    </section>
  );
}

function ResultCard({ result, isFake, isDark, onCopy, copied, onExport }) {
  const color = isFake ? 'red' : 'green';

  return (
    <div className={`mt-6 rounded-2xl border overflow-hidden transition-all duration-500 ${
      isFake
        ? isDark
          ? 'border-red-500/30 glow-red'
          : 'border-red-300 shadow-lg shadow-red-100'
        : isDark
          ? 'border-emerald-500/30 glow-green'
          : 'border-emerald-300 shadow-lg shadow-emerald-100'
    } ${isDark ? 'glass' : 'glass-light'}`}>

      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${
        isFake ? 'from-red-500 to-orange-500' : 'from-emerald-500 to-cyan-500'
      }`} />

      <div className="p-6">
        {/* Verdict + Confidence */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isFake ? 'bg-red-500/15' : 'bg-emerald-500/15'
            }`}>
              {isFake
                ? <FiAlertTriangle size={26} className="text-red-400" />
                : <FiCheckCircle size={26} className="text-emerald-400" />
              }
            </div>
            <div>
              <div className={`text-2xl font-black tracking-tight ${
                isFake ? 'gradient-text-red' : 'gradient-text-green'
              }`}>
                {isFake ? 'FAKE NEWS' : 'REAL NEWS'}
              </div>
              <div className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {isFake
                  ? 'This content shows signs of misinformation'
                  : 'This content appears credible and factual'
                }
              </div>
            </div>
          </div>

          {/* Confidence meter */}
          <div className="text-center sm:text-right">
            <div className={`text-4xl font-black font-mono ${
              isFake ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {result.confidence}%
            </div>
            <div className={`text-xs font-medium uppercase tracking-wider mt-1 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Confidence
            </div>
            <div className="mt-2 w-full sm:w-32 bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isFake ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Meta info */}
        <div className={`flex flex-wrap gap-3 mb-5 pb-5 border-b ${
          isDark ? 'border-slate-700/60' : 'border-slate-200'
        }`}>
          {[
            { icon: FiClock, label: result.timestamp },
            { icon: FiFileText, label: `${result.word_count} words analyzed` },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className={`flex items-center gap-1.5 text-xs ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}>
              <Icon size={12} />
              {label}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button onClick={onCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              copied
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : isDark
                  ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                  : 'border-slate-300 text-slate-600 hover:text-slate-900'
            }`}>
            <FiCopy size={12} />
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
          <button onClick={onExport}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isDark
                ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                : 'border-slate-300 text-slate-600 hover:text-slate-900'
            }`}>
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
