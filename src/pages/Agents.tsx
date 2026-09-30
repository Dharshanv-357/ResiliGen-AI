import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Truck, Users, Warehouse, Zap, Brain,
  CheckCircle2, Loader2, Clock
} from 'lucide-react';
import { Card, Button } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';
import { Agent } from '../types/agent';

const iconMap: Record<string, React.ReactNode> = {
  Database: <Database className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Warehouse: <Warehouse className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
};

const AgentCard: React.FC<{ agent: Agent; index: number }> = ({ agent, index }) => {
  const isDevil = agent.role === 'devils_advocate';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card
        className={`relative overflow-hidden h-full ${
          isDevil
            ? 'border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-slate-900'
            : 'border border-gray-100'
        }`}
      >
        {isDevil && (
          <div className="absolute top-0 right-0 px-3 py-1 bg-violet-600 text-white text-[10px] font-bold tracking-wider rounded-bl-xl">
            DEVIL'S ADVOCATE
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isDevil
              ? 'bg-violet-700 text-white'
              : agent.status === 'completed' ? 'bg-indigo-100 text-indigo-600'
              : agent.status === 'analyzing' ? 'bg-blue-100 text-blue-600 animate-pulse'
              : agent.status === 'thinking' ? 'bg-amber-100 text-amber-600'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {iconMap[agent.icon] || <Brain className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-sm font-bold ${isDevil ? 'text-white' : 'text-gray-900'}`}>
                {agent.name}
              </h3>
              {/* Status Indicator */}
              <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                agent.status === 'completed' ? 'bg-green-100 text-green-700' :
                agent.status === 'analyzing' ? 'bg-blue-100 text-blue-700' :
                agent.status === 'thinking' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-500'
              }`}>
                {agent.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                {(agent.status === 'analyzing' || agent.status === 'thinking') && (
                  <Loader2 className="w-3 h-3 animate-spin" />
                )}
                {agent.status === 'idle' && <Clock className="w-3 h-3" />}
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </div>
            </div>
            <p className={`text-xs mt-0.5 ${isDevil ? 'text-violet-200' : 'text-gray-500'}`}>
              {agent.description}
            </p>
          </div>
        </div>

        {/* Finding */}
        <AnimatePresence>
          {agent.status === 'completed' && agent.finding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-3 p-3 rounded-lg text-xs leading-relaxed ${
                isDevil
                  ? 'bg-violet-900/50 border border-violet-500/30 text-violet-100'
                  : 'bg-indigo-50 border border-indigo-100 text-gray-700'
              }`}
            >
              {isDevil && (
                <p className="text-[10px] font-bold text-red-400 mb-1 uppercase tracking-wide">⚠️ Challenge Found</p>
              )}
              "{agent.finding}"
            </motion.div>
          )}
        </AnimatePresence>

        {agent.status === 'completed' && agent.confidence && (
          <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-500">
            <span>Confidence: <span className={`font-bold ${isDevil ? 'text-violet-300' : 'text-indigo-600'}`}>{agent.confidence}%</span></span>
            {agent.analysisTime && (
              <span>Analysis time: <span className="font-medium">{agent.analysisTime}s</span></span>
            )}
          </div>
        )}

        {(agent.status === 'thinking' || agent.status === 'analyzing') && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${isDevil ? 'bg-violet-400' : 'bg-indigo-400'}`}
                  style={{ animation: `bounce 1.4s ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
            <span>{agent.status === 'thinking' ? 'Processing scenario data...' : 'Running analysis...'}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export const Agents: React.FC = () => {
  const { agents, isAnalyzing, analysisComplete, startAgentAnalysis } = useAppStore();

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Agent Stress Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">
            Independent AI agents evaluate the same scenario from different operational perspectives.
          </p>
        </div>
        <Button
          onClick={startAgentAnalysis}
          loading={isAnalyzing}
          disabled={isAnalyzing}
        >
          <Brain className="w-4 h-4" />
          {isAnalyzing ? 'Analyzing...' : 'Run Multi-Agent Analysis'}
        </Button>
      </div>

      {/* Status Overview */}
      {(isAnalyzing || analysisComplete) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-indigo-800">Analysis in progress</p>
                <p className="text-xs text-indigo-600">
                  {agents.filter(a => a.status === 'completed').length}/{agents.length} agents completed
                </p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">Analysis complete</p>
                <p className="text-xs text-green-600">All {agents.length} agents have submitted findings</p>
              </div>
            </>
          )}
          <div className="ml-auto flex gap-1.5">
            {agents.map((a) => (
              <div
                key={a.id}
                className={`w-2 h-2 rounded-full ${
                  a.status === 'completed' ? 'bg-green-500' :
                  a.status === 'analyzing' ? 'bg-blue-500 animate-pulse' :
                  a.status === 'thinking' ? 'bg-amber-500 animate-pulse' :
                  'bg-gray-300'
                }`}
                title={`${a.name}: ${a.status}`}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.slice(0, 4).map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>

      {/* Devil's Advocate - Full Width */}
      {agents[4] && (
        <div className="grid grid-cols-1 gap-4">
          <AgentCard agent={agents[4]} index={4} />
        </div>
      )}

      {/* Overall Finding */}
      {analysisComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-slate-900 to-indigo-950 border-0 text-white">
            <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wide mb-2">Agent Consensus Finding</p>
            <p className="text-sm leading-relaxed text-slate-200">
              The plan faces <span className="text-red-400 font-bold">critical risk</span> when vehicle V2 fails simultaneously
              with high demand in Area 3. The compound failure scenario has a{' '}
              <span className="text-amber-400 font-bold">23% occurrence probability</span> under current stress parameters.
              Emergency vehicle provisioning and route redundancy are the highest-priority improvements.
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
