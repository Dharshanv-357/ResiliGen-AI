import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';
import { RedistributionPlan, Donor, NGO, Vehicle, BeneficiaryArea } from '../types/plan';

const defaultDonor: Omit<Donor, 'id'> = {
  name: '', location: '', avgFoodKg: 20, foodType: 'Prepared Meals',
  availabilityStart: '18:00', availabilityEnd: '20:00', expiryWindowHours: 2,
};
const defaultNGO: Omit<NGO, 'id'> = {
  name: '', location: '', storageCapacityKg: 100, dailyDemandKg: 80, operatingHours: '17:00 - 22:00',
};
const defaultVehicle: Omit<Vehicle, 'id'> & { id: string } = {
  id: '', capacity: 100, currentLocation: '', avgSpeedKmh: 40, availability: 'Full Day', isBackup: false,
};
const defaultArea: Omit<BeneficiaryArea, 'id'> = {
  name: '', populationServed: 500, expectedDemandKg: 40, priority: 'medium',
};

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}
const Section: React.FC<SectionProps> = ({ title, subtitle, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card padding="none" className="overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-50">{children}</div>}
    </Card>
  );
};

const SliderField: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}> = ({ label, value, onChange, min = 0, max = 100, suffix = '%' }) => (
  <div>
    <div className="flex justify-between mb-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <span className="text-sm font-bold text-indigo-600">{value}{suffix}</span>
    </div>
    <input
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
    <div className="flex justify-between mt-1">
      <span className="text-[10px] text-gray-400">{min}{suffix}</span>
      <span className="text-[10px] text-gray-400">{max}{suffix}</span>
    </div>
  </div>
);

export const CreatePlan: React.FC = () => {
  const navigate = useNavigate();
  const { addPlan, setActivePlan } = useAppStore();

  const [formData, setFormData] = useState({
    name: 'City Evening Food Redistribution',
    description: 'Comprehensive evening redistribution from restaurants and hotels to NGOs.',
    city: 'Coimbatore',
    operatingPeriod: 'Daily 17:00 - 22:00',
  });
  const [donors, setDonors] = useState<Donor[]>([
    { ...defaultDonor, id: 'd1', name: 'Restaurant A - Spice Garden', location: 'RS Puram', avgFoodKg: 35 },
    { ...defaultDonor, id: 'd2', name: 'Restaurant B - The Grand Hotel', location: 'Race Course', avgFoodKg: 45 },
  ]);
  const [ngos, setNGOs] = useState<NGO[]>([
    { ...defaultNGO, id: 'n1', name: 'GreenHope Food Bank', location: 'Gandhipuram', storageCapacityKg: 150, dailyDemandKg: 120 },
  ]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { ...defaultVehicle, id: 'V1', capacity: 150, currentLocation: 'Gandhipuram Hub' },
    { ...defaultVehicle, id: 'V2', capacity: 120, currentLocation: 'RS Puram Hub', isBackup: false },
  ]);
  const [areas, setAreas] = useState<BeneficiaryArea[]>([
    { ...defaultArea, id: 'b1', name: 'Ukkadam Slums', populationServed: 1200, expectedDemandKg: 96, priority: 'critical' },
  ]);
  const [stress, setStress] = useState({
    demandVariation: 40, donationVariation: 30, trafficVariation: 50,
    vehicleFailureProbability: 25, ngoCapacityReduction: 35, expiryReduction: 40,
    numberOfScenarios: 1000,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, item: T) =>
    setter(prev => [...prev, item]);
  const removeItem = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string) =>
    setter(prev => prev.filter(i => i.id !== id));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Plan name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (donors.length === 0) newErrors.donors = 'At least one donor is required';
    if (ngos.length === 0) newErrors.ngos = 'At least one NGO is required';
    if (vehicles.length === 0) newErrors.vehicles = 'At least one vehicle is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const plan: RedistributionPlan = {
      id: `plan-${Date.now()}`,
      ...formData,
      donors,
      ngos,
      vehicles,
      beneficiaryAreas: areas,
      expectedFoodKg: donors.reduce((s, d) => s + d.avgFoodKg, 0),
      expectedDemandKg: areas.reduce((s, a) => s + a.expectedDemandKg, 0),
      riskScore: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      stressParameters: stress,
    };
    addPlan(plan);
    setActivePlan(plan);
    navigate('/scenarios');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Redistribution Plan</h1>
        <p className="text-sm text-gray-500 mt-1">Define the operational conditions you want IdeaStress AI to test.</p>
      </div>

      {/* Section 1: Plan Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section title="Plan Information" subtitle="Basic details about the redistribution plan">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              { key: 'name', label: 'Plan Name', placeholder: 'e.g. City Evening Redistribution', error: errors.name },
              { key: 'city', label: 'City / Region', placeholder: 'e.g. Coimbatore', error: errors.city },
              { key: 'operatingPeriod', label: 'Operating Period', placeholder: 'e.g. Daily 17:00 - 22:00' },
            ].map((field) => (
              <div key={field.key} className={field.key === 'name' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{field.label}</label>
                <input
                  type="text"
                  value={(formData as Record<string, string>)[field.key]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${field.error ? 'border-red-300' : 'border-gray-200'}`}
                />
                {field.error && <p className="text-xs text-red-500 mt-1">{field.error}</p>}
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Section 2: Donors */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section title="Food Donors" subtitle={`${donors.length} donor${donors.length !== 1 ? 's' : ''} added`}>
          {errors.donors && <p className="text-xs text-red-500 mb-2 mt-3">{errors.donors}</p>}
          <div className="space-y-3 mt-3">
            {donors.map((donor, i) => (
              <div key={donor.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 relative">
                <button
                  onClick={() => removeItem(setDonors, donor.id)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="text-xs font-bold text-gray-500 mb-2">Donor #{i + 1}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'name', label: 'Name', span: 2 },
                    { key: 'location', label: 'Location' },
                    { key: 'foodType', label: 'Food Type' },
                    { key: 'availabilityStart', label: 'Start', type: 'time' },
                    { key: 'availabilityEnd', label: 'End', type: 'time' },
                  ].map(f => (
                    <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
                      <label className="block text-[10px] text-gray-500 mb-0.5">{f.label}</label>
                      <input
                        type={f.type || 'text'}
                        value={String((donor as unknown as Record<string, string | number>)[f.key] ?? '')}
                        onChange={(e) => setDonors(prev => prev.map((d, idx) => idx === i ? { ...d, [f.key]: e.target.value } : d))}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Food (kg)</label>
                    <input
                      type="number"
                      value={donor.avgFoodKg}
                      onChange={(e) => setDonors(prev => prev.map((d, idx) => idx === i ? { ...d, avgFoodKg: Number(e.target.value) } : d))}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addItem(setDonors, { ...defaultDonor, id: `d${Date.now()}` })}
            >
              <Plus className="w-3.5 h-3.5" /> Add Donor
            </Button>
          </div>
        </Section>
      </motion.div>

      {/* Section 3: NGOs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section title="NGOs / Food Banks" subtitle={`${ngos.length} organization${ngos.length !== 1 ? 's' : ''} added`}>
          {errors.ngos && <p className="text-xs text-red-500 mb-2 mt-3">{errors.ngos}</p>}
          <div className="space-y-3 mt-3">
            {ngos.map((ngo, i) => (
              <div key={ngo.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 relative">
                <button onClick={() => removeItem(setNGOs, ngo.id)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                <p className="text-xs font-bold text-gray-500 mb-2">NGO #{i + 1}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-gray-500 mb-0.5">Organization Name</label>
                    <input value={ngo.name} onChange={(e) => setNGOs(prev => prev.map((n, idx) => idx === i ? { ...n, name: e.target.value } : n))} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Location</label>
                    <input value={ngo.location} onChange={(e) => setNGOs(prev => prev.map((n, idx) => idx === i ? { ...n, location: e.target.value } : n))} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Capacity (kg)</label>
                    <input type="number" value={ngo.storageCapacityKg} onChange={(e) => setNGOs(prev => prev.map((n, idx) => idx === i ? { ...n, storageCapacityKg: Number(e.target.value) } : n))} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Daily Demand (kg)</label>
                    <input type="number" value={ngo.dailyDemandKg} onChange={(e) => setNGOs(prev => prev.map((n, idx) => idx === i ? { ...n, dailyDemandKg: Number(e.target.value) } : n))} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={() => addItem(setNGOs, { ...defaultNGO, id: `n${Date.now()}` })}>
              <Plus className="w-3.5 h-3.5" /> Add NGO
            </Button>
          </div>
        </Section>
      </motion.div>

      {/* Section 4: Vehicles */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Section title="Vehicles" subtitle={`${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} configured`}>
          {errors.vehicles && <p className="text-xs text-red-500 mb-2 mt-3">{errors.vehicles}</p>}
          <div className="space-y-3 mt-3">
            {vehicles.map((v, i) => (
              <div key={v.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 relative">
                <button onClick={() => removeItem(setVehicles, v.id)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Vehicle ID</label>
                    <input value={v.id} onChange={(e) => setVehicles(prev => prev.map((veh, idx) => idx === i ? { ...veh, id: e.target.value } : veh))} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Capacity (kg)</label>
                    <input type="number" value={v.capacity} onChange={(e) => setVehicles(prev => prev.map((veh, idx) => idx === i ? { ...veh, capacity: Number(e.target.value) } : veh))} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Current Location</label>
                    <input value={v.currentLocation} onChange={(e) => setVehicles(prev => prev.map((veh, idx) => idx === i ? { ...veh, currentLocation: e.target.value } : veh))} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                  </div>
                  <div className="flex items-center gap-2 col-span-2 sm:col-span-3 mt-1">
                    <input
                      type="checkbox"
                      id={`backup-${v.id}`}
                      checked={v.isBackup}
                      onChange={(e) => setVehicles(prev => prev.map((veh, idx) => idx === i ? { ...veh, isBackup: e.target.checked } : veh))}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`backup-${v.id}`} className="text-xs text-gray-600">Backup Vehicle (Emergency Only)</label>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={() => addItem(setVehicles, { ...defaultVehicle, id: `V${Date.now()}` })}>
              <Plus className="w-3.5 h-3.5" /> Add Vehicle
            </Button>
          </div>
        </Section>
      </motion.div>

      {/* Section 5: Stress Parameters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Section title="Stress Parameters" subtitle="Configure how aggressively to stress-test this plan">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
            <SliderField label="Demand Variation" value={stress.demandVariation} onChange={(v) => setStress(p => ({ ...p, demandVariation: v }))} />
            <SliderField label="Donation Variation" value={stress.donationVariation} onChange={(v) => setStress(p => ({ ...p, donationVariation: v }))} />
            <SliderField label="Traffic Variation" value={stress.trafficVariation} onChange={(v) => setStress(p => ({ ...p, trafficVariation: v }))} />
            <SliderField label="Vehicle Failure Probability" value={stress.vehicleFailureProbability} onChange={(v) => setStress(p => ({ ...p, vehicleFailureProbability: v }))} />
            <SliderField label="NGO Capacity Reduction" value={stress.ngoCapacityReduction} onChange={(v) => setStress(p => ({ ...p, ngoCapacityReduction: v }))} />
            <SliderField label="Expiry Window Reduction" value={stress.expiryReduction} onChange={(v) => setStress(p => ({ ...p, expiryReduction: v }))} />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2">Number of Scenarios</label>
            <div className="flex gap-2 flex-wrap">
              {[100, 500, 1000, 5000].map((n) => (
                <button
                  key={n}
                  onClick={() => setStress(p => ({ ...p, numberOfScenarios: n }))}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                    stress.numberOfScenarios === n
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {n.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-2 pb-6">
        <Button variant="secondary" onClick={() => navigate('/plans')}>
          Cancel
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleCreate}>
            Save as Draft
          </Button>
          <Button onClick={() => { handleCreate(); }}>
            Generate Stress Scenarios <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
