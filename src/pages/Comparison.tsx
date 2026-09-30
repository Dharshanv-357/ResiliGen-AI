import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingDown, ArrowDown, CheckCircle, RotateCcw
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, Button } from '../components/ui/Card';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { originalSimulationResult, improvedSimulationResult, comparisonChartData } from '../data/mockSimulation';

const ComparisonRow: React.FC<{
  label: string;
  original: string | number;
  improved: string | number;
  isImproved: boolean;
  unit?: string;
  index: number;
}> = ({ label, original, improved, isImproved, unit = '', index }) => (
  <motion.tr
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.06 }}
    className="border-b border-gray-50"
  >
    <td className="py-3 px-4 text-sm font-medium text-gray-700">{label}</td>
    <td className="py-3 px-4 text-center">
      <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
        {original}{unit}
      </span>
    </td>
    <td className="py-3 px-4 text-center">
      <span className={`text-sm font-bold px-3 py-1 rounded-lg ${isImproved ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
        {improved}{unit}
      </span>
    </td>
    <td className="py-3 px-4 text-center">
      <div className={`inline-flex items-center gap-1 text-xs font-bold ${isImproved ? 'text-green-600' : 'text-red-600'}`}>
        {isImproved ? (
          <ArrowDown className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3 rotate-180" />
        )}
        Improved
      </div>
    </td>
  </motion.tr>
);

export const Comparison: React.FC = () => {
  const navigate = useNavigate();
  const orig = originalSimulationResult;
  const improved = improvedSimulationResult;

  const riskReductionPercent = ((orig.riskScore - improved.riskScore) / orig.riskScore * 100).toFixed(1);

  const rows = [
    { label: 'Food Wasted', original: `${orig.foodWastedKg} kg`, improved: `${improved.foodWastedKg} kg`, isImproved: true },
    { label: 'Unmet Demand', original: `${orig.unmetDemandKg} kg`, improved: `${improved.unmetDemandKg} kg`, isImproved: true },
    { label: 'Risk Score', original: `${orig.riskScore}/100`, improved: `${improved.riskScore}/100`, isImproved: true },
    { label: 'Success Rate', original: `${orig.successRate}%`, improved: `${improved.successRate}%`, isImproved: true },
    { label: 'Vehicle Utilization', original: `${orig.vehicleUtilization}%`, improved: `${improved.vehicleUtilization}%`, isImproved: true },
    { label: 'Avg Delivery Time', original: `${orig.averageDeliveryTimeMin} min`, improved: `${improved.averageDeliveryTimeMin} min`, isImproved: true },
    { label: 'Expiry Violations', original: `${orig.expiryViolations}`, improved: `${improved.expiryViolations}`, isImproved: true },
    { label: 'NGO Capacity Usage', original: `${orig.ngoCapacityUtilization}%`, improved: `${improved.ngoCapacityUtilization}%`, isImproved: true },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resilience Improvement</h1>
        <p className="text-sm text-gray-500 mt-1">Compare the original plan against the AI-improved plan.</p>
      </div>

      {/* Hero Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-green-950 to-emerald-900 p-6 text-white"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-green-300 text-sm font-semibold uppercase tracking-wider mb-2">
              ✓ PLAN RESILIENCE IMPROVED
            </p>
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="text-center">
                <p className="text-[10px] text-red-300 uppercase tracking-wide">Before</p>
                <p className="text-4xl font-black text-red-400">{orig.riskScore}</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingDown className="w-6 h-6 text-green-400" />
                <div className="h-0.5 w-12 bg-green-500/40" />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-green-300 uppercase tracking-wide">After</p>
                <p className="text-4xl font-black text-green-400">{improved.riskScore}</p>
              </div>
            </div>
            <p className="mt-2 text-green-300 font-semibold">
              Risk reduced by <span className="text-white font-black">{riskReductionPercent}%</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            {[
              { label: 'Food Waste', before: `${orig.foodWastedKg}kg`, after: `${improved.foodWastedKg}kg`, pct: '-61%' },
              { label: 'Unmet Demand', before: `${orig.unmetDemandKg}kg`, after: `${improved.unmetDemandKg}kg`, pct: '-71%' },
              { label: 'Success Rate', before: `${orig.successRate}%`, after: `${improved.successRate}%`, pct: '+34%' },
              { label: 'Delivery Time', before: `${orig.averageDeliveryTimeMin}m`, after: `${improved.averageDeliveryTimeMin}m`, pct: '-56%' },
            ].map((m) => (
              <div key={m.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center">
                <p className="text-[10px] text-slate-300">{m.label}</p>
                <div className="flex items-center gap-2 justify-center my-1">
                  <span className="text-xs text-red-300 line-through">{m.before}</span>
                  <span className="text-xs font-bold text-green-300">{m.after}</span>
                </div>
                <span className="text-xs font-black text-green-400">{m.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Side-by-Side Risk Score */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="text-center bg-red-50 border-red-200">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">Original Plan</p>
            <p className="text-5xl font-black text-red-600">
              <AnimatedCounter target={78} duration={1500} />
            </p>
            <p className="text-sm text-red-400 mt-1">Risk Score</p>
            <div className="mt-3 inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">
              Critical
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <Card className="text-center bg-green-50 border-green-200">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Improved Plan</p>
            <p className="text-5xl font-black text-green-600">
              <AnimatedCounter target={31} duration={2000} />
            </p>
            <p className="text-sm text-green-500 mt-1">Risk Score</p>
            <div className="mt-3 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
              Low ✓
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Comparison Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card padding="none">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Detailed Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Metric</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-red-500 uppercase tracking-wide">Original</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-green-600 uppercase tracking-wide">Improved</th>
                  <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Change</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <ComparisonRow key={row.label} {...row} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Resilience Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Risk Score Across Scenarios</h3>
            <p className="text-xs text-gray-500">Same 10 representative scenarios tested on both plans</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={comparisonChartData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="scenario" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }} />
              <Legend />
              <Line
                type="monotone" dataKey="original" name="Original Plan"
                stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444' }}
              />
              <Line
                type="monotone" dataKey="improved" name="Improved Plan"
                stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: '#22c55e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-end gap-3 pb-4"
      >
        <Button variant="secondary" onClick={() => navigate('/history')}>
          Save to History
        </Button>
        <Button onClick={() => navigate('/simulator')}>
          <RotateCcw className="w-4 h-4" /> Run Final Validation
        </Button>
      </motion.div>
    </div>
  );
};
