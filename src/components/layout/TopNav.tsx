import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../../utils/formatters';

const pageConfig: Record<string, { title: string; breadcrumb: string[] }> = {
  '/': { title: 'Overview', breadcrumb: ['IdeaStress AI', 'Overview'] },
  '/plans': { title: 'Mission Plans', breadcrumb: ['IdeaStress AI', 'Mission Plans'] },
  '/plans/create': { title: 'Create Plan', breadcrumb: ['IdeaStress AI', 'Mission Plans', 'Create'] },
  '/scenarios': { title: 'Scenario Generator', breadcrumb: ['IdeaStress AI', 'Scenario Generator'] },
  '/simulator': { title: 'Stress Simulator', breadcrumb: ['IdeaStress AI', 'Stress Simulator'] },
  '/risk': { title: 'Risk Analysis', breadcrumb: ['IdeaStress AI', 'Risk Analysis'] },
  '/agents': { title: 'AI Agents', breadcrumb: ['IdeaStress AI', 'AI Agents'] },
  '/recommendations': { title: 'Recommendations', breadcrumb: ['IdeaStress AI', 'Recommendations'] },
  '/comparison': { title: 'Before vs After', breadcrumb: ['IdeaStress AI', 'Comparison'] },
  '/history': { title: 'Simulation History', breadcrumb: ['IdeaStress AI', 'History'] },
  '/models': { title: 'Model Status', breadcrumb: ['IdeaStress AI', 'System', 'Models'] },
  '/dataset': { title: 'Dataset', breadcrumb: ['IdeaStress AI', 'System', 'Dataset'] },
  '/settings': { title: 'Settings', breadcrumb: ['IdeaStress AI', 'System', 'Settings'] },
};

export const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = pageConfig[location.pathname] || { title: 'IdeaStress AI', breadcrumb: ['IdeaStress AI'] };

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2">
        {config.breadcrumb.map((crumb, index) => (
          <React.Fragment key={crumb}>
            {index > 0 && <ChevronRight className="w-3 h-3 text-gray-300" />}
            <span className={cn(
              'text-sm',
              index === config.breadcrumb.length - 1
                ? 'text-gray-900 font-semibold'
                : 'text-gray-400 cursor-pointer hover:text-gray-600'
            )}
              onClick={() => index === 0 ? navigate('/') : undefined}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* System Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <Activity className="w-3 h-3 text-green-600" />
          <span className="text-xs font-medium text-green-700">System Nominal</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Bell className="w-4 h-4 text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800">NGO Operator</p>
            <p className="text-[10px] text-gray-400">Coimbatore</p>
          </div>
        </div>
      </div>
    </header>
  );
};
