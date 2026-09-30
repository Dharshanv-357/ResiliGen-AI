import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, TrendingDown, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Card';
import { mockHistoryEntries } from '../data/mockSimulation';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'date' | 'improvement'>('date');

  const sorted = [...mockHistoryEntries].sort((a, b) => {
    if (sortBy === 'improvement') return b.improvementPercent - a.improvementPercent;
    return new Date(b.date.split('/').reverse().join('-')).getTime() -
           new Date(a.date.split('/').reverse().join('-')).getTime();
  });

  const totalImprovement = mockHistoryEntries
    .filter(e => e.status === 'completed')
    .reduce((s, e) => s + e.improvementPercent, 0) /
    mockHistoryEntries.filter(e => e.status === 'completed').length;

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Simulation History</h1>
          <p className="text-sm text-gray-500 mt-1">Previous stress testing sessions and outcomes.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort by:</span>
          {(['date', 'improvement'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                sortBy === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'date' ? 'Date' : 'Improvement'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Sessions', value: mockHistoryEntries.length, sub: 'All time' },
          { label: 'Completed', value: mockHistoryEntries.filter(e => e.status === 'completed').length, sub: 'Successfully analyzed' },
          { label: 'Avg Improvement', value: `${totalImprovement.toFixed(1)}%`, sub: 'Risk reduction' },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </Card>
        ))}
      </div>

      {/* History Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Plan', 'Date', 'Scenarios', 'Original Risk', 'Final Risk', 'Improvement', 'Status', ''].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-indigo-50/40 cursor-pointer transition-colors"
                  onClick={() => navigate('/comparison')}
                >
                  <td className="py-3.5 px-4">
                    <p className="text-sm font-semibold text-gray-900">{entry.planName}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">{entry.date}</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-gray-700">{entry.scenarioCount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-bold text-red-600">{entry.originalRisk}</span>
                    <span className="text-xs text-gray-400">/100</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {entry.finalRisk > 0 ? (
                      <>
                        <span className="text-sm font-bold text-green-600">{entry.finalRisk}</span>
                        <span className="text-xs text-gray-400">/100</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">In progress</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {entry.improvementPercent > 0 ? (
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-sm font-bold text-green-600">{entry.improvementPercent}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <ExternalLink className="w-4 h-4 text-gray-300 hover:text-indigo-500 transition-colors" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
