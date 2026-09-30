import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Plans } from './pages/Plans';
import { CreatePlan } from './pages/CreatePlan';
import { Scenarios } from './pages/Scenarios';
import { Simulator } from './pages/Simulator';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { Agents } from './pages/Agents';
import { Recommendations } from './pages/Recommendations';
import { Comparison } from './pages/Comparison';
import { History } from './pages/History';
import { Models } from './pages/Models';
import { Dataset } from './pages/Dataset';
import { FoodCondition } from './pages/FoodCondition';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/create" element={<CreatePlan />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/risk" element={<RiskAnalysis />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/history" element={<History />} />
          <Route path="/models" element={<Models />} />
          <Route path="/food-condition" element={<FoodCondition />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
