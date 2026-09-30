import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb, Check, X, ChevronRight, TrendingDown,
  Truck, MapPin, Clock, BarChart2, Users
} from 'lucide-react';
import { Card, Button } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';
import { getImpactColor } from '../utils/formatters';

const categoryIcons: Record<string, React.ReactNode> = {
  vehicle: <Truck className="w-4 h-4" />,
  routing: <MapPin className="w-4 h-4" />,
  scheduling: <Clock className="w-4 h-4" />,
  storage: <BarChart2 className="w-4 h-4" />,
  demand: <Users className="w-4 h-4" />,
};

export const Recommendations: React.FC = () => {
  const navigate = useNavigate();
  const { recommendations, applyRecommendation, rejectRecommendation, appliedRecommendations } = useAppStore();

  const appliedCount = recommendations.filter(r => r.status === 'applied').length;
  const totalRiskReduction = recommendations
    .filter(r => r.status === 'applied')
    .reduce((s, r) => s + r.expectedRiskReduction, 0);

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Plan Improvement</h1>
        <p className="text-sm text-gray-500 mt-1">AI-generated modifications designed to improve resilience.</p>
      </div>

      {/* Summary Banner */}
      {appliedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-4"
        >
          <TrendingDown className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-800">
              {appliedCount} recommendation{appliedCount > 1 ? 's' : ''} applied
            </p>
            <p className="text-xs text-green-600">
              Expected risk reduction: -{totalRiskReduction} points (78 → {78 - totalRiskReduction})
            </p>
          </div>
          <Button
            className="ml-auto"
            variant="success"
            size="sm"
            onClick={() => navigate('/simulator')}
          >
            Re-Run Simulation <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </motion.div>
      )}

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const isApplied = rec.status === 'applied';
          const isRejected = rec.status === 'rejected';

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
            >
              <Card
                className={`transition-all duration-300 ${
                  isApplied ? 'border-green-300 bg-green-50/50' :
                  isRejected ? 'opacity-50 border-gray-200' :
                  'border-gray-100 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Number */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                    isApplied ? 'bg-green-500 text-white' :
                    isRejected ? 'bg-gray-300 text-gray-500' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {isApplied ? <Check className="w-4 h-4" /> : index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {/* Category Icon */}
                          <span className="text-indigo-500">{categoryIcons[rec.category]}</span>
                          <h3 className="text-sm font-bold text-gray-900">{rec.title}</h3>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{rec.description}</p>
                      </div>

                      {/* Impact and Actions */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getImpactColor(rec.impact)}`}>
                            {rec.impact} impact
                          </span>
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">
                            <TrendingDown className="w-3 h-3 text-indigo-500" />
                            <span className="text-[10px] font-bold text-indigo-700">
                              -{rec.expectedRiskReduction} risk pts
                            </span>
                          </div>
                        </div>

                        {!isApplied && !isRejected && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => applyRecommendation(rec.id)}
                            >
                              <Check className="w-3.5 h-3.5" /> Apply
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => rejectRecommendation(rec.id)}
                              className="text-red-500 hover:bg-red-50"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}

                        {isApplied && (
                          <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Applied to Plan
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between pt-2"
      >
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-indigo-600">{recommendations.filter(r => r.status === 'applied').length}</span> of{' '}
          {recommendations.length} recommendations applied
        </p>
        <Button onClick={() => navigate('/simulator')} disabled={appliedCount === 0}>
          Re-Run Simulation <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};
