import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Zap, Activity, AlertTriangle,
  Users, Lightbulb, History, Settings, Database, Server,
  ChevronLeft, ChevronRight, Brain, ShieldAlert, TrendingUp, ImageIcon
} from 'lucide-react';
import { cn } from '../../utils/formatters';
import { useAppStore } from '../../store/useAppStore';

const navGroups = [
  {
    label: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/' },
      { id: 'plans', label: 'Mission Plans', icon: ClipboardList, path: '/plans' },
      { id: 'scenarios', label: 'Scenario Generator', icon: Zap, path: '/scenarios' },
      { id: 'simulator', label: 'Stress Simulator', icon: Activity, path: '/simulator' },
      { id: 'risk', label: 'Risk Analysis', icon: ShieldAlert, path: '/risk' },
      { id: 'agents', label: 'AI Agents', icon: Brain, path: '/agents' },
      { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, path: '/recommendations' },
      { id: 'comparison', label: 'Before vs After', icon: TrendingUp, path: '/comparison' },
      { id: 'history', label: 'Simulation History', icon: History, path: '/history' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'models', label: 'Model Status', icon: Server, path: '/models' },
      { id: 'food-condition', label: 'DCGAN Food Quality', icon: ImageIcon, path: '/food-condition' },
      { id: 'dataset', label: 'Dataset', icon: Database, path: '/dataset' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col bg-slate-900 border-r border-slate-800 h-screen flex-shrink-0 overflow-hidden"
      style={{ minWidth: sidebarCollapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b border-slate-800',
        sidebarCollapsed ? 'justify-center px-2' : ''
      )}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-bold text-white whitespace-nowrap">IdeaStress AI</p>
              <p className="text-xs text-slate-400 whitespace-nowrap">Stress Testing Engine</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 mb-2 text-[10px] font-semibold text-slate-500 tracking-widest uppercase"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-150 relative group',
                        sidebarCollapsed ? 'justify-center px-2' : '',
                        active
                          ? 'bg-indigo-600/20 text-indigo-400'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 rounded-r"
                        />
                      )}
                      <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-indigo-400' : '')} />
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm font-medium whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {/* Tooltip on collapsed */}
                      {sidebarCollapsed && (
                        <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-slate-700">
                          {item.label}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* GenAI Engine Status */}
      <div className={cn('border-t border-slate-800 p-4', sidebarCollapsed ? 'px-2' : '')}>
        <AnimatePresence>
          {!sidebarCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-300">GenAI Engine</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs text-green-400">Online</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="GenAI Engine Online" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  );
};
