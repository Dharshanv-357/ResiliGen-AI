import { create } from 'zustand';
import { RedistributionPlan } from '../types/plan';
import { Scenario } from '../types/scenario';
import { SimulationResult, SimulationEvent, SimulationStatus } from '../types/simulation';
import { Agent, Recommendation } from '../types/agent';
import { mockPlans } from '../data/mockPlans';
import { mockScenarios } from '../data/mockScenarios';
import { mockAgents, mockRecommendations } from '../data/mockAgents';
import { originalSimulationResult, improvedSimulationResult, mockSimulationEvents } from '../data/mockSimulation';

interface AppState {
  // Plans
  plans: RedistributionPlan[];
  activePlan: RedistributionPlan | null;
  setActivePlan: (plan: RedistributionPlan) => void;
  addPlan: (plan: RedistributionPlan) => void;

  // Scenarios
  scenarios: Scenario[];
  selectedScenario: Scenario | null;
  scenariosGenerated: boolean;
  isGeneratingScenarios: boolean;
  generationProgress: number;
  generationPhase: string;
  setSelectedScenario: (scenario: Scenario | null) => void;
  startGeneratingScenarios: () => void;
  setScenarios: (scenarios: Scenario[]) => void;

  // Simulation
  simulationStatus: SimulationStatus;
  simulationProgress: number;
  simulationEvents: SimulationEvent[];
  currentSimulationResult: SimulationResult | null;
  improvedResult: SimulationResult | null;
  isImprovedRun: boolean;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  addSimulationEvent: (event: SimulationEvent) => void;
  setSimulationProgress: (progress: number) => void;

  // Agents
  agents: Agent[];
  isAnalyzing: boolean;
  analysisComplete: boolean;
  startAgentAnalysis: () => void;
  updateAgentStatus: (agentId: string, status: Agent['status']) => void;

  // Recommendations
  recommendations: Recommendation[];
  appliedRecommendations: string[];
  applyRecommendation: (id: string) => void;
  rejectRecommendation: (id: string) => void;

  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Plans
  plans: mockPlans,
  activePlan: mockPlans[0],
  setActivePlan: (plan) => set({ activePlan: plan }),
  addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),

  // Scenarios
  scenarios: mockScenarios,
  selectedScenario: null,
  scenariosGenerated: true,
  isGeneratingScenarios: false,
  generationProgress: 100,
  generationPhase: 'Complete',
  setSelectedScenario: (scenario) => set({ selectedScenario: scenario }),
  startGeneratingScenarios: () => {
    set({ isGeneratingScenarios: true, generationProgress: 0, scenariosGenerated: false });
    const phases = [
      'Initializing Conditional GAN...',
      'Generating donor variations...',
      'Generating demand fluctuations...',
      'Generating traffic conditions...',
      'Generating vehicle failures...',
      'Generating capacity constraints...',
      'Generating compound failures...',
      'Validating scenarios...',
      'Complete',
    ];
    let phaseIndex = 0;
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 4 + 1;
      if (progress > 100) progress = 100;
      phaseIndex = Math.floor((progress / 100) * (phases.length - 1));
      set({
        generationProgress: Math.round(progress),
        generationPhase: phases[phaseIndex],
      });
      if (progress >= 100) {
        clearInterval(interval);
        set({
          isGeneratingScenarios: false,
          scenariosGenerated: true,
          generationPhase: 'Complete',
          scenarios: mockScenarios,
        });
      }
    }, 150);
  },
  setScenarios: (scenarios) => set({ scenarios }),

  // Simulation
  simulationStatus: 'idle',
  simulationProgress: 0,
  simulationEvents: [],
  currentSimulationResult: null,
  improvedResult: null,
  isImprovedRun: false,
  startSimulation: () => {
    const { isImprovedRun } = get();
    set({
      simulationStatus: 'running',
      simulationProgress: 0,
      simulationEvents: [],
      currentSimulationResult: null,
    });

    const events = mockSimulationEvents;
    let eventIndex = 0;
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 3 + 1;
      if (progress > 100) progress = 100;
      set({ simulationProgress: Math.round(progress) });

      if (eventIndex < events.length) {
        const eventsToAdd = events.slice(0, Math.ceil((progress / 100) * events.length));
        set({ simulationEvents: eventsToAdd });
        eventIndex = eventsToAdd.length;
      }

      if (progress >= 100) {
        clearInterval(interval);
        const result = isImprovedRun ? improvedSimulationResult : originalSimulationResult;
        set({
          simulationStatus: 'completed',
          currentSimulationResult: result,
          simulationEvents: events,
          improvedResult: isImprovedRun ? improvedSimulationResult : get().improvedResult,
        });
      }
    }, 200);
  },
  pauseSimulation: () => set({ simulationStatus: 'paused' }),
  resetSimulation: () => set({
    simulationStatus: 'idle',
    simulationProgress: 0,
    simulationEvents: [],
    currentSimulationResult: null,
  }),
  addSimulationEvent: (event) => set((state) => ({
    simulationEvents: [...state.simulationEvents, event],
  })),
  setSimulationProgress: (progress) => set({ simulationProgress: progress }),

  // Agents
  agents: mockAgents,
  isAnalyzing: false,
  analysisComplete: false,
  startAgentAnalysis: () => {
    set({ isAnalyzing: true, analysisComplete: false });
    const agentIds = mockAgents.map(a => a.id);
    
    // Reset all to thinking
    set({ agents: mockAgents.map(a => ({ ...a, status: 'thinking' as const })) });

    agentIds.forEach((id, index) => {
      setTimeout(() => {
        set((state) => ({
          agents: state.agents.map(a =>
            a.id === id ? { ...a, status: 'analyzing' as const } : a
          ),
        }));
      }, index * 800 + 500);

      setTimeout(() => {
        set((state) => ({
          agents: state.agents.map(a =>
            a.id === id ? { ...a, status: 'completed' as const } : a
          ),
        }));
        if (index === agentIds.length - 1) {
          set({ isAnalyzing: false, analysisComplete: true });
        }
      }, index * 800 + 2000);
    });
  },
  updateAgentStatus: (agentId, status) => set((state) => ({
    agents: state.agents.map(a => a.id === agentId ? { ...a, status } : a),
  })),

  // Recommendations
  recommendations: mockRecommendations,
  appliedRecommendations: [],
  applyRecommendation: (id) => {
    set((state) => ({
      appliedRecommendations: [...state.appliedRecommendations, id],
      recommendations: state.recommendations.map(r =>
        r.id === id ? { ...r, status: 'applied' as const } : r
      ),
      isImprovedRun: true,
    }));
  },
  rejectRecommendation: (id) => set((state) => ({
    recommendations: state.recommendations.map(r =>
      r.id === id ? { ...r, status: 'rejected' as const } : r
    ),
  })),

  // Navigation
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
