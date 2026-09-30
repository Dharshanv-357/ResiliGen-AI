# IdeaStress AI

**Generative Stress Testing of Community Food Redistribution Systems**

> *"Instead of asking AI whether a plan is good — IdeaStress AI tries to **BREAK** the plan."*

---

## What is IdeaStress AI?

IdeaStress AI is an AI-powered operational decision-support system that helps **NGOs, food banks, and community food redistribution operators** stress-test their redistribution plans against synthetically generated real-world failure scenarios.

Instead of validating a plan on paper, the system generates hundreds of stressful conditions — vehicle breakdowns, demand spikes, food expiry, traffic delays, NGO capacity overloads — simulates the plan under each condition, detects failures, and uses multi-agent AI analysis to recommend specific improvements.

The improved plan is then re-simulated and compared against the original to measure **resilience gain**.

---

## The Workflow

```
Community Food Redistribution Plan
            ↓
    Scenario Generation          ← Conditional GAN generates 1,000+ synthetic stress scenarios
            ↓
    Stress Simulation            ← Python engine simulates plan under each scenario
            ↓
    Failure Detection            ← Autoencoder flags anomalous failure patterns
            ↓
    Risk Analysis                ← Risk scored 0–100, factor breakdown computed
            ↓
    Multi-Agent LLM Analysis     ← 5 specialized agents evaluate the scenario
            ↓
    Improvement Recommendations  ← AI suggests specific, ranked modifications
            ↓
    Re-Simulation                ← Improved plan re-tested under same scenarios
            ↓
    Before vs After Comparison   ← Resilience improvement measured and reported
```

---

## Demo: End-to-End Flow

| Step | Action | Result |
|------|--------|--------|
| 1 | Open Dashboard | See live plan summary, workflow pipeline, quick actions |
| 2 | Create Plan: *City Evening Food Redistribution* | 20 donors, 5 NGOs, 4 vehicles, 500 kg/day |
| 3 | Configure stress parameters | Demand ±40%, Vehicle failure 25%, Traffic ±50% |
| 4 | Generate Scenarios | 1,000 synthetic scenarios via Conditional GAN |
| 5 | View scenario distribution | 420 Low / 310 Medium / 190 High / 80 Critical |
| 6 | Select critical scenario SCN-0381 | Demand +37%, V2 breakdown, Traffic +45% |
| 7 | Run Stress Simulation | Food wasted: 124 kg · Unmet demand: 134 kg · Risk: **78/100** |
| 8 | Run Multi-Agent Analysis | Resource, Logistics, Demand, Capacity, Devil's Advocate |
| 9 | Apply recommendations | Reserve V4 as backup · Prioritize expiry · Redirect routes |
| 10 | Re-run simulation | Food wasted: 48 kg · Unmet demand: 39 kg · Risk: **31/100** |
| 11 | View comparison | **Risk reduced by 60.3%** · Success rate: 68% → 91% |

---

## GenAI Architecture

| Component | Technology | Role |
|-----------|-----------|------|
| **Conditional GAN** | PyTorch / TensorFlow | Generates synthetic redistribution scenarios conditioned on stress labels |
| **DCGAN** | PyTorch (DCGAN) | Generates synthetic visual food decay frames conditioned on transit delay & temp spikes |
| **Autoencoder (VAE)** | PyTorch | Detects anomalous failure patterns in simulation results |
| **Multi-Agent LLM** | LLM API (GPT-4 class) | 5 specialized agents analyze scenarios from different operational lenses |
| **Stress Simulator** | Python engine | Deterministic simulation of redistribution plans under generated conditions |
| **Risk Scorer** | Rule-based + ML | Computes 0–100 risk score with factor contribution breakdown |
| **Recommendation Engine** | LLM | Generates ranked, actionable plan modifications |

---

## Application Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Overview, workflow pipeline, active plan summary |
| Mission Plans | `/plans` | View and manage all redistribution plans |
| Create Plan | `/plans/create` | Multi-section form: donors, NGOs, vehicles, stress params |
| Scenario Generator | `/scenarios` | Generate and browse 1,000+ synthetic scenarios |
| Stress Simulator | `/simulator` | Animated simulation with live metrics and event stream |
| Risk Analysis | `/risk` | Risk gauge, factor breakdown, key findings |
| AI Agents | `/agents` | Multi-agent analysis with real-time status |
| Recommendations | `/recommendations` | Apply/reject AI-generated plan improvements |
| Before vs After | `/comparison` | Side-by-side resilience comparison |
| Simulation History | `/history` | Log of all past stress tests |
| DCGAN Food Quality | `/food-condition` | Synthetic visual food condition inspection & decay analysis |
| Model Status | `/models` | GenAI pipeline visualization, model health |
| Dataset | `/dataset` | Dataset statistics and feature list |
| Settings | `/settings` | Risk thresholds, model config, notifications |

---

## Tech Stack

### Frontend (this repo)

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.6 | Type safety |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 11 | Animations and transitions |
| Recharts | 2 | Charts (risk gauge, comparison, distribution) |
| Lucide React | 0.46 | Icon set |
| Zustand | 5 | Global state management |
| React Router | 6 | Client-side routing |
| Radix UI | — | Accessible headless components |
| Vite | 5 | Build tool and dev server |

### Backend (planned — FastAPI)

| Technology | Purpose |
|-----------|---------|
| Python + FastAPI | REST API server |
| PyTorch | GAN + Autoencoder training and inference |
| LLM API | Multi-agent analysis |
| PostgreSQL | Plan and simulation storage |
| Redis | Job queue for long-running simulations |

---

## Project Structure

```
src/
├── types/                  TypeScript interfaces
│   ├── plan.ts             RedistributionPlan, Donor, NGO, Vehicle, BeneficiaryArea
│   ├── scenario.ts         Scenario, GenerationProgress, FailureChain
│   ├── simulation.ts       SimulationResult, SimulationEvent, HistoryEntry
│   └── agent.ts            Agent, AgentAnalysis, Recommendation
│
├── data/                   Mock data (replace with API calls)
│   ├── mockPlans.ts        Sample redistribution plans
│   ├── mockScenarios.ts    1,000 programmatically generated scenarios
│   ├── mockAgents.ts       Agent definitions and findings
│   └── mockSimulation.ts   Simulation results, events, history
│
├── store/
│   └── useAppStore.ts      Zustand global state store
│
├── services/
│   └── api.ts              Backend-ready API service layer
│
├── utils/
│   └── formatters.ts       Risk colors, labels, formatters
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx   Root layout wrapper
│   │   ├── Sidebar.tsx     Collapsible navigation sidebar
│   │   └── TopNav.tsx      Top bar with breadcrumbs and user
│   └── ui/
│       ├── Card.tsx        Card, MetricCard, Button, StatusBadge, ProgressBar
│       └── AnimatedCounter.tsx  Counting animation component
│
└── pages/
    ├── Dashboard.tsx
    ├── Plans.tsx
    ├── CreatePlan.tsx
    ├── Scenarios.tsx
    ├── Simulator.tsx
    ├── RiskAnalysis.tsx
    ├── Agents.tsx
    ├── Recommendations.tsx
    ├── Comparison.tsx
    ├── History.tsx
    ├── Models.tsx
    ├── Dataset.tsx
    └── Settings.tsx
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and run

```bash
# Clone the repository
git clone https://github.com/Dharshanv-357/ResiliGen-AI.git
cd ResiliGen-AI

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for production

```bash
npm run build
```

---

## Backend API Contract

The frontend is fully backend-ready. The service layer in `src/services/api.ts` defines mock functions that match the planned FastAPI endpoints. To connect a real backend, replace the mock implementations with `fetch()` calls.

```
POST   /api/plans                     Create a new redistribution plan
GET    /api/plans                     List all plans
POST   /api/scenarios/generate        Generate synthetic scenarios (streaming)
GET    /api/scenarios?planId=         Get scenarios for a plan
POST   /api/simulation/run            Run stress simulation
GET    /api/simulation/:id            Get simulation result
POST   /api/agents/analyze            Run multi-agent analysis (streaming)
POST   /api/recommendations/generate  Generate improvement recommendations
POST   /api/plans/:id/retest          Re-simulate with improved plan
GET    /api/history                   Get simulation history
```

---

## Stress Scenarios Explained

Each generated scenario varies the following parameters independently:

| Parameter | Description | Example |
|-----------|-------------|---------|
| Demand Variation | % increase or decrease in beneficiary demand | +37% |
| Donation Variation | % change in food available from donors | -18% |
| Traffic Variation | % increase in delivery time due to traffic | +45% |
| Vehicle Availability | Number of vehicles operational | 3 of 4 |
| NGO Capacity Reduction | % reduction in storage capacity | -20% |
| Expiry Window Reduction | Reduction in food expiry time | -30 min |

Scenarios are classified: **Low (< 30)** · **Medium (30–54)** · **High (55–74)** · **Critical (≥ 75)**

---

## AI Agents

Five specialized agents analyze each critical scenario:

| Agent | Role |
|-------|------|
| **Resource Agent** | Checks food supply sufficiency and donor reliability |
| **Logistics Agent** | Evaluates vehicles, routes, and delivery time constraints |
| **Demand Agent** | Evaluates beneficiary demand variation across zones |
| **Capacity Agent** | Evaluates NGO storage limits and overflow risk |
| **Devil's Advocate** | Actively searches for the worst-case condition that breaks the plan |

---

## DCGAN Food Quality & Spoilage Module

IdeaStress AI includes a **Deep Convolutional GAN (DCGAN)** module dedicated to food freshness assessment under severe operational stress:

- **Motivation**: While tabular data predicts transit delays and temperature exposure, logistics teams need visual confirmation of food degradation to make go/no-go distribution decisions.
- **Generator**: Transposed convolution architecture generates photorealistic visual inspection snapshots of food conditions (Fresh `0-30 min`, At-Risk `60-90 min`, Expired `120+ min`).
- **Discriminator**: Convolutional feature extractor trained to distinguish synthetic degradation states from real perishable spoilage telemetry.
- **Interactive UI (`/food-condition`)**:
  - Side-by-side condition viewer comparing fresh vs degraded food samples.
  - Per-donor perishable food batch breakdown with live DCGAN quality scores.
  - Interactive simulator slider: drag transit delay from 0 to 180 minutes to witness real-time visual degradation and quality drop.
  - DCGAN architecture breakdown: Generator & Discriminator layer specs, loss curves, and FID benchmarks.

---

## Target Users

- NGO / Food Bank Operators
- Community Food Redistribution Coordinators
- System Administrators and Operations Teams

This is **not** a consumer food delivery app. It is an operational decision-support and stress-testing platform.

---

## Team

**Project:** IdeaStress AI — Generative Stress Testing of Community Food Redistribution Systems
**Repository:** [Dharshanv-357/ResiliGen-AI](https://github.com/Dharshanv-357/ResiliGen-AI)

---

## License

This project is built for academic and research demonstration purposes.