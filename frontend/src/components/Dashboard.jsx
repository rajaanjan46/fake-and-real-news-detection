import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FiBarChart2, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { useTheme } from '../ThemeContext';
import { getHistory } from '../api';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ refresh }) {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({ total: 0, fake: 0, real: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      if (data && data.stats && data.history) {
        setStats(data.stats);
        setHistory(data.history);
      } else {
        setStats({ total: 0, fake: 0, real: 0 });
        setHistory([]);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setStats({ total: 0, fake: 0, real: 0 });
      setHistory([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [refresh]);

  const chartData = {
    labels: ['Real News', 'Fake News'],
    datasets: [{
      data: stats.total === 0 ? [1, 1] : [stats.real, stats.fake],
      backgroundColor: ['rgba(74, 222, 128, 0.8)', 'rgba(248, 113, 113, 0.8)'],
      borderColor: ['rgba(74, 222, 128, 1)', 'rgba(248, 113, 113, 1)'],
      borderWidth: 2,
      hoverBackgroundColor: ['rgba(74, 222, 128, 1)', 'rgba(248, 113, 113, 1)'],
    }],
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${stats.total === 0 ? 'N/A' : ctx.raw} (${
            stats.total === 0 ? '–' : ((ctx.raw / stats.total) * 100).toFixed(1) + '%'
          })`
        }
      }
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  const StatBox = ({ icon: Icon, value, label, color, bg }) => (
    <div className={`flex-1 rounded-2xl p-5 border card-hover ${
      isDark ? `${bg} border-slate-700/50` : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
        isDark ? 'bg-slate-700/80' : 'bg-slate-50'
      }`}>
        <Icon size={18} className={color} />
      </div>
      <div className={`text-3xl font-black font-mono ${color}`}>{value}</div>
      <div className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
        {label}
      </div>
    </div>
  );

  return (
    <section id="dashboard" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              <FiBarChart2 size={12} />
              Live Session
            </div>
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Statistics Dashboard
            </h2>
          </div>
          <button onClick={fetchData}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all ${
              isDark
                ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                : 'border-slate-300 text-slate-600 hover:text-slate-900'
            }`}>
            <FiRefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div className="flex gap-3 mb-8 flex-wrap sm:flex-nowrap">
          <StatBox icon={FiActivity} value={stats.total} label="Total Predictions" color={isDark ? 'text-blue-400' : 'text-blue-600'} bg="bg-blue-500/5" />
          <StatBox icon={FiCheckCircle} value={stats.real} label="Real News" color="text-emerald-400" bg="bg-emerald-500/5" />
          <StatBox icon={FiAlertTriangle} value={stats.fake} label="Fake News" color="text-red-400" bg="bg-red-500/5" />
        </div>

        {/* Chart + Recent history */}
        <div className="grid sm:grid-cols-5 gap-5">
          {/* Donut */}
          <div className={`sm:col-span-2 rounded-2xl p-6 border flex flex-col items-center ${
            isDark ? 'glass border-slate-700/50' : 'glass-light border-slate-200 shadow-sm'
          }`}>
            <h3 className={`text-sm font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Distribution
            </h3>
            <div className="w-44 h-44 relative">
              <Doughnut data={chartData} options={chartOptions} />
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stats.total}
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  Total
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex gap-5 mt-6">
              {[
                { color: 'bg-emerald-400', label: 'Real', count: stats.real },
                { color: 'bg-red-400', label: 'Fake', count: stats.fake },
              ].map(({ color, label, count }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {label} ({count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent predictions table */}
          <div className={`sm:col-span-3 rounded-2xl border overflow-hidden ${
            isDark ? 'glass border-slate-700/50' : 'glass-light border-slate-200 shadow-sm'
          }`}>
            <div className={`px-5 py-4 border-b ${isDark ? 'border-slate-700/60' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Recent Predictions
              </h3>
            </div>
            <div id="history" className="divide-y divide-slate-700/30 max-h-72 overflow-y-auto">
              {history.length === 0 ? (
                <div className={`px-5 py-10 text-center text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  No predictions yet. Analyze some news to see history here.
                </div>
              ) : (
                history.map(entry => (
                  <div key={entry.id} className={`px-5 py-3 flex items-start gap-3 ${
                    isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                  } transition-colors`}>
                    <span className={`mt-0.5 badge shrink-0 ${
                      entry.prediction === 'FAKE'
                        ? 'bg-red-500/15 text-red-400'
                        : 'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {entry.prediction}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs line-clamp-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {entry.text_preview}
                      </p>
                      <div className={`flex gap-3 mt-1 text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        <span>{entry.confidence}% confidence</span>
                        <span>·</span>
                        <span>{entry.word_count} words</span>
                        <span>·</span>
                        <span>{entry.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
