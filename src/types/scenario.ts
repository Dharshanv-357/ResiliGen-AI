export interface Scenario {
  id: string;
  planId: string;
  demandVariation: number;
  donationVariation: number;
  trafficVariation: number;
  availableVehicles: number;
  totalVehicles: number;
  expiryReduction: number;
  ngoCapacityReduction: number;
  riskScore: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  generatedAt: string;
}

export interface ScenarioDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface GenerationProgress {
  total: number;
  current: number;
  phase: string;
  isComplete: boolean;
}

export interface FailureNode {
  id: string;
  label: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface FailureChain {
  nodes: FailureNode[];
}
