export type AgentStatus = 'idle' | 'thinking' | 'analyzing' | 'completed' | 'failed';
export type AgentRole = 'resource' | 'logistics' | 'demand' | 'capacity' | 'devils_advocate';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  icon: string;
  description: string;
  status: AgentStatus;
  finding?: string;
  confidence?: number;
  analysisTime?: number;
  isDistinct?: boolean;
}

export interface AgentAnalysis {
  planId: string;
  scenarioId: string;
  agents: Agent[];
  overallFinding: string;
  criticalFailureCondition?: string;
  completedAt?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  expectedRiskReduction: number;
  category: 'vehicle' | 'routing' | 'storage' | 'scheduling' | 'demand';
  status: 'pending' | 'applied' | 'rejected';
  agentId?: string;
}
