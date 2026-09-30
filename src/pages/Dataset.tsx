import React from 'react';
import { Card } from '../components/ui/Card';

// Dataset page - reuses models content focused on data
export const Dataset: React.FC = () => {
  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dataset</h1>
        <p className="text-sm text-gray-500 mt-1">Training data and synthetic dataset statistics.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Real Records', value: '25,000', sub: 'Historical operational data', color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Synthetic Records', value: '75,000', sub: 'GAN-generated scenarios', color: 'bg-violet-50 text-violet-700' },
          { label: 'Total Dataset', value: '100,000', sub: 'Combined dataset', color: 'bg-blue-50 text-blue-700' },
          { label: 'Feature Dimensions', value: '47', sub: 'Input feature vectors', color: 'bg-green-50 text-green-700' },
        ].map((stat) => (
          <Card key={stat.label} className={stat.color}>
            <p className="text-xs font-medium opacity-70">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs opacity-60 mt-0.5">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Dataset Features</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            'Demand Quantity (kg)', 'Food Supply Available (kg)', 'Traffic Congestion Index',
            'Vehicle Availability Count', 'Vehicle Capacity Utilization', 'NGO Storage Capacity',
            'Food Expiry Window (min)', 'Donor Reliability Score', 'Beneficiary Population',
            'Time of Day', 'Day of Week', 'Weather Condition',
            'Fuel Cost Index', 'Driver Availability', 'Road Network Score',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
              <span className="text-xs text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Data Quality Metrics</h3>
        <div className="space-y-3">
          {[
            { label: 'Completeness', value: 98.7 },
            { label: 'Consistency', value: 96.2 },
            { label: 'GAN Fidelity Score', value: 94.1 },
            { label: 'Distribution Coverage', value: 91.8 },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700">{m.label}</span>
                <span className="font-bold text-indigo-600">{m.value}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
