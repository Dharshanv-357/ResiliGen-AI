export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type PlanStatus = 'draft' | 'active' | 'stress_testing' | 'completed' | 'archived';

export interface Donor {
  id: string;
  name: string;
  location: string;
  avgFoodKg: number;
  foodType: string;
  availabilityStart: string;
  availabilityEnd: string;
  expiryWindowHours: number;
}

export interface NGO {
  id: string;
  name: string;
  location: string;
  storageCapacityKg: number;
  dailyDemandKg: number;
  operatingHours: string;
}

export interface Vehicle {
  id: string;
  capacity: number;
  currentLocation: string;
  avgSpeedKmh: number;
  availability: string;
  isBackup: boolean;
}

export interface BeneficiaryArea {
  id: string;
  name: string;
  populationServed: number;
  expectedDemandKg: number;
  priority: PriorityLevel;
}

export interface StressParameters {
  demandVariation: number;
  donationVariation: number;
  trafficVariation: number;
  vehicleFailureProbability: number;
  ngoCapacityReduction: number;
  expiryReduction: number;
  numberOfScenarios: number;
}

export interface RedistributionPlan {
  id: string;
  name: string;
  description: string;
  city: string;
  operatingPeriod: string;
  donors: Donor[];
  ngos: NGO[];
  vehicles: Vehicle[];
  beneficiaryAreas: BeneficiaryArea[];
  expectedFoodKg: number;
  expectedDemandKg: number;
  riskScore: number;
  status: PlanStatus;
  createdAt: string;
  stressParameters?: StressParameters;
}
