import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NewsAnalyzer from './components/NewsAnalyzer';
import ModelInfo from './components/ModelInfo';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function AppContent() {
  const { isDark } = useTheme();
  const [refreshDashboard, setRefreshDashboard] = useState(0);

  const handleResult = () => {
    setRefreshDashboard(n => n + 1);
  };

  return (
    <div className={`${isDark ? 'animated-bg' : 'light-bg'} grid-bg min-h-screen`}>
      <Navbar />
      <Hero />
      <NewsAnalyzer onResult={handleResult} />
      <ModelInfo />
      <Dashboard refresh={refreshDashboard} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
