import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus, ArrowRight, Truck, Users, Building2, Package, AlertTriangle
} from 'lucide-react';
import { Card, Button, StatusBadge } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';
import { getRiskColor, getRiskLabel } from '../utils/formatters';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const { plans, setActivePlan } = useAppStore();

  const statusLabel: Record<string, string> = {
    draft: 'Draft',
    active: 'Active',
    stress_testing: 'Stress Testing',
    completed: 'Completed',
    archived: 'Archived',
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mission Plans</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and stress-test your food redistribution plans.</p>
        </div>
        <Button onClick={() => navigate('/plans/create')}>
          <Plus className="w-4 h-4" /> New Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        {plans.map((plan) => (
          <motion.div key={plan.id} variants={itemVariants}>
            <Card hover className="h-full flex flex-col" onClick={() => {
              setActivePlan(plan);
              navigate('/simulator');
            }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{plan.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{plan.city} • {plan.operatingPeriod}</p>
                </div>
                <StatusBadge status={plan.status} />
              </div>

              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{plan.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { icon: <Building2 className="w-3.5 h-3.5" />, label: 'Donors', value: plan.donors.length },
                  { icon: <Users className="w-3.5 h-3.5" />, label: 'NGOs', value: plan.ngos.length },
                  { icon: <Truck className="w-3.5 h-3.5" />, label: 'Vehicles', value: plan.vehicles.length },
                  { icon: <Package className="w-3.5 h-3.5" />, label: 'Food/Day', value: `${plan.expectedFoodKg}kg` },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-indigo-500">{stat.icon}</span>
                    <div>
                      <p className="text-[10px] text-gray-400">{stat.label}</p>
                      <p className="text-xs font-semibold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Risk Score */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${getRiskColor(plan.riskScore)}`} />
                  <span className="text-xs text-gray-500">Risk Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getRiskColor(plan.riskScore)}`}>
                    {plan.riskScore}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    plan.riskScore >= 75 ? 'bg-red-100 text-red-600' :
                    plan.riskScore >= 55 ? 'bg-orange-100 text-orange-600' :
                    plan.riskScore >= 30 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {getRiskLabel(plan.riskScore)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end">
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Open Plan <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Create New Plan card */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => navigate('/plans/create')}
            className="h-full min-h-[280px] w-full border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Create New Plan</p>
              <p className="text-xs mt-0.5">Define donors, NGOs, vehicles</p>
            </div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
