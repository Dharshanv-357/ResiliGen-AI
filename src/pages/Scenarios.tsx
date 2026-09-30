import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, CheckCircle, Filter, Search, ChevronRight,
  ArrowUpDown, X, AlertTriangle, Package, Truck
} from 'lucide-react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Button, StatusBadge, ProgressBar } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';
import { Scenario } from '../types/scenario';
import { getStatusColor, formatVariation } from '../utils/formatters';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { mockScenarioDistribution } from '../data/mockScenarios';

const RISK_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

const GENERATION_PHASES = [
  'Initializing Conditional GAN...',
  'Generating donor variations...',
  'Generating demand fluctuations...',
  'Generating traffic conditions...',
  'Generating vehicle failures...',
  'Generating capacity constraints...',
  'Generating compound failures...',
  'Validating & scoring scenarios...',
];

interface ScenarioDrawerProps {
  scenario: Scenario | null;
  onClose: () => void;
}

const FailureChainNode: React.FC<{ label: string; desc: string; severity: string; isLast: boolean }> = ({
  label, desc, severity, isLast
}) => (
  <div className="flex flex-col items-center">
    <div className={`w-full p-2.5 rounded-lg border text-xs ${
      severity === 'critical' ? 'bg-red-50 border-red-200 text-red-700' :
      severity === 'high' ? 'bg-orange-50 border-orange-200 text-orange-700' :
      'bg-amber-50 border-amber-200 text-amber-700'
    }`}>
      <p className="font-semibold">{label}</p>
      <p className="text-[10px] opacity-75 mt-0.5">{desc}</p>
    </div>
    {!isLast && (
      <div className="flex flex-col items-center my-1">
        <div className="w-0.5 h-3 bg-gray-300" />
        <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
      </div>
    )}
  </div>
);

const ScenarioDrawer: React.FC<ScenarioDrawerProps> = ({ scenario, onClose }) => {
  if (!scenario) return null;
  const failures = [
    { label: 'Vehicle Breakdown', desc: 'V2 mechanical failure detected', severity: 'critical' },
    { label: 'Reduced Transport Capacity', desc: '3/4 vehicles operational', severity: 'high' },
    { label: 'Delivery Delay', desc: '+45 min average delay', severity: 'high' },
    { label: 'Food Expiry Risk', desc: 'Food approaching 2-hour limit', severity: 'high' },
    { label: 'Unmet Demand', desc: '134 kg demand cannot be fulfilled', severity: 'critical' },
  ];

  return (
    <AnimatePresence>
      {scenario && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium">Scenario Detail</p>
                <h3 className="text-lg font-bold text-gray-900">{scenario.id}</h3>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={scenario.status} />
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Generated Conditions */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3">Generated Conditions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Food Availability', value: '410 kg', icon: <Package className="w-3.5 h-3.5" /> },
                    { label: 'Demand', value: '575 kg', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
                    { label: 'Traffic', value: formatVariation(scenario.trafficVariation), icon: <Truck className="w-3.5 h-3.5" />, warn: true },
                    { label: 'Vehicles', value: `${scenario.availableVehicles}/${scenario.totalVehicles}`, icon: <Truck className="w-3.5 h-3.5" /> },
                    { label: 'NGO Capacity', value: formatVariation(-scenario.ngoCapacityReduction), warn: true, icon: <Package className="w-3.5 h-3.5" /> },
                    { label: 'Expiry Window', value: '90 min', icon: <AlertTriangle className="w-3.5 h-3.5" />, warn: true },
                  ].map((c) => (
                    <div key={c.label} className={`p-2.5 rounded-lg text-xs ${c.warn ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'}`}>
                      <div className={`flex items-center gap-1 mb-0.5 ${c.warn ? 'text-red-500' : 'text-gray-500'}`}>
                        {c.icon}
                        <span className={c.warn ? 'text-red-500' : 'text-gray-500'}>{c.label}</span>
                      </div>
                      <p className={`font-bold ${c.warn ? 'text-red-700' : 'text-gray-800'}`}>{c.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Failure Chain */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3">Failure Chain</h4>
                <div className="space-y-0">
                  {failures.map((f, i) => (
                    <FailureChainNode key={f.label} {...f} isLast={i === failures.length - 1} />
                  ))}
                </div>
              </div>

              {/* Simulation Result */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3">Simulation Preview</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Food Delivered', value: '286 kg', color: 'text-green-600 bg-green-50' },
                    { label: 'Food Wasted', value: '124 kg', color: 'text-red-600 bg-red-50' },
                    { label: 'Unmet Demand', value: '134 kg', color: 'text-orange-600 bg-orange-50' },
                    { label: 'Delivery Delay', value: '48 min', color: 'text-amber-600 bg-amber-50' },
                  ].map((r) => (
                    <div key={r.label} className={`p-2.5 rounded-lg ${r.color}`}>
                      <p className="text-[10px] opacity-70">{r.label}</p>
                      <p className="text-sm font-bold">{r.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <p className="text-sm font-bold text-red-700">Risk Score</p>
                  <p className="text-2xl font-bold text-red-600">{scenario.riskScore}<span className="text-sm text-red-400">/100</span></p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100">
              <Button className="w-full">
                Run Detailed Simulation <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const Scenarios: React.FC = () => {
  const {
    scenarios, isGeneratingScenarios, generationProgress, generationPhase,
    scenariosGenerated, startGeneratingScenarios, selectedScenario, setSelectedScenario
  } = useAppStore();

  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'riskScore'>('riskScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    if (isGeneratingScenarios) {
      const interval = setInterval(() => {
        setPhaseIndex(Math.floor((generationProgress / 100) * GENERATION_PHASES.length));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isGeneratingScenarios, generationProgress]);

  const filtered = scenarios
    .filter(s => filter === 'all' || s.status === filter)
    .filter(s => search === '' || s.id.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'riskScore') return (a.riskScore - b.riskScore) * mult;
      return a.id.localeCompare(b.id) * mult;
    })
    .slice(0, 50); // Show first 50 for performance

  const distData = [
    { name: 'Low', value: mockScenarioDistribution.low, color: '#22c55e' },
    { name: 'Medium', value: mockScenarioDistribution.medium, color: '#f59e0b' },
    { name: 'High', value: mockScenarioDistribution.high, color: '#f97316' },
    { name: 'Critical', value: mockScenarioDistribution.critical, color: '#ef4444' },
  ];

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generative Scenario Engine</h1>
          <p className="text-sm text-gray-500 mt-1">Generate synthetic operating conditions to stress-test the redistribution plan.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-200">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-indigo-700">Conditional GAN</span>
            <span className="text-xs text-green-600 font-bold">● Ready</span>
          </div>
        </div>
      </div>

      {/* Generation Panel */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">Scenario Generation</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {scenariosGenerated
                ? `${scenarios.length.toLocaleString()} scenarios generated successfully.`
                : 'Configure and generate synthetic scenarios.'}
            </p>
          </div>
          <Button
            onClick={startGeneratingScenarios}
            loading={isGeneratingScenarios}
            disabled={isGeneratingScenarios}
          >
            <Zap className="w-4 h-4" />
            {isGeneratingScenarios ? 'Generating...' : 'Generate 1,000 Scenarios'}
          </Button>
        </div>

        {(isGeneratingScenarios || scenariosGenerated) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">
                {isGeneratingScenarios ? GENERATION_PHASES[phaseIndex] : '✓ ' + GENERATION_PHASES[GENERATION_PHASES.length - 1]}
              </span>
              <span className="font-bold text-indigo-600">
                {isGeneratingScenarios ? (
                  <AnimatedCounter target={Math.round(generationProgress * 10)} duration={200} />
                ) : 1000}
                {' '} / 1,000
              </span>
            </div>
            <ProgressBar
              value={generationProgress}
              color={scenariosGenerated && !isGeneratingScenarios ? 'green' : 'indigo'}
            />
            {isGeneratingScenarios && (
              <div className="space-y-1">
                {GENERATION_PHASES.slice(0, phaseIndex + 1).map((phase, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                    {phase}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {scenariosGenerated && (
        <>
          {/* Distribution + Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Donut Chart */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Scenario Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={distData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {distData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} scenarios`, '']} />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {distData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-gray-500">{d.name}:</span>
                    <span className="font-semibold text-gray-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Scenario Table */}
            <div className="lg:col-span-2">
              <Card padding="none">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
                  <div className="flex-1 min-w-[120px] relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search SCN-..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${
                          filter === f
                            ? f === 'all' ? 'bg-indigo-600 text-white' :
                              f === 'critical' ? 'bg-red-500 text-white' :
                              f === 'high' ? 'bg-orange-500 text-white' :
                              f === 'medium' ? 'bg-amber-500 text-white' :
                              'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                  >
                    <ArrowUpDown className="w-3 h-3" /> Risk
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['ID', 'Demand', 'Supply', 'Traffic', 'Vehicles', 'Risk', 'Status'].map((h) => (
                          <th key={h} className="text-left px-3 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s) => (
                        <tr
                          key={s.id}
                          className="border-b border-gray-50 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                          onClick={() => setSelectedScenario(s)}
                        >
                          <td className="px-3 py-2 font-mono font-bold text-gray-700">{s.id}</td>
                          <td className={`px-3 py-2 font-semibold ${s.demandVariation > 20 ? 'text-red-600' : s.demandVariation > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {formatVariation(s.demandVariation)}
                          </td>
                          <td className={`px-3 py-2 font-semibold ${s.donationVariation < -15 ? 'text-red-600' : s.donationVariation < 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {formatVariation(s.donationVariation)}
                          </td>
                          <td className={`px-3 py-2 font-semibold ${s.trafficVariation > 30 ? 'text-red-600' : s.trafficVariation > 15 ? 'text-amber-600' : 'text-gray-600'}`}>
                            {formatVariation(s.trafficVariation)}
                          </td>
                          <td className="px-3 py-2 font-semibold text-gray-700">{s.availableVehicles}/{s.totalVehicles}</td>
                          <td className="px-3 py-2">
                            <span className={`font-bold ${
                              s.riskScore >= 75 ? 'text-red-600' :
                              s.riskScore >= 55 ? 'text-orange-500' :
                              s.riskScore >= 30 ? 'text-amber-500' :
                              'text-green-600'
                            }`}>{s.riskScore}</span>
                          </td>
                          <td className="px-3 py-2">
                            <StatusBadge status={s.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-3 py-2 text-[10px] text-gray-400 border-t border-gray-50">
                    Showing {filtered.length} of {scenarios.filter(s => filter === 'all' || s.status === filter).length} scenarios
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      <ScenarioDrawer scenario={selectedScenario} onClose={() => setSelectedScenario(null)} />
    </div>
  );
};
