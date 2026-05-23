# 🏟️ Cricket Stadium Crowd Management Platform

An integrated, real-time command-and-control platform designed for stadium operators, emergency responders, and volunteers. This application unifies ticketing metrics, visualizes spectator density with a 2.5D interactive heatmap, maps flow directions, and leverages **Google Gemini AI (3.5 Flash)** to automate tactically sound emergency evacuations and detour routes.

Built and styled under expert guidelines for the **Google Cloud Agentic Premier League Hackathon**.

---

## 🚀 Key Features (Active MVP)

| Feature Module | Importance | State | Notes |
| :--- | :--- | :--- | :---|
| **Interactive Triage Dashboard** | Core | Done | Real-time tickers tracking gate entries, turnstile flow-rates, and severe bottleneck hotspots. Includes background simulated crowd ticks representing live matches. |
| **2.5D Vector Heatmap Viz** | Innovation | Done | High-performance SVG design mapping pitch, stand enclosures, gateways, and parking slots. Outperforms lagging 3D engines of low-end field laptops. |
| **Emergency Triage Queue**| Core | Done | Register security disturbances/heat stress cases, dispatch emergency squads, and escalate status. |
| **Gemini AI Command Pilot** | Innovation | Done | Fully integrated server-side proxy querying Google Gemini API (`gemini-3.5-flash`) with strict JSON schema to suggest dynamic route bypasses and public announcements. |
| **Route Offset Deflections** | Core | Done | Define and map quick detour plans (e.g. bypass Gate A turnstiles and redirect incoming queues to Gate F bypasses). |
| **Inclusive DEI Design (A11y)** | DEI Standards | Done | Color-blind vision matrices (Deuteranopia, Protanopia, Achromatopsia), high-contrast overrides, text sizes scaling, and Speech Synthesis screen vocalizers. |
| **Walkthrough Demo Wizard** | Presentation | Done | Interactive chronological preset controller stepping presenters through a flawless Matchday live pitch. |

---

## 🛠️ Architecture and Stack Justification

```
┌─────────────────────────────────────────────────────────────┐
│                 CRICKET STADIUM CO-COMMAND                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                   REACT SPA STATE                   │   │
│   └──────────────────────────────────────────┬──────────┘   │
│                                              │              │
│         ┌────────────────────────────────────┼─────────┐    │
│         ▼                                    ▼         ▼    │
│   ┌─────────────┐                      ┌──────────┐ ┌──────┐│
│   │Stadium Vector│                      │Analytics │ │ DEI  ││
│   │2.5D Heatmap │                      │Charts    │ │Rules ││
│   └─────────────┘                      └──────────┘ └──────┘│
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │   Express server.ts API ("/api/mitigate")              │  │
│  │   Lazy-loaded Google GenAI Client (@google/genai)      │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

- **React 19 & TypeScript**: Provides high-performance component state rendering with maximum modularity.
- **Tailwind CSS**: Instant modern typography, eye-safe midnight slate color palettes, and responsive layouts.
- **Express + Vite Server Setup**: Bundled as a standalone `.cjs` output using `esbuild`. Strictly isolates sensitive AI tokens on the backend while maintaining responsive frontend hot loads.
- **Google GenAI SDK**: Implements the recommended `@google/genai` TypeScript client library to fetch structured, scalable tactical solutions under 2.5s.

---

## 🏆 Presentation Script: The "Happy Path"

To deliver a flawless presentation or judging video, select the chronologically stacked controls on the bottom of the dashboard to progress through the live matchday scenario:

1. **Step 1: Ingress Congestion Surge**  
   *Story*: Stadium gate queues back up at North Gate A. Show judges the turns tiles list ticking red on the interactive heatmap as capacity metrics cross 98%.
2. **Step 2: Emergency Siren Triage**  
   *Story*: A heat stress call occurs in North Stand Level 1. Trigger the red medical siren overlay flashing right next to the stand coordinates. Click the "Trigger Drill Alarm" button to flash the marquee.
3. **Step 3: Deep Gemini Rerouting**  
   *Story*: Press "AI Mitigate" on the active log. Instantly, Gemini AI ingests the stadium gate counts, processes safe escape pathways, and types out a structured Tactical Plan recommending a bypass detour to Gate F.
4. **Step 4: Full Safe Clearance**  
   *Story*: Click to execute the rerouting. All gates disperse, turnstiles turn comfortably green, incidents are registered as resolved, and the stadium map stabilizes under perfect safety limits.

---

## 📦 Local Workspace Setup & Builds

To spin up development or compile production targets:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environments**:
   Duplicate `.env.example` as `.env` and fill in your Gemini API key (optional - the server integrates secure fallback mock advice if blank):
   ```env
   GEMINI_API_KEY="YOUR_KEY_HERE"
   ```
3. **Execute Unified Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to preview.

4. **Production Build Compilation**:
   ```bash
   npm run build
   ```
   Outputs compiled SPA assets in `dist/` and compiles the backend server file as `dist/server.cjs`.
