import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, AlertCircle, CheckCircle2, AlertTriangle, Info,
  Truck, Building2, Package, Clock, Activity, Users
} from 'lucide-react';
import { Card, Button, ProgressBar } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

// Node network positions for simulation map
const MAP_NODES = {
  donors: [
    { id: 'RA', label: 'Rest A', x: 8, y: 15, color: '#6366f1' },
    { id: 'RB', label: 'Rest B', x: 8, y: 35, color: '#6366f1' },
    { id: 'RC', label: 'Rest C', x: 8, y: 55, color: '#6366f1' },
    { id: 'RD', label: 'Rest D', x: 8, y: 75, color: '#6366f1' },
  ],
  ngos: [
    { id: 'N1', label: 'NGO 1', x: 82, y: 15, color: '#22c55e' },
    { id: 'N2', label: 'NGO 2', x: 82, y: 35, color: '#22c55e' },
    { id: 'N3', label: 'NGO 3', x: 82, y: 55, color: '#f97316' }, // Failed
    { id: 'N4', label: 'NGO 4', x: 82, y: 75, color: '#22c55e' },
  ],
  vehicles: [
    { id: 'V1', from: 'RA', to: 'N1', progress: 0.7, status: 'active' },
    { id: 'V2', from: 'RB', to: 'N2', progress: 0.3, status: 'failed' },
    { id: 'V3', from: 'RC', to: 'N3', progress: 0.5, status: 'delayed' },
  ],
};

const SimMap: React.FC<{ isRunning: boolean; progress: number }> = ({ isRunning, progress }) => {
  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden" style={{ height: '280px' }}>
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Routes */}
        {[
          { x1: 15, y1: 15, x2: 82, y2: 15, status: 'active', vehicle: 'V1', prog: Math.min(progress / 60, 1) },
          { x1: 15, y1: 35, x2: 82, y2: 35, status: 'failed', vehicle: 'V2', prog: 0.3 },
          { x1: 15, y1: 55, x2: 82, y2: 55, status: 'delayed', vehicle: 'V3', prog: Math.min(progress / 100, 0.6) },
          { x1: 15, y1: 75, x2: 82, y2: 15, status: 'active', vehicle: 'V1b', prog: Math.min(progress / 80, 0.9) },
        ].map((route) => {
          const color = route.status === 'active' ? '#22c55e' : route.status === 'delayed' ? '#f97316' : '#ef4444';
          const vehicleX = route.x1 + (route.x2 - route.x1) * route.prog;
          const vehicleY = route.y1 + (route.y2 - route.y1) * route.prog;
          return (
            <g key={route.vehicle}>
              <line
                x1={`${route.x1}%`} y1={`${route.y1}%`}
                x2={`${route.x2}%`} y2={`${route.y2}%`}
                stroke={color} strokeWidth="0.5" strokeOpacity="0.4"
                strokeDasharray={route.status === 'failed' ? '2,2' : '0'}
              />
              {/* Active route fill */}
              <line
                x1={`${route.x1}%`} y1={`${route.y1}%`}
                x2={`${vehicleX}%`} y2={`${vehicleY}%`}
                stroke={color} strokeWidth="0.8" strokeOpacity="0.9"
              />
              {/* Vehicle dot */}
              {isRunning && route.status !== 'failed' && (
                <circle cx={`${vehicleX}%`} cy={`${vehicleY}%`} r="1.2" fill={color}>
                  <animate attributeName="r" values="1.2;1.8;1.2" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
              {route.status === 'failed' && (
                <text x={`${(route.x1 + route.x2) / 2}%`} y={`${route.y1 - 3}%`} textAnchor="middle" className="text-red-400" style={{ fontSize: '2px', fill: '#ef4444' }}>
                  BREAKDOWN
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Donor nodes */}
      <div className="absolute left-2 inset-y-0 flex flex-col justify-around py-4">
        {MAP_NODES.donors.map((n) => (
          <div key={n.id} className="flex items-center gap-1">
            <div className="w-10 h-6 bg-indigo-600/90 border border-indigo-400 rounded text-white text-[8px] font-bold flex items-center justify-center">
              {n.label}
            </div>
          </div>
        ))}
      </div>

      {/* NGO nodes */}
      <div className="absolute right-2 inset-y-0 flex flex-col justify-around py-4">
        {MAP_NODES.ngos.map((n, i) => (
          <div key={n.id} className="flex items-center gap-1 justify-end">
            <div className={`w-10 h-6 border rounded text-white text-[8px] font-bold flex items-center justify-center ${
              i === 2 ? 'bg-red-600/90 border-red-400' : 'bg-green-700/90 border-green-400'
            }`}>
              {n.label}
            </div>
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[9px] text-slate-400 px-12">
        <span>● Food Donors</span>
        <span>🟢 Active &nbsp; 🟠 Delayed &nbsp; 🔴 Failed</span>
        <span>● NGOs</span>
      </div>

      {/* Overlay when not running */}
      {!isRunning && progress === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[1px]">
          <p className="text-slate-400 text-sm font-medium">Press Run Simulation to begin</p>
        </div>
      )}
    </div>
  );
};

export const Simulator: React.FC = () => {
  const {
    simulationStatus, simulationProgress, simulationEvents,
    currentSimulationResult, startSimulation, pauseSimulation, resetSimulation,
    activePlan, isImprovedRun
  } = useAppStore();

  const eventsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simulationEvents]);

  const isRunning = simulationStatus === 'running';
  const isCompleted = simulationStatus === 'completed';
  const isPaused = simulationStatus === 'paused';

  const eventIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />;
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />;
      case 'success': return <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />;
      default: return <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stress Simulation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Observe how the redistribution plan behaves under generated conditions.
          </p>
        </div>
        {isImprovedRun && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-green-700">Improved Plan Active</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <Card>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Active Plan</p>
            <p className="text-sm font-bold text-gray-900 truncate">{activePlan?.name}</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Scenario</p>
            <p className="text-sm font-bold text-gray-900">SCN-0381 (Critical)</p>
          </div>
          <div className="flex items-center gap-2">
            {!isRunning && !isCompleted && (
              <Button onClick={startSimulation}>
                <Play className="w-4 h-4" /> Run Simulation
              </Button>
            )}
            {isRunning && (
              <Button variant="secondary" onClick={pauseSimulation}>
                <Pause className="w-4 h-4" /> Pause
              </Button>
            )}
            {(isCompleted || isPaused) && (
              <Button onClick={startSimulation}>
                <Play className="w-4 h-4" /> {isPaused ? 'Resume' : 'Re-Run'}
              </Button>
            )}
            <Button variant="ghost" onClick={resetSimulation}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {(isRunning || isCompleted || isPaused) && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Simulation Progress</span>
              <span className="font-bold text-indigo-600">{simulationProgress}%</span>
            </div>
            <ProgressBar
              value={simulationProgress}
              color={isCompleted ? (isImprovedRun ? 'green' : 'indigo') : 'indigo'}
            />
          </div>
        )}
      </Card>

      {/* Main content: Map + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Simulation Map */}
        <div className="lg:col-span-2">
          <Card padding="sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Distribution Network
            </p>
            <SimMap isRunning={isRunning} progress={simulationProgress} />
          </Card>
        </div>

        {/* Live Metrics */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Metrics</p>
          {[
            { label: 'Food Collected', value: currentSimulationResult?.foodCollectedKg || (isRunning ? Math.round(simulationProgress * 4.1) : 0), suffix: ' kg', color: 'indigo', icon: <Package className="w-4 h-4" /> },
            { label: 'Food Delivered', value: currentSimulationResult?.foodDeliveredKg || (isRunning ? Math.round(simulationProgress * 2.86) : 0), suffix: ' kg', color: 'green', icon: <CheckCircle2 className="w-4 h-4" /> },
            { label: 'Food Wasted', value: currentSimulationResult?.foodWastedKg || (isRunning ? Math.round(simulationProgress * 1.24) : 0), suffix: ' kg', color: 'red', icon: <AlertTriangle className="w-4 h-4" /> },
            { label: 'Unmet Demand', value: currentSimulationResult?.unmetDemandKg || (isRunning ? Math.round(simulationProgress * 1.34) : 0), suffix: ' kg', color: 'orange', icon: <AlertCircle className="w-4 h-4" /> },
            { label: 'Avg Delivery Time', value: currentSimulationResult?.averageDeliveryTimeMin || (isRunning ? 48 : 0), suffix: ' min', color: 'amber', icon: <Clock className="w-4 h-4" /> },
            { label: 'Vehicle Utilization', value: currentSimulationResult?.vehicleUtilization || (isRunning ? 96 : 0), suffix: '%', color: 'violet', icon: <Truck className="w-4 h-4" /> },
          ].map((m) => (
            <div key={m.label} className={`flex items-center gap-3 p-3 rounded-xl border ${
              m.color === 'green' ? 'bg-green-50 border-green-100' :
              m.color === 'red' ? 'bg-red-50 border-red-100' :
              m.color === 'orange' ? 'bg-orange-50 border-orange-100' :
              m.color === 'amber' ? 'bg-amber-50 border-amber-100' :
              m.color === 'violet' ? 'bg-violet-50 border-violet-100' :
              'bg-indigo-50 border-indigo-100'
            }`}>
              <span className={
                m.color === 'green' ? 'text-green-600' :
                m.color === 'red' ? 'text-red-600' :
                m.color === 'orange' ? 'text-orange-600' :
                m.color === 'amber' ? 'text-amber-600' :
                m.color === 'violet' ? 'text-violet-600' :
                'text-indigo-600'
              }>
                {m.icon}
              </span>
              <div className="flex-1">
                <p className="text-[10px] text-gray-500">{m.label}</p>
                <p className={`text-lg font-bold ${
                  m.color === 'green' ? 'text-green-700' :
                  m.color === 'red' ? 'text-red-700' :
                  m.color === 'orange' ? 'text-orange-700' :
                  m.color === 'amber' ? 'text-amber-700' :
                  m.color === 'violet' ? 'text-violet-700' :
                  'text-indigo-700'
                }`}>
                  {(isRunning || isCompleted) ? (
                    <AnimatedCounter target={m.value} duration={600} suffix={m.suffix} />
                  ) : `0${m.suffix}`}
                </p>
              </div>
            </div>
          ))}

          {isCompleted && currentSimulationResult && (
            <div className={`p-3 rounded-xl border font-bold text-center ${
              currentSimulationResult.riskScore >= 75 ? 'bg-red-50 border-red-200 text-red-700' :
              currentSimulationResult.riskScore >= 55 ? 'bg-orange-50 border-orange-200 text-orange-700' :
              currentSimulationResult.riskScore >= 30 ? 'bg-amber-50 border-amber-200 text-amber-700' :
              'bg-green-50 border-green-200 text-green-700'
            }`}>
              <p className="text-xs opacity-70 mb-0.5">Risk Score</p>
              <p className="text-3xl">{currentSimulationResult.riskScore}<span className="text-lg font-normal">/100</span></p>
              <p className="text-xs mt-0.5 uppercase tracking-wide">
                {currentSimulationResult.riskScore >= 75 ? 'CRITICAL' :
                 currentSimulationResult.riskScore >= 55 ? 'HIGH' :
                 currentSimulationResult.riskScore >= 30 ? 'MEDIUM' : 'LOW'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Event Stream */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-gray-900">Live Event Stream</h3>
          {isRunning && (
            <div className="flex items-center gap-1 ml-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
          )}
        </div>
        <div
          className="font-mono text-xs bg-slate-950 text-slate-300 rounded-b-xl overflow-y-auto"
          style={{ height: '220px' }}
        >
          {simulationEvents.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500">
              <span>Waiting for simulation to start...</span>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {simulationEvents.map((evt) => (
                <AnimatePresence key={evt.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-slate-500 flex-shrink-0">{evt.timestamp}</span>
                    {eventIcon(evt.type)}
                    <div className="flex-1">
                      {evt.component && (
                        <span className={`mr-1 ${
                          evt.type === 'error' ? 'text-red-400' :
                          evt.type === 'warning' ? 'text-amber-400' :
                          'text-indigo-400'
                        }`}>[{evt.component}]</span>
                      )}
                      <span className={
                        evt.type === 'error' ? 'text-red-300' :
                        evt.type === 'warning' ? 'text-amber-300' :
                        evt.type === 'success' ? 'text-green-300' :
                        'text-slate-300'
                      }>{evt.message}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ))}
              <div ref={eventsEndRef} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
