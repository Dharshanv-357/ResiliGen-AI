import React, { useState } from 'react';
import { Card, Button } from '../components/ui/Card';

export const Settings: React.FC = () => {
  const [riskThresholds, setRiskThresholds] = useState({
    low: 30, medium: 55, high: 75,
  });
  const [modelConfig, setModelConfig] = useState({
    ganEpochs: 100,
    batchSize: 64,
    latentDim: 128,
    defaultScenarios: 1000,
  });
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    simulationComplete: true,
    weeklyReport: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure model parameters, risk thresholds, and preferences.</p>
      </div>

      {/* Risk Thresholds */}
      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Risk Thresholds</h3>
        <div className="space-y-4">
          {[
            { key: 'low', label: 'Low Risk Threshold', color: 'text-green-600' },
            { key: 'medium', label: 'Medium Risk Threshold', color: 'text-amber-600' },
            { key: 'high', label: 'High Risk Threshold', color: 'text-orange-600' },
          ].map((t) => (
            <div key={t.key}>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">{t.label}</label>
                <span className={`text-sm font-bold ${t.color}`}>{(riskThresholds as Record<string, number>)[t.key]}</span>
              </div>
              <input
                type="range" min={10} max={90}
                value={(riskThresholds as Record<string, number>)[t.key]}
                onChange={(e) => setRiskThresholds(prev => ({ ...prev, [t.key]: Number(e.target.value) }))}
                className="w-full accent-indigo-600"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Model Configuration */}
      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Model Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'ganEpochs', label: 'GAN Training Epochs' },
            { key: 'batchSize', label: 'Batch Size' },
            { key: 'latentDim', label: 'Latent Dimension' },
            { key: 'defaultScenarios', label: 'Default Scenarios' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
              <input
                type="number"
                value={(modelConfig as Record<string, number>)[f.key]}
                onChange={(e) => setModelConfig(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {[
            { key: 'criticalAlerts', label: 'Critical Risk Alerts', sub: 'Get notified when a plan hits critical risk' },
            { key: 'simulationComplete', label: 'Simulation Complete', sub: 'Notify when simulation finishes' },
            { key: 'weeklyReport', label: 'Weekly Report', sub: 'Weekly summary of all stress tests' },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{n.label}</p>
                <p className="text-xs text-gray-500">{n.sub}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !(prev as Record<string, boolean>)[n.key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${(notifications as Record<string, boolean>)[n.key] ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${(notifications as Record<string, boolean>)[n.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="secondary">Reset to Defaults</Button>
        <Button onClick={handleSave} variant={saved ? 'success' : 'primary'}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};
