import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Zap, AlertTriangle, TrendingUp,
  CheckCircle, Circle, Loader2, ChevronRight, ArrowRight,
  Truck, Users, Building2, Package, Activity
} from 'lucide-react';
import { Card, Button, StatusBadge } from '../components/ui/Card';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { useAppStore } from '../store/useAppStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const workflowSteps = [
  { label: 'Plan Created', icon: ClipboardList, status: 'done', detail: 'City Evening Redistribution' },
  { label: 'Scenarios Generated', icon: Zap, status: 'done', detail: '1,000 scenarios' },
  { label: 'Simulation Running', icon: Activity, status: 'active', detail: 'SCN-0381 active' },
  { label: 'AI Analysis', icon: Users, status: 'pending', detail: 'Awaiting simulation' },
  { label: 'Recommendations', icon: TrendingUp, status: 'pending', detail: 'Awaiting analysis' },
  { label: 'Re-Test', icon: CheckCircle, status: 'pending', detail: 'Awaiting improvements' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activePlan } = useAppStore();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Live Stress Testing</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Community Food Redistribution Stress Center
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Test your redistribution plans against AI-generated real-world failure scenarios.
        </p>
      </motion.div>

      {/* Key Tagline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 p-6 text-white"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative">
          <p className="text-base sm:text-lg font-semibold text-indigo-200">
            "Instead of asking AI whether a plan is good, IdeaStress AI tries to{' '}
            <span className="text-red-400 font-bold">BREAK</span> the plan."
          </p>
          <div className="mt-3 flex flex-wrap gap-3 items-center">
            {['Generate', 'Stress', 'Measure', 'Improve', 'Retest'].map((step, i) => (
              <React.Fragment key={step}>
                <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {step}
                </span>
                {i < 4 && <ChevronRight className="w-4 h-4 text-indigo-400" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { title: 'Active Plans', value: 12, icon: <ClipboardList />, color: 'indigo', subtitle: '3 stress testing' },
          { title: 'Scenarios Generated', value: 4850, icon: <Zap />, color: 'violet', subtitle: 'Across all plans' },
          { title: 'High-Risk Scenarios', value: 326, icon: <AlertTriangle />, color: 'red', subtitle: '6.7% of total' },
          { title: 'Avg Resilience', value: '78%', icon: <TrendingUp />, color: 'amber', subtitle: 'Across active plans', noCount: true },
        ].map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <Card className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.title}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900">
                    {card.noCount ? card.value : (
                      <AnimatedCounter
                        target={typeof card.value === 'number' ? card.value : 0}
                        duration={1800}
                      />
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{card.subtitle}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  card.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  card.color === 'violet' ? 'bg-violet-100 text-violet-600' :
                  card.color === 'red' ? 'bg-red-100 text-red-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  <span className="w-5 h-5">{card.icon}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* 2-column: Active Plan + Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Active Plan</p>
                <h3 className="text-base font-bold text-gray-900">{activePlan?.name}</h3>
              </div>
              <StatusBadge status="stress_testing" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: <Building2 className="w-4 h-4" />, label: 'Restaurants', value: activePlan?.donors.length || 0, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { icon: <Users className="w-4 h-4" />, label: 'NGOs', value: activePlan?.ngos.length || 0, color: 'text-violet-600', bg: 'bg-violet-50' },
                { icon: <Truck className="w-4 h-4" />, label: 'Vehicles', value: activePlan?.vehicles.length || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: <Package className="w-4 h-4" />, label: 'Expected Food', value: `${activePlan?.expectedFoodKg}kg`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map((item) => (
                <div key={item.label} className={`flex items-center gap-2 p-3 rounded-lg ${item.bg}`}>
                  <span className={item.color}>{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-bold text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk Score */}
            <div className="flex items-center justify-between mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
              <div>
                <p className="text-xs text-gray-500">Risk Score</p>
                <p className="text-2xl font-bold text-red-600">{activePlan?.riskScore}<span className="text-sm text-red-400">/100</span></p>
              </div>
              <div className="text-right">
                <StatusBadge status="critical" />
                <p className="text-xs text-gray-500 mt-1">Requires improvement</p>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => navigate('/simulator')}
            >
              Continue Stress Test <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </motion.div>

        {/* Workflow Pipeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">System Workflow</p>
            <div className="space-y-2">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                const isDone = step.status === 'done';
                const isActive = step.status === 'active';

                return (
                  <div key={step.label} className="flex items-center gap-3">
                    {/* Connector */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDone ? 'bg-green-100 text-green-600' :
                        isActive ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-300 ring-offset-1' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {isDone ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : isActive ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      {index < workflowSteps.length - 1 && (
                        <div className={`w-0.5 h-3 mt-1 ${isDone ? 'bg-green-300' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    {/* Label */}
                    <div className="flex-1 min-w-0 pb-2">
                      <p className={`text-sm font-semibold ${
                        isDone ? 'text-green-700' : isActive ? 'text-indigo-700' : 'text-gray-400'
                      }`}>
                        {isDone ? '✓ ' : ''}{step.label}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{step.detail}</p>
                    </div>
                    {isActive && (
                      <div className="flex-shrink-0">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                          RUNNING
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Create New Plan', icon: ClipboardList, path: '/plans/create', color: 'indigo' },
              { label: 'Generate Scenarios', icon: Zap, path: '/scenarios', color: 'violet' },
              { label: 'Run Simulation', icon: Activity, path: '/simulator', color: 'blue' },
              { label: 'View AI Analysis', icon: Users, path: '/agents', color: 'amber' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all duration-150 hover:-translate-y-0.5 ${
                    action.color === 'indigo' ? 'border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600' :
                    action.color === 'violet' ? 'border-violet-200 hover:bg-violet-50 hover:border-violet-300 text-violet-600' :
                    action.color === 'blue' ? 'border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600' :
                    'border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-amber-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold text-center">{action.label}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
