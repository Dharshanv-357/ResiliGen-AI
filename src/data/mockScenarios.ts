import { Scenario, ScenarioDistribution } from '../types/scenario';

function generateScenario(index: number): Scenario {
  const rng = (seed: number) => {
    const x = Math.sin(seed + index * 17.5) * 10000;
    return x - Math.floor(x);
  };

  const demandVariation = Math.round((rng(1) * 60 - 10) * 10) / 10;
  const donationVariation = Math.round((rng(2) * 50 - 20) * 10) / 10;
  const trafficVariation = Math.round(rng(3) * 70 * 10) / 10;
  const availableVehicles = Math.floor(rng(4) * 2) + 2;
  const expiryReduction = Math.round(rng(5) * 60 * 10) / 10;
  const ngoCapacityReduction = Math.round(rng(6) * 50 * 10) / 10;

  const riskScore = Math.round(
    Math.max(5, Math.min(100,
      (demandVariation > 0 ? demandVariation * 0.5 : 0) +
      (donationVariation < 0 ? Math.abs(donationVariation) * 0.6 : 0) +
      (trafficVariation * 0.3) +
      ((4 - availableVehicles) * 15) +
      (expiryReduction * 0.4) +
      (ngoCapacityReduction * 0.3) +
      10
    ))
  );

  let status: 'low' | 'medium' | 'high' | 'critical';
  if (riskScore < 30) status = 'low';
  else if (riskScore < 55) status = 'medium';
  else if (riskScore < 75) status = 'high';
  else status = 'critical';

  const id = String(index + 1).padStart(4, '0');
  return {
    id: `SCN-${id}`,
    planId: 'plan-001',
    demandVariation,
    donationVariation,
    trafficVariation,
    availableVehicles,
    totalVehicles: 4,
    expiryReduction,
    ngoCapacityReduction,
    riskScore,
    status,
    generatedAt: new Date(Date.now() - (1000 - index) * 60000).toISOString(),
  };
}

export const mockScenarios: Scenario[] = Array.from({ length: 1000 }, (_, i) => generateScenario(i));

export const mockScenarioDistribution: ScenarioDistribution = {
  low: mockScenarios.filter(s => s.status === 'low').length,
  medium: mockScenarios.filter(s => s.status === 'medium').length,
  high: mockScenarios.filter(s => s.status === 'high').length,
  critical: mockScenarios.filter(s => s.status === 'critical').length,
};

// A specific critical scenario for demo
export const criticalScenario = mockScenarios.find(s => s.status === 'critical') || {
  id: 'SCN-0381',
  planId: 'plan-001',
  demandVariation: 37,
  donationVariation: -18,
  trafficVariation: 45,
  availableVehicles: 3,
  totalVehicles: 4,
  expiryReduction: 30,
  ngoCapacityReduction: 20,
  riskScore: 78,
  status: 'critical' as const,
  generatedAt: new Date().toISOString(),
};
