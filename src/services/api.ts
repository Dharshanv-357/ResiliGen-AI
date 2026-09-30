/**
 * API Service Layer — Backend-Ready Interface
 *
 * This file contains mock service functions that match the FastAPI backend contract.
 * Replace the mock implementations with real API calls when the backend is ready.
 *
 * Suggested FastAPI endpoints:
 * POST /api/plans
 * GET  /api/plans
 * POST /api/scenarios/generate
 * GET  /api/scenarios
 * POST /api/simulation/run
 * GET  /api/simulation/:id
 * POST /api/agents/analyze
 * POST /api/recommendations/generate
 * POST /api/plans/:id/retest
 * GET  /api/history
 */

import { RedistributionPlan, StressParameters } from '../types/plan';
import { Scenario } from '../types/scenario';
import { SimulationResult } from '../types/simulation';
import { Agent, Recommendation } from '../types/agent';
import { mockScenarios } from '../data/mockScenarios';
import { mockAgents, mockRecommendations } from '../data/mockAgents';
import { originalSimulationResult, improvedSimulationResult } from '../data/mockSimulation';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper to simulate async API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// PLAN SERVICES
// ============================================================

export async function createPlan(plan: Omit<RedistributionPlan, 'id' | 'riskScore'>): Promise<RedistributionPlan> {
  await delay(500);
  // TODO: Replace with: return fetch(`${API_BASE_URL}/api/plans`, { method: 'POST', body: JSON.stringify(plan) }).then(r => r.json());
  return { ...plan, id: `plan-${Date.now()}`, riskScore: 0 } as RedistributionPlan;
}

export async function getPlans(): Promise<RedistributionPlan[]> {
  await delay(300);
  // TODO: Replace with: return fetch(`${API_BASE_URL}/api/plans`).then(r => r.json());
  const { mockPlans } = await import('../data/mockPlans');
  return mockPlans;
}

// ============================================================
// SCENARIO SERVICES
// ============================================================

export async function generateScenarios(
  plan: RedistributionPlan,
  parameters: StressParameters,
  onProgress?: (progress: number, phase: string) => void
): Promise<Scenario[]> {
  // TODO: Replace with SSE or WebSocket call to: POST /api/scenarios/generate
  const phases = [
    'Initializing Conditional GAN...',
    'Generating donor variations...',
    'Generating demand fluctuations...',
    'Generating traffic conditions...',
    'Generating vehicle failures...',
    'Generating capacity constraints...',
    'Generating compound failures...',
    'Validating scenarios...',
  ];

  for (let i = 0; i <= 100; i += 5) {
    await delay(150);
    const phaseIndex = Math.floor((i / 100) * phases.length);
    onProgress?.(i, phases[Math.min(phaseIndex, phases.length - 1)]);
  }

  return mockScenarios;
}

export async function getScenarios(planId: string): Promise<Scenario[]> {
  await delay(200);
  // TODO: Replace with: return fetch(`${API_BASE_URL}/api/scenarios?planId=${planId}`).then(r => r.json());
  return mockScenarios.filter(s => s.planId === planId);
}

// ============================================================
// SIMULATION SERVICES
// ============================================================

export async function runSimulation(
  plan: RedistributionPlan,
  scenario: Scenario,
  isImproved = false,
  onProgress?: (progress: number) => void
): Promise<SimulationResult> {
  // TODO: Replace with: return fetch(`${API_BASE_URL}/api/simulation/run`, { method: 'POST', ... }).then(r => r.json());
  for (let i = 0; i <= 100; i += 3) {
    await delay(150);
    onProgress?.(i);
  }
  return isImproved ? improvedSimulationResult : originalSimulationResult;
}

export async function getSimulationResult(simulationId: string): Promise<SimulationResult> {
  await delay(200);
  // TODO: Replace with: return fetch(`${API_BASE_URL}/api/simulation/${simulationId}`).then(r => r.json());
  return originalSimulationResult;
}

// ============================================================
// AGENT SERVICES
// ============================================================

export async function runAgentAnalysis(
  scenario: Scenario,
  simulationResult: SimulationResult,
  onAgentUpdate?: (agentId: string, status: Agent['status']) => void
): Promise<Agent[]> {
  // TODO: Replace with: SSE stream from POST /api/agents/analyze
  const agents = [...mockAgents];

  for (const agent of agents) {
    onAgentUpdate?.(agent.id, 'thinking');
    await delay(500);
    onAgentUpdate?.(agent.id, 'analyzing');
    await delay(1500 + Math.random() * 1000);
    onAgentUpdate?.(agent.id, 'completed');
  }

  return agents.map(a => ({ ...a, status: 'completed' as const }));
}

// ============================================================
// RECOMMENDATION SERVICES
// ============================================================

export async function generateRecommendations(
  agents: Agent[],
  simulationResult: SimulationResult
): Promise<Recommendation[]> {
  await delay(1000);
  // TODO: Replace with: return fetch(`${API_BASE_URL}/api/recommendations/generate`, { method: 'POST', ... }).then(r => r.json());
  return mockRecommendations;
}

// ============================================================
// RETEST SERVICES
// ============================================================

export async function retestPlan(
  planId: string,
  appliedRecommendations: Recommendation[],
  onProgress?: (progress: number) => void
): Promise<SimulationResult> {
  // TODO: Replace with: return fetch(`${API_BASE_URL}/api/plans/${planId}/retest`, { method: 'POST', ... }).then(r => r.json());
  for (let i = 0; i <= 100; i += 4) {
    await delay(120);
    onProgress?.(i);
  }
  return improvedSimulationResult;
}
