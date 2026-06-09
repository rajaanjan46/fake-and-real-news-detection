import React, { useState, useEffect } from 'react';
import { FiShield, FiMoon, FiSun, FiGithub, FiWifi, FiWifiOff } from 'react-icons/fi';
import { useTheme } from '../ThemeContext';
import { checkHealth } from '../api';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [apiStatus, setApiStatus] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    checkHealth().then(setApiStatus);
    const interval = setInterval(() => checkHealth().then(setApiStatus), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const online = apiStatus?.status === 'ok';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? isDark
          ? 'glass border-b border-slate-700/50 shadow-lg shadow-black/20'
          : 'glass-light border-b border-slate-200/80 shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
              <FiShield size={18} className="text-white" />
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${
              isDark ? 'border-slate-900' : 'border-white'
            } ${online ? 'bg-emerald-400' : 'bg-red-400'}`} />
          </div>
          <div>
            <span className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              TruthLens
            </span>
            <span className={`block text-[10px] font-medium tracking-widest uppercase ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}>
              AI News Detector
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {['Analyze', 'Dashboard', 'Models', 'History'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`}
              className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
              {link}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* API Status */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            online
              ? isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {online ? <FiWifi size={12} /> : <FiWifiOff size={12} />}
            {online ? 'API Online' : 'API Offline'}
          </div>

          <a href="https://github.com" target="_blank" rel="noreferrer"
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}>
            <FiGithub size={18} />
          </a>

          <button onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}>
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
