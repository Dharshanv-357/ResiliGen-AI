export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

export interface SimulationResult {
  id: string;
  planId: string;
  scenarioId: string;
  foodCollectedKg: number;
  foodDeliveredKg: number;
  foodWastedKg: number;
  unmetDemandKg: number;
  averageDeliveryTimeMin: number;
  vehicleUtilization: number;
  ngoCapacityUtilization: number;
  expiryViolations: number;
  riskScore: number;
  successRate: number;
  timestamp: string;
  isImproved?: boolean;
}

export interface SimulationEvent {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  component?: string;
}

export interface VehicleRoute {
  vehicleId: string;
  from: string;
  to: string;
  status: 'active' | 'delayed' | 'failed' | 'completed';
  progress: number;
}

export interface SimulationState {
  status: SimulationStatus;
  progress: number;
  currentTime: string;
  events: SimulationEvent[];
  metrics: Partial<SimulationResult>;
  routes: VehicleRoute[];
}

export interface ComparisonResult {
  original: SimulationResult;
  improved: SimulationResult;
  riskReduction: number;
  riskReductionPercent: number;
  foodWasteReduction: number;
  unmetDemandReduction: number;
}

export interface HistoryEntry {
  id: string;
  planName: string;
  date: string;
  scenarioCount: number;
  originalRisk: number;
  finalRisk: number;
  improvementPercent: number;
  status: 'completed' | 'in_progress' | 'failed';
}
