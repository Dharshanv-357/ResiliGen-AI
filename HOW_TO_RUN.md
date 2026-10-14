# 🚀 HOW TO RUN IDEASTRESS AI (Read-Only Guide)

> **Project:** IdeaStress AI — Generative Stress Testing of Community Food Redistribution Systems  
> **Repository:** [ResiliGen-AI](https://github.com/Dharshanv-357/ResiliGen-AI)  
> **Status:** Full Interactive Frontend Prototype (React 19 + TypeScript + Vite + Tailwind CSS)

---

## 📋 1. Prerequisites

Before running the application, make sure you have the following installed on your machine:

| Requirement | Recommended Version | Verification Command |
|-------------|---------------------|----------------------|
| **Node.js** | `v18.x` or `v20.x`+  | `node -v`            |
| **npm**     | `v9.x` or `v10.x`+   | `npm -v`             |
| **Git**     | Any modern version  | `git --version`      |
| **Browser** | Chrome / Edge / Firefox / Brave (Modern evergreen browser) | — |

---

## ⚡ 2. Quick Start (Standard Execution)

Open your terminal (PowerShell, Command Prompt, or VS Code integrated terminal) and run:

```bash
# 1. Navigate to the project root directory
cd "c:\Users\vedha\OneDrive\Desktop\GENAI-CASESTUDY"

# 2. Install dependencies (only needed once or if package.json changes)
npm install

# 3. Start the Vite development server
npm run dev
```

Once the dev server boots, open your web browser and navigate to:
👉 **`http://localhost:5173/`** *(or `http://localhost:5174/` if 5173 is already in use)*

---

## 🪟 3. Windows-Specific Notes & Troubleshooting

### A. PowerShell Execution Policy Restriction
If you see an error like:
```text
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

**Solution 1 (Recommended — Run via CMD):**
```cmd
cmd /c "npm run dev"
```

**Solution 2 (Bypass Execution Policy in Current PowerShell Session):**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

---

### B. Port Conflicts
If port `5173` is already taken by another application:
Vite will automatically switch to `http://localhost:5174/` or `5175/`. Look at the terminal output for the exact URL:
```text
  VITE v5.4.11  ready in 420 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

---

## 🛠️ 4. Available NPM Scripts

All available commands configured in `package.json`:

| Command | Action | Use Case |
|---------|--------|----------|
| `npm run dev` | Starts Vite local development server | Normal development & live testing |
| `npm run build` | Compiles TypeScript (`tsc -b`) & builds bundle (`vite build`) | Production readiness & type verification |
| `npm run preview` | Serves the production build locally | Checking production performance |
| `npm run lint` | Runs `oxlint` high-speed linter | Code quality checking |

---

## 🧭 5. Faculty / Project Demo Walkthrough

Follow this recommended 9-step click-through path when demonstrating the project:

| Step | Page | URL | Key Features to Highlight |
|:---:|:---|:---|:---|
| **1** | **Dashboard** | `/` | Operational stress center overview, active plan metrics, quick actions, and the broken workflow indicator. |
| **2** | **Mission Plans** | `/plans` | Real-time redistribution plans, donor restaurants, NGO capacities, vehicle fleets. Click **"Create Plan"** to inspect form parameters. |
| **3** | **Scenario Generator** | `/scenarios` | 1,000 synthetic failure scenarios generated with conditional distributions (Demand surges, donor shortfalls, traffic gridlock, expiry drops). |
| **4** | **Stress Simulator** | `/simulator` | Run live simulation! Watch the animated progress bar, real-time metrics (Food Delivered, Waste, Unmet Demand), and dynamic event stream. |
| **5** | **DCGAN Food Quality** | `/food-condition` | Visual inspection of food quality under stress (Fresh vs At-Risk vs Expired). Drag the **transit delay slider** (0–180 min) to observe real-time quality degradation and waste estimates. |
| **6** | **Risk Analysis** | `/risk` | Multi-factor risk breakdown (0–100 risk score gauge), failure categorization, and bottleneck indicators. |
| **7** | **AI Multi-Agent Analysis** | `/agents` | Five specialized LLM agents (Resource, Logistics, Demand, Capacity, and Devil's Advocate) providing domain-specific verdicts. |
| **8** | **Recommendations** | `/recommendations` | AI-generated plan adjustments (e.g., dynamic vehicle rerouting, buffer stock allocation). Toggle **"Apply Modification"**. |
| **9** | **Before vs After** | `/comparison` | Side-by-side resilience comparison demonstrating quantitative risk reduction and improved food delivery rate. |

---

## 📁 6. Project Architecture Overview

```text
GENAI-CASESTUDY/
├── public/                       # Static assets (DCGAN condition images, logos)
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── layout/               # Header, Sidebar, AppLayout
│   │   └── ui/                   # Cards, Badges, Sliders, Counters
│   ├── data/                     # Mock data & scenario generators (1,000 items)
│   ├── pages/                    # 13 Application views
│   │   ├── Dashboard.tsx         # Overview & status
│   │   ├── Plans.tsx             # Plan management
│   │   ├── CreatePlan.tsx        # New plan creation
│   │   ├── Scenarios.tsx         # Synthetic scenario explorer
│   │   ├── Simulator.tsx         # Real-time stress simulator
│   │   ├── RiskAnalysis.tsx      # Risk scoring & factors
│   │   ├── Agents.tsx            # Multi-agent LLM reasoning
│   │   ├── Recommendations.tsx   # Actionable improvements
│   │   ├── Comparison.tsx        # Before vs After re-test
│   │   ├── History.tsx           # Run audit log
│   │   ├── FoodCondition.tsx     # DCGAN visual quality module
│   │   ├── Models.tsx            # GenAI pipeline status
│   │   ├── Dataset.tsx           # Training data telemetry
│   │   └── Settings.tsx          # Configuration & thresholds
│   ├── services/                 # API service layer (FastAPI ready)
│   ├── store/                    # Zustand global state (useAppStore)
│   ├── types/                    # Full TypeScript schema definitions
│   ├── App.tsx                   # Route definitions
│   └── main.tsx                  # Application entry point
├── HOW_TO_RUN.md                 # This guide (Read-Only)
├── README.md                     # Comprehensive technical documentation
├── package.json                  # Scripts & dependencies
└── vite.config.ts                # Vite build config
```

---

## 🔒 7. File Status

This file is marked **Read-Only** (`attrib +r`) to prevent accidental edits during demonstrations or repository usage. To remove read-only protection if needed in the future, run:
```cmd
attrib -r HOW_TO_RUN.md
```
