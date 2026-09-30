import { RedistributionPlan, Donor, NGO, Vehicle, BeneficiaryArea } from '../types/plan';

const donors: Donor[] = [
  { id: 'd1', name: 'Restaurant A - Spice Garden', location: 'RS Puram, Coimbatore', avgFoodKg: 35, foodType: 'Prepared Meals', availabilityStart: '18:00', availabilityEnd: '20:00', expiryWindowHours: 2 },
  { id: 'd2', name: 'Restaurant B - The Grand Hotel', location: 'Race Course, Coimbatore', avgFoodKg: 45, foodType: 'Mixed Cuisine', availabilityStart: '19:00', availabilityEnd: '21:00', expiryWindowHours: 3 },
  { id: 'd3', name: 'Restaurant C - Annapoorna', location: 'Gandhipuram, Coimbatore', avgFoodKg: 28, foodType: 'Vegetarian Meals', availabilityStart: '17:30', availabilityEnd: '19:30', expiryWindowHours: 2 },
  { id: 'd4', name: 'Restaurant D - Sree Ananda Bhavan', location: 'Peelamedu, Coimbatore', avgFoodKg: 32, foodType: 'South Indian', availabilityStart: '18:30', availabilityEnd: '20:30', expiryWindowHours: 2.5 },
  { id: 'd5', name: 'Hotel E - Kovai Bites', location: 'Singanallur, Coimbatore', avgFoodKg: 40, foodType: 'Continental', availabilityStart: '19:00', availabilityEnd: '21:00', expiryWindowHours: 3 },
  { id: 'd6', name: 'Bakery F - Fresh Breads', location: 'Saibaba Colony, Coimbatore', avgFoodKg: 22, foodType: 'Bakery Items', availabilityStart: '20:00', availabilityEnd: '22:00', expiryWindowHours: 4 },
  { id: 'd7', name: 'Canteen G - PSG Arts College', location: 'Avinashi Road, Coimbatore', avgFoodKg: 50, foodType: 'Mixed Meals', availabilityStart: '17:00', availabilityEnd: '19:00', expiryWindowHours: 2 },
  { id: 'd8', name: 'Caterer H - Raji Catering', location: 'Ukkadam, Coimbatore', avgFoodKg: 30, foodType: 'South Indian', availabilityStart: '18:00', availabilityEnd: '20:30', expiryWindowHours: 2.5 },
];

const ngos: NGO[] = [
  { id: 'n1', name: 'GreenHope Food Bank', location: 'Gandhipuram', storageCapacityKg: 150, dailyDemandKg: 120, operatingHours: '16:00 - 22:00' },
  { id: 'n2', name: 'Coimbatore Hunger Relief', location: 'RS Puram', storageCapacityKg: 200, dailyDemandKg: 160, operatingHours: '17:00 - 22:00' },
  { id: 'n3', name: 'AnnaDanam Trust', location: 'Singanallur', storageCapacityKg: 120, dailyDemandKg: 95, operatingHours: '18:00 - 22:00' },
  { id: 'n4', name: 'Tamil Nadu Food Share', location: 'Peelamedu', storageCapacityKg: 180, dailyDemandKg: 140, operatingHours: '16:30 - 22:00' },
  { id: 'n5', name: 'Asha Community Kitchen', location: 'Ukkadam', storageCapacityKg: 100, dailyDemandKg: 80, operatingHours: '17:00 - 21:00' },
];

const vehicles: Vehicle[] = [
  { id: 'V1', capacity: 150, currentLocation: 'Gandhipuram Hub', avgSpeedKmh: 35, availability: 'Full Day', isBackup: false },
  { id: 'V2', capacity: 120, currentLocation: 'RS Puram Hub', avgSpeedKmh: 40, availability: 'Full Day', isBackup: false },
  { id: 'V3', capacity: 100, currentLocation: 'Peelamedu Hub', avgSpeedKmh: 38, availability: 'Full Day', isBackup: false },
  { id: 'V4', capacity: 80, currentLocation: 'Singanallur Hub', avgSpeedKmh: 42, availability: 'Emergency Only', isBackup: true },
];

const beneficiaryAreas: BeneficiaryArea[] = [
  { id: 'b1', name: 'Ukkadam Slums', populationServed: 1200, expectedDemandKg: 96, priority: 'critical' },
  { id: 'b2', name: 'Saibaba Colony Labour Colony', populationServed: 800, expectedDemandKg: 64, priority: 'high' },
  { id: 'b3', name: 'Ganapathy Migrant Settlement', populationServed: 950, expectedDemandKg: 76, priority: 'high' },
  { id: 'b4', name: 'Kuniyamuthur Village', populationServed: 600, expectedDemandKg: 48, priority: 'medium' },
  { id: 'b5', name: 'Selvapuram Industrial Area', populationServed: 500, expectedDemandKg: 40, priority: 'medium' },
  { id: 'b6', name: 'Rathinapuri Community Center', populationServed: 400, expectedDemandKg: 32, priority: 'low' },
];

export const mockPlans: RedistributionPlan[] = [
  {
    id: 'plan-001',
    name: 'City Evening Food Redistribution',
    description: 'Comprehensive evening redistribution from Coimbatore restaurants and hotels to NGOs across the city.',
    city: 'Coimbatore',
    operatingPeriod: 'Daily 17:00 - 22:00',
    donors: donors,
    ngos: ngos,
    vehicles: vehicles,
    beneficiaryAreas: beneficiaryAreas,
    expectedFoodKg: 500,
    expectedDemandKg: 420,
    riskScore: 78,
    status: 'stress_testing',
    createdAt: '2026-09-25T10:00:00Z',
    stressParameters: {
      demandVariation: 40,
      donationVariation: 30,
      trafficVariation: 50,
      vehicleFailureProbability: 25,
      ngoCapacityReduction: 35,
      expiryReduction: 40,
      numberOfScenarios: 1000,
    },
  },
  {
    id: 'plan-002',
    name: 'North Zone Breakfast Drive',
    description: 'Morning breakfast redistribution program for industrial workers and daily laborers.',
    city: 'Coimbatore North',
    operatingPeriod: 'Daily 06:00 - 09:00',
    donors: donors.slice(0, 4),
    ngos: ngos.slice(0, 3),
    vehicles: vehicles.slice(0, 3),
    beneficiaryAreas: beneficiaryAreas.slice(0, 4),
    expectedFoodKg: 320,
    expectedDemandKg: 280,
    riskScore: 45,
    status: 'active',
    createdAt: '2026-09-20T08:00:00Z',
  },
  {
    id: 'plan-003',
    name: 'Weekend Surplus Collection',
    description: 'Weekend-only plan targeting hotel surplus from banquets and events.',
    city: 'Coimbatore',
    operatingPeriod: 'Saturday & Sunday 20:00 - 23:00',
    donors: donors.slice(1, 5),
    ngos: ngos.slice(1, 4),
    vehicles: vehicles.slice(0, 2),
    beneficiaryAreas: beneficiaryAreas.slice(1, 4),
    expectedFoodKg: 280,
    expectedDemandKg: 240,
    riskScore: 38,
    status: 'completed',
    createdAt: '2026-09-15T12:00:00Z',
  },
];

export const activePlan = mockPlans[0];
