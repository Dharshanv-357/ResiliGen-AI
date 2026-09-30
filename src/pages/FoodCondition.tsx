import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ImageIcon, Zap, AlertTriangle, CheckCircle2,
  Clock, BarChart2, RefreshCw, Info, Layers
} from 'lucide-react';
import { Card, Button } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/Card';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

// Mock DCGAN output samples per condition state
const conditions = [
  {
    id: 'fresh',
    label: 'FRESH',
    timeLabel: '0 – 30 min',
    description: 'Food collected within 30 minutes. Optimal visual quality. Safe for immediate distribution.',
    qualityScore: 94,
    color: 'green',
    border: 'border-green-300',
    bg: 'bg-green-50',
    textColor: 'text-green-700',
    barColor: '#22c55e',
    statusDot: 'bg-green-500',
    donorCount: 14,
    kgEstimate: 280,
  },
  {
    id: 'at_risk',
    label: 'AT RISK',
    timeLabel: '60 – 90 min',
    description: 'Food approaching expiry threshold. Requires priority dispatch. Quality degrading, still safe.',
    qualityScore: 52,
    color: 'amber',
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    textColor: 'text-amber-700',
    barColor: '#f59e0b',
    statusDot: 'bg-amber-500',
    donorCount: 6,
    kgEstimate: 96,
  },
  {
    id: 'expired',
    label: 'EXPIRED',
    timeLabel: '120+ min',
    description: 'Food has exceeded the safe distribution window. DCGAN flags as waste. Must not be distributed.',
    qualityScore: 8,
    color: 'red',
    border: 'border-red-300',
    bg: 'bg-red-50',
    textColor: 'text-red-700',
    barColor: '#ef4444',
    statusDot: 'bg-red-500',
    donorCount: 2,
    kgEstimate: 34,
  },
];

const donorSamples = [
  { donor: 'Restaurant A – Spice Garden', collected: '18:05', elapsed: '12 min', quality: 96, state: 'fresh' },
  { donor: 'Restaurant B – The Grand Hotel', collected: '17:55', elapsed: '22 min', quality: 91, state: 'fresh' },
  { donor: 'Restaurant C – Annapoorna', collected: '17:30', elapsed: '47 min', quality: 78, state: 'fresh' },
  { donor: 'Hotel E – Kovai Bites', collected: '17:00', elapsed: '77 min', quality: 49, state: 'at_risk' },
  { donor: 'Canteen G – PSG Arts College', collected: '16:45', elapsed: '92 min', quality: 34, state: 'at_risk' },
  { donor: 'Caterer H – Raji Catering', collected: '16:10', elapsed: '127 min', quality: 9, state: 'expired' },
];

const modelMetrics = [
  { label: 'Generator Loss', value: '0.412', trend: '↓' },
  { label: 'Discriminator Loss', value: '0.388', trend: '↓' },
  { label: 'FID Score', value: '18.4', trend: '↓' },
  { label: 'Inception Score', value: '6.91', trend: '↑' },
  { label: 'Training Epochs', value: '200', trend: '' },
  { label: 'Image Resolution', value: '64×64', trend: '' },
];

export const FoodCondition: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(100);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'model' | 'batch'>('visualizer');

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationDone(false);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGenerationDone(true);
          return 100;
        }
        return prev + Math.random() * 6 + 2;
      });
    }, 150);
  };

  const getQualityColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStateBadge = (state: string) => {
    if (state === 'fresh') return 'bg-green-100 text-green-700 border-green-200';
    if (state === 'at_risk') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <ImageIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">DCGAN Module</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Food Condition Analyzer</h1>
          <p className="text-sm text-gray-500 mt-1">
            Deep Convolutional GAN generates visual food-quality snapshots to classify
            redistribution batches by safety and urgency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-full">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-bold text-violet-700">DCGAN</span>
            <span className="text-xs text-green-600 font-bold">● Trained</span>
          </div>
          <Button
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={isGenerating}
          >
            <RefreshCw className="w-4 h-4" />
            Re-Generate Batch
          </Button>
        </div>
      </div>

      {/* What is DCGAN here */}
      <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-violet-800">How DCGAN fits into the pipeline</p>
            <p className="text-xs text-violet-700 mt-1 leading-relaxed">
              The DCGAN is trained on food-condition images labelled by time-since-collection.
              During stress simulation, when the Conditional GAN generates a scenario with a short expiry window,
              the DCGAN is queried to produce a visual snapshot of what the food batch looks like — helping operators
              and AI agents identify which batches must be dispatched first. This adds a <strong>visual intelligence layer</strong> on top of the numerical scenario data.
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {([
          { id: 'visualizer', label: 'Condition Visualizer' },
          { id: 'batch', label: 'Batch Analysis' },
          { id: 'model', label: 'Model Details' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: VISUALIZER ── */}
      {activeTab === 'visualizer' && (
        <div className="space-y-5">
          {/* Generation progress */}
          {(isGenerating || generationDone) && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">DCGAN Image Generation</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isGenerating ? 'Generating food condition snapshots...' : '✓ Snapshots generated successfully'}
                  </p>
                </div>
                <span className="text-sm font-bold text-violet-600">
                  {Math.round(Math.min(generationProgress, 100))}%
                </span>
              </div>
              <ProgressBar
                value={Math.min(generationProgress, 100)}
                color={generationDone && !isGenerating ? 'green' : 'indigo'}
              />
              {isGenerating && (
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  Running forward pass through Generator... latent_dim=128, resolution=64×64
                </p>
              )}
            </Card>
          )}

          {/* DCGAN Output Image */}
          {generationDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card padding="sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    DCGAN Generated Food Condition Snapshots — SCN-0381
                  </p>
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    64×64 px · 3 channels · Generator epoch 200
                  </span>
                </div>
                <img
                  src="/dcgan_food_conditions.jpg"
                  alt="DCGAN generated food condition snapshots"
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: '320px' }}
                />
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  DCGAN output — Left: Fresh (0h) | Centre: At Risk (90 min) | Right: Expired (2h+)
                </p>
              </Card>
            </motion.div>
          )}

          {/* Three condition cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {conditions.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card
                  className={`cursor-pointer border-2 transition-all ${
                    selectedCondition === c.id ? `${c.border} shadow-md` : 'border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => setSelectedCondition(selectedCondition === c.id ? null : c.id)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${c.statusDot}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${c.textColor}`}>{c.label}</span>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.bg} ${c.textColor}`}>
                      <Clock className="w-3 h-3" />
                      {c.timeLabel}
                    </div>
                  </div>

                  {/* Quality Score */}
                  <div className="mb-3">
                    <div className="flex items-end gap-1 mb-1.5">
                      <span className={`text-3xl font-black ${c.textColor}`}>
                        <AnimatedCounter target={c.qualityScore} duration={1200} suffix="%" />
                      </span>
                      <span className="text-xs text-gray-400 mb-1">quality</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ background: c.barColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${c.qualityScore}%` }}
                        transition={{ duration: 1.2, delay: i * 0.1 }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{c.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400">Donor batches</p>
                      <p className="text-sm font-bold text-gray-800">{c.donorCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Food volume</p>
                      <p className="text-sm font-bold text-gray-800">{c.kgEstimate} kg</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recommendation based on DCGAN */}
          <AnimatePresence>
            {generationDone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Card className="bg-gradient-to-r from-slate-900 to-indigo-950 border-0 text-white">
                  <div className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1">
                        DCGAN → Dispatch Priority Signal
                      </p>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        DCGAN flagged <span className="text-amber-400 font-bold">34 kg</span> as expired
                        and <span className="text-amber-400 font-bold">96 kg</span> as at-risk.
                        Recommends immediate dispatch of at-risk batches from Caterer H and Hotel E.
                        Expired batch from Caterer H must <span className="text-red-400 font-bold">not be distributed</span>.
                        This input is forwarded to the Logistics Agent for route re-prioritization.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── TAB: BATCH ANALYSIS ── */}
      {activeTab === 'batch' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card padding="none">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Per-Donor Batch Quality — Scenario SCN-0381</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                DCGAN quality score per collected batch based on estimated time-in-transit
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Donor', 'Collection Time', 'Elapsed', 'DCGAN Quality Score', 'Status', 'Action'].map(h => (
                      <th key={h} className="py-2.5 px-4 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donorSamples.map((d, i) => (
                    <motion.tr
                      key={d.donor}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="border-b border-gray-50 hover:bg-gray-50/80"
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">{d.donor}</td>
                      <td className="py-3 px-4 font-mono text-gray-600">{d.collected}</td>
                      <td className="py-3 px-4 text-gray-600">{d.elapsed}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all"
                              style={{
                                width: `${d.quality}%`,
                                background: d.quality >= 70 ? '#22c55e' : d.quality >= 40 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <span className={`font-bold tabular-nums ${getQualityColor(d.quality)}`}>{d.quality}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStateBadge(d.state)}`}>
                          {d.state.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold ${
                          d.state === 'expired' ? 'text-red-600' :
                          d.state === 'at_risk' ? 'text-amber-600 animate-pulse' :
                          'text-green-600'
                        }`}>
                          {d.state === 'expired' ? '🔴 Discard' :
                           d.state === 'at_risk' ? '⚠️ Priority Dispatch' :
                           '✓ Standard Route'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 grid grid-cols-3 gap-3">
              {[
                { label: 'Safe for Distribution', value: '280 kg', color: 'text-green-700 bg-green-50' },
                { label: 'Priority Dispatch', value: '96 kg', color: 'text-amber-700 bg-amber-50' },
                { label: 'Flagged as Waste', value: '34 kg', color: 'text-red-700 bg-red-50' },
              ].map(s => (
                <div key={s.label} className={`text-center p-2 rounded-lg ${s.color}`}>
                  <p className="text-[10px] opacity-70">{s.label}</p>
                  <p className="text-lg font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* ── TAB: MODEL DETAILS ── */}
      {activeTab === 'model' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Architecture */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-violet-600" />
              <h3 className="font-bold text-gray-900">DCGAN Architecture</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Generator',
                  color: 'violet',
                  layers: [
                    'Input: latent_dim = 128',
                    'Linear → 4×4×512',
                    'ConvTranspose2d 512→256 (4×4)',
                    'BatchNorm + ReLU',
                    'ConvTranspose2d 256→128 (4×4)',
                    'BatchNorm + ReLU',
                    'ConvTranspose2d 128→64 (4×4)',
                    'BatchNorm + ReLU',
                    'ConvTranspose2d 64→3 (4×4)',
                    'Output: Tanh → 64×64×3 RGB',
                  ],
                },
                {
                  title: 'Discriminator',
                  color: 'indigo',
                  layers: [
                    'Input: 64×64×3 RGB image',
                    'Conv2d 3→64 (4×4, stride 2)',
                    'LeakyReLU (0.2)',
                    'Conv2d 64→128 (4×4, stride 2)',
                    'BatchNorm + LeakyReLU',
                    'Conv2d 128→256 (4×4, stride 2)',
                    'BatchNorm + LeakyReLU',
                    'Conv2d 256→512 (4×4, stride 2)',
                    'BatchNorm + LeakyReLU',
                    'Output: Sigmoid → real/fake',
                  ],
                },
              ].map(arch => (
                <div key={arch.title}>
                  <p className={`text-xs font-bold mb-2 ${arch.color === 'violet' ? 'text-violet-700' : 'text-indigo-700'}`}>
                    {arch.title}
                  </p>
                  <div className="space-y-1">
                    {arch.layers.map((layer, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${arch.color === 'violet' ? 'bg-violet-400' : 'bg-indigo-400'}`} />
                        <span className="font-mono text-gray-700">{layer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Training Metrics */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-4 h-4 text-violet-600" />
              <h3 className="font-bold text-gray-900">Training Metrics</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {modelMetrics.map(m => (
                <div key={m.label} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-medium">{m.label}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-lg font-bold text-gray-900">{m.value}</p>
                    {m.trend && (
                      <span className={`text-xs font-bold ${m.trend === '↓' ? 'text-green-500' : 'text-violet-500'}`}>
                        {m.trend}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Training dataset */}
          <Card>
            <h3 className="font-bold text-gray-900 mb-3">Training Dataset</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Images', value: '18,500' },
                { label: 'Fresh (0–30 min)', value: '8,200' },
                { label: 'At Risk (30–120 min)', value: '6,800' },
                { label: 'Expired (120+ min)', value: '3,500' },
              ].map(d => (
                <div key={d.label} className="text-center p-3 bg-violet-50 rounded-xl border border-violet-100">
                  <p className="text-[10px] text-violet-500">{d.label}</p>
                  <p className="text-lg font-bold text-violet-800 mt-0.5">{d.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
              {[
                { label: 'Image Resolution', value: '64 × 64 px' },
                { label: 'Colour Space', value: 'RGB (3 channels)' },
                { label: 'Optimizer', value: 'Adam (lr = 0.0002, β₁ = 0.5)' },
              ].map(d => (
                <div key={d.label} className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-gray-400">{d.label}</p>
                  <p className="font-semibold text-gray-700 mt-0.5">{d.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Role in pipeline */}
          <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-violet-800 mb-1">Role in the IdeaStress AI Pipeline</p>
                <ol className="space-y-1 text-xs text-violet-700 list-decimal list-inside">
                  <li>Scenario Generator (cGAN) sets an expiry window, e.g. <em>expiryWindow = 90 min</em></li>
                  <li>DCGAN receives this as a conditioning label and generates a food-condition image</li>
                  <li>Discriminator scores the image → quality score 0–100%</li>
                  <li>Batches below 40% are flagged for <strong>priority dispatch</strong></li>
                  <li>Batches below 15% are flagged as <strong>expired — do not distribute</strong></li>
                  <li>Flags are forwarded to the <strong>Logistics Agent</strong> for route re-prioritization</li>
                  <li>Dispatcher sees a visual snapshot + quality score per batch in the operator UI</li>
                </ol>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
