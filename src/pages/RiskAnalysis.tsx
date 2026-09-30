import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, AlertCircle, Info, TrendingDown
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Card } from '../components/ui/Card';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { riskBreakdownData } from '../data/mockSimulation';

// Circular gauge SVG
const RiskGauge: React.FC<{ score: number }> = ({ score }) => {
  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#ef4444' : score >= 55 ? '#f97316' : score >= 30 ? '#f59e0b' : '#22c55e';
  const label = score >= 75 ? 'CRITICAL' : score >= 55 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="115" viewBox="0 0 200 115">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Colored arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${offset}`}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out, stroke 0.5s' }}
        />
        {/* Score text */}
        <text x="100" y="88" textAnchor="middle" style={{ fontSize: '32px', fontWeight: 800, fill: color, fontFamily: 'Inter, sans-serif' }}>
          {score}
        </text>
        <text x="100" y="108" textAnchor="middle" style={{ fontSize: '10px', fill: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
          / 100
        </text>
      </svg>
      <div className={`-mt-3 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase border-2 ${
        score >= 75 ? 'bg-red-50 text-red-700 border-red-300' :
        score >= 55 ? 'bg-orange-50 text-orange-700 border-orange-300' :
        score >= 30 ? 'bg-amber-50 text-amber-700 border-amber-300' :
        'bg-green-50 text-green-700 border-green-300'
      }`}>
        {label}
      </div>
    </div>
  );
};

const findings = [
  {
    type: 'critical',
    icon: AlertCircle,
    title: 'Vehicle Dependency Risk',
    message: 'Vehicle availability is the largest contributor to unmet demand. A single vehicle failure causes 31% delivery shortfall.',
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    title: 'Compound Risk: Traffic + Expiry',
    message: 'High traffic combined with short expiry windows creates a major wastage risk. 45% traffic delay + 2-hour expiry window = critical waste.',
  },
  {
    type: 'info',
    icon: Info,
    title: 'NGO-03 Overload Condition',
    message: 'NGO-03 (AnnaDanam Trust) becomes overloaded under high-demand scenarios, reaching 98% capacity at peak.',
  },
];

export const RiskAnalysis: React.FC = () => {
  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Risk Intelligence</h1>
        <p className="text-sm text-gray-500 mt-1">Identify the weakest components of the redistribution plan.</p>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="flex flex-col items-center py-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Overall Risk Score</p>
            <RiskGauge score={78} />
            <div className="mt-4 grid grid-cols-2 gap-3 w-full">
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <p className="text-[10px] text-gray-500">Scenarios Failed</p>
                <p className="text-lg font-bold text-red-600">
                  <AnimatedCounter target={326} duration={1500} />
                </p>
              </div>
              <div className="text-center p-2 bg-amber-50 rounded-lg">
                <p className="text-[10px] text-gray-500">Success Rate</p>
                <p className="text-lg font-bold text-amber-600">
                  <AnimatedCounter target={68} duration={1500} suffix="%" />
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Risk Breakdown Bars */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <h3 className="font-bold text-gray-900 mb-4">Risk Factor Breakdown</h3>
            <div className="space-y-3">
              {riskBreakdownData.map((item, index) => (
                <div key={item.factor}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{item.factor}</span>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <motion.div
                      className="h-2.5 rounded-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Key Findings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <h3 className="font-bold text-gray-900">Key Findings</h3>
          {findings.map((f) => {
            const Icon = f.icon;
            const colors = {
              critical: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', title: 'text-red-800' },
              warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', title: 'text-amber-800' },
              info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', title: 'text-blue-800' },
            }[f.type] || { bg: 'bg-gray-50', border: 'border-gray-200', icon: 'text-gray-500', title: 'text-gray-800' };

            return (
              <Card
                key={f.title}
                className={`${colors.bg} ${colors.border}`}
                padding="sm"
              >
                <div className="flex items-start gap-2">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.icon}`} />
                  <div>
                    <p className={`text-xs font-bold ${colors.title}`}>{f.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{f.message}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </motion.div>
      </div>

      {/* Failure Contribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-gray-900">Failure Contribution Analysis</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">Which factors most frequently cause plan failure across 1,000 scenarios</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskBreakdownData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="factor" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} unit="%" />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Risk Contribution']}
                contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {riskBreakdownData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </div>
  );
};
