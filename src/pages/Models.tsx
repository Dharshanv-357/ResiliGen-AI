import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Brain, Zap, Activity, CheckCircle2, ChevronRight, X, ImageIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';

const pipelineSteps = [
  {
    id: 'historical-data',
    label: 'Historical Data',
    icon: Database,
    color: 'indigo',
    model: 'Data Ingestion Module',
    purpose: 'Collect and preprocess historical food redistribution operational data.',
    input: 'CSV logs, NGO records, vehicle telemetry',
    output: 'Cleaned, normalized tabular dataset (25,000 records)',
    status: 'Online',
  },
  {
    id: 'preprocessing',
    label: 'Data Preprocessing',
    icon: Activity,
    color: 'blue',
    model: 'Feature Engineering Pipeline',
    purpose: 'Extract features, handle missing values, normalize distributions.',
    input: 'Raw operational records',
    output: 'Feature vectors: [demand, supply, traffic, vehicles, expiry, capacity]',
    status: 'Online',
  },
  {
    id: 'cgan',
    label: 'Conditional GAN',
    icon: Brain,
    color: 'violet',
    model: 'Conditional GAN (cGAN)',
    purpose: 'Generate realistic synthetic food redistribution scenarios conditioned on stress parameters.',
    input: 'Historical data + stress condition labels (low/medium/high/critical)',
    output: 'Synthetic numerical scenarios with realistic distributions',
    status: 'Trained',
  },
  {
    id: 'dcgan',
    label: 'DCGAN Food Decay',
    icon: ImageIcon,
    color: 'emerald',
    model: 'Deep Convolutional GAN (DCGAN)',
    purpose: 'Generate synthetic visual food quality & degradation states under delayed transit and temperature spikes.',
    input: 'Food category + transit delay (min) + ambient temperature vector',
    output: 'Freshness visual inspection frames + quality classification scores (0-100)',
    status: 'Trained',
  },
  {
    id: 'synthetic-scenarios',
    label: 'Synthetic Scenarios',
    icon: Zap,
    color: 'amber',
    model: 'Scenario Sampling Engine',
    purpose: 'Sample and validate generated scenarios, compute risk classification.',
    input: 'GAN generator output',
    output: '1,000–5,000 labeled synthetic scenarios',
    status: 'Online',
  },
  {
    id: 'simulator',
    label: 'Stress Simulator',
    icon: Activity,
    color: 'orange',
    model: 'Python Simulation Engine',
    purpose: 'Simulate the redistribution plan under each generated scenario. Track all metrics.',
    input: 'Redistribution plan + synthetic scenario',
    output: 'Simulation results: food delivered, wasted, unmet demand, delays',
    status: 'Online',
  },
  {
    id: 'autoencoder',
    label: 'Autoencoder',
    icon: Brain,
    color: 'red',
    model: 'Variational Autoencoder (VAE)',
    purpose: 'Detect anomalous failure patterns in simulation results. Identify unusual failure modes.',
    input: 'Simulation result vectors',
    output: 'Anomaly scores, reconstruction error, failure signature embeddings',
    status: 'Trained',
  },
  {
    id: 'anomaly',
    label: 'Anomaly Detection',
    icon: Activity,
    color: 'red',
    model: 'Threshold Classifier',
    purpose: 'Flag scenarios with anomalous failure patterns for deeper analysis.',
    input: 'Autoencoder anomaly scores',
    output: 'Flagged critical scenarios, failure cluster IDs',
    status: 'Online',
  },
  {
    id: 'llm-agents',
    label: 'Multi-Agent LLM',
    icon: Brain,
    color: 'indigo',
    model: 'LLM Agent Framework',
    purpose: 'Multiple specialized agents analyze the scenario from different operational perspectives.',
    input: 'Scenario data + simulation results + anomaly flags',
    output: 'Agent findings, challenge conditions, consensus analysis',
    status: 'Online',
  },
  {
    id: 'risk',
    label: 'Risk Analysis',
    icon: Activity,
    color: 'orange',
    model: 'Risk Scoring Engine',
    purpose: 'Aggregate agent findings into a structured risk report with factor contributions.',
    input: 'Agent findings + simulation metrics',
    output: 'Risk score (0-100), factor breakdown, key findings',
    status: 'Online',
  },
  {
    id: 'recommendations',
    label: 'Recommendations',
    icon: Zap,
    color: 'green',
    model: 'Improvement Generator (LLM)',
    purpose: 'Generate specific, actionable plan modifications to improve resilience.',
    input: 'Risk analysis + failure patterns',
    output: 'Ranked improvement recommendations with expected risk reduction',
    status: 'Online',
  },
  {
    id: 're-simulation',
    label: 'Re-Simulation',
    icon: Activity,
    color: 'green',
    model: 'Comparative Simulator',
    purpose: 'Re-run the stress simulator with the improved plan to measure resilience gain.',
    input: 'Improved plan + original scenario set',
    output: 'Before/after comparison, resilience improvement score',
    status: 'Online',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
};

interface StepDetailProps {
  step: typeof pipelineSteps[0] | null;
  onClose: () => void;
}

const StepDetail: React.FC<StepDetailProps> = ({ step, onClose }) => {
  if (!step) return null;
  const colors = colorMap[step.color];
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <Card className="relative z-10 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}>
            <Icon className="w-5 h-5" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{step.label}</h3>
        <p className="text-xs text-gray-500 mb-1 font-medium">{step.model}</p>
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mb-4 ${colors.bg} ${colors.text}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {step.status}
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Purpose</p>
            <p className="text-sm text-gray-700 leading-relaxed">{step.purpose}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Input</p>
            <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded border border-gray-100">{step.input}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Output</p>
            <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded border border-gray-100">{step.output}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const Models: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<typeof pipelineSteps[0] | null>(null);

  const modelComponents = [
    { name: 'Conditional GAN', type: 'Scenario Generator (cGAN)', status: 'Trained', records: '25K historical + 75K synthetic', accuracy: '94.2%', color: 'violet' },
    { name: 'DCGAN Food Decay', type: 'Quality Visualizer (DCGAN)', status: 'Trained', records: '12,500 food decay frames', accuracy: 'FID: 18.4', color: 'emerald' },
    { name: 'Variational Autoencoder', type: 'Anomaly Detector (VAE)', status: 'Trained', records: '25K records', accuracy: '91.8%', color: 'red' },
    { name: 'LLM Agent Engine', type: 'Language Model', status: 'Online', records: 'API-based', accuracy: 'GPT-4 class', color: 'indigo' },
    { name: 'Scenario Generator', type: 'Sampling Engine', status: 'Online', records: '—', accuracy: '1K–5K/run', color: 'amber' },
    { name: 'Stress Simulator', type: 'Simulation Engine', status: 'Online', records: '—', accuracy: 'Deterministic', color: 'orange' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">GenAI Pipeline</h1>
        <p className="text-sm text-gray-500 mt-1">Model architecture and component status for the IdeaStress AI system.</p>
      </div>

      {/* Dataset Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: '100,000', sub: '25K real + 75K synthetic', color: 'indigo' },
          { label: 'Scenarios/Run', value: '1,000', sub: 'Configurable 100–5,000', color: 'violet' },
          { label: 'Models Trained', value: '3', sub: 'cGAN + DCGAN + VAE', color: 'blue' },
          { label: 'System Status', value: 'Nominal', sub: 'All services online', color: 'green' },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${
              s.color === 'indigo' ? 'text-indigo-700' :
              s.color === 'violet' ? 'text-violet-700' :
              s.color === 'blue' ? 'text-blue-700' :
              'text-green-700'
            }`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Model Components */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">System Components</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {modelComponents.map((m) => {
            const colors = colorMap[m.color];
            return (
              <Card key={m.name} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors.dot}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-gray-900">{m.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                      {m.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{m.type}</p>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    <div>
                      <p className="text-[10px] text-gray-400">Records</p>
                      <p className="text-xs font-semibold text-gray-700">{m.records}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Performance</p>
                      <p className="text-xs font-semibold text-gray-700">{m.accuracy}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">Full Pipeline — Click any node for details</h3>
        <div className="flex flex-wrap gap-2 items-center">
          {pipelineSteps.map((step, index) => {
            const Icon = step.icon;
            const colors = colorMap[step.color];
            return (
              <React.Fragment key={step.id}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedStep(step)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${colors.bg} ${colors.border} ${colors.text} hover:shadow-md`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-bold whitespace-nowrap">{step.label}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                </motion.button>
                {index < pipelineSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {selectedStep && (
        <StepDetail step={selectedStep} onClose={() => setSelectedStep(null)} />
      )}
    </div>
  );
};
