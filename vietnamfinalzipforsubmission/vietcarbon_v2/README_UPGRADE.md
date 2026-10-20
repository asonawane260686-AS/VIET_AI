# VietCarbon AI — v2.0 Upgrade Notes

## 🗺️ MapLibre GL JS — Full 3D Map Upgrade

### What Changed
- **Replaced Leaflet** with **MapLibre GL JS 3.6.2** (dynamic import — no bundle bloat)
- **4 Map Styles**: Dark Matter, Terrain (Voyager), Satellite (Dark No Labels), Positron
- **Heatmap Layer**: WebGL-accelerated, updates dynamically per active layer
- **City Dots Layer**: Appears at zoom 7+, color-coded by metric
- **3D Pitch Mode**: 55° tilt + bearing, toggle via "3D" button
- **Orbit Pulse Markers**: Selected city shows animated concentric rings
- **Hover Tooltips**: Rich MapLibre Popup with city stats, no external libs
- **Fly-To Animation**: Smooth 2s flyTo on city select
- **City Quick-Select Panel**: Bottom-right panel for fast switching
- **Layer Legend**: Bottom-left gradient bar with LOW/MED/HIGH/CRIT labels
- **Reset Button**: Returns to Vietnam overview (zoom 5.5, pitch 0)
- **Fallback SVG Map**: Auto-renders if MapLibre fails to load

### All Supported Overlay Layers
| Layer Key | Label | Metric |
|-----------|-------|--------|
| `carbon` | CO₂ Emissions | carbonEmission |
| `climate` | Climate Risk | climateRisk |
| `traffic` | Traffic Density | trafficDensity |
| `solar` | Solar Potential | solarAvailability |
| `flood` | Flood Risk | floodRisk |
| `population` | Population Density | population |
| `factory` | Industrial Activity | industrialActivity |
| `renewable` | Renewable Energy | renewablePercent |

### How MapLibre Loads
```js
// Dynamic import — won't block page load
import('maplibre-gl').then(({ default: maplibregl }) => {
  // CSS also injected dynamically
  const link = document.createElement('link');
  link.href = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css';
  ...
});
```

---

## 🤖 FRIDAY AI — Full Upgrade

### What Changed
- **Orbital HUD Rings**: 3 animated orbit dots + 3 concentric pulse rings when active
- **4 State System**: `idle | listening | processing | speaking`
- **State-Aware Icons**: Mic (idle) → Wave bars (listening) → Spinner (processing) → Speaker (speaking)
- **Expandable Chat Panel**: Toggle with `≡` button on orb — shows full message history
- **Quick Command Buttons**: 6 one-tap shortcuts (Map, CO₂, Energy, Traffic, Flood, Report)
- **Chat Input**: Type commands + Enter or click send
- **Rich Smart Fallbacks**: 15 pattern-matched responses for offline/no-API operation
- **Groq Integration**: Calls `/api/ai/friday/chat` → llama-3.3-70b-versatile
- **Chatterbox TTS**: Calls `/api/ai/friday/speak` → falls back to Web Speech API
- **Female Voice Selection**: Zira / Jenny / Aria / Samantha / Karen / Victoria
- **Command Router**: Voice/text auto-routes to dashboard section (map, co2, energy, traffic, etc.)
- **Reply Bubble**: Shows last FRIDAY response outside chat panel
- **Boot Greeting**: 2s delay greeting on mount
- **Color Themes**: Green (idle) → Cyan (listening) → Orange (processing) → Purple (speaking)

### FRIDAY Smart Fallbacks (work without API keys)
```
"Analyze Hanoi"       → Hanoi CO2, AQI, heatwave, industrial data
"Ho Chi Minh City"    → HCMC critical zone stats
"Da Nang"             → Solar champion data
"Hai Phong"           → Industrial emission alert
"Can Tho"             → Mekong delta climate risk
"Renewable energy"    → National solar/wind/hydro stats
"Compare cities"      → Full sustainability ranking
"Generate report"     → Report generation trigger
"Hello" / "Status"    → System status overview
```

### Voice Pipeline
```
User speaks
  → Browser Web Speech API (SpeechRecognition)
  → Groq llama-3.3-70b-versatile (via backend /api/ai/friday/chat)
  → onCommand() routes to dashboard section
  → Text reply displayed in bubble/chat
  → Chatterbox TTS OR Web Speech API speaks reply
```

---

## 📦 Installation

### Frontend
```bash
cd frontend
npm install          # installs maplibre-gl 3.6.2 + all deps
npm run dev          # http://localhost:3000
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in GROQ_API_KEY (required for FRIDAY AI + chatbot)
# ASSEMBLYAI_API_KEY (optional — browser SpeechRecognition used as fallback)
# CHATTERBOX_TTS_URL (optional — browser TTS used as fallback)
# MONGODB_URI (required)
node server.js       # http://localhost:5000
```

### Required `.env` Keys
```env
GROQ_API_KEY=gsk_...            # Get from console.groq.com (FREE)
GROQ_MODEL=llama-3.3-70b-versatile
MONGODB_URI=mongodb+srv://...   # MongoDB Atlas connection string
JWT_SECRET=your_jwt_secret

# Optional — FRIDAY voice
ASSEMBLYAI_API_KEY=...          # assemblyai.com (fallback: browser mic)
CHATTERBOX_TTS_URL=http://localhost:8080  # local Chatterbox server (fallback: browser voice)
CHATTERBOX_VOICE=female
```

---

## 🔑 Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin/Admin | admin@vietcarbon.ai | admin123 |
| Citizen/User | citizen@vietcarbon.ai | citizen123 |

---

## 🏗️ Architecture

```
VietCarbonAI_UPGRADED/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VietnamMap.jsx    ← 🆕 MapLibre GL JS 3D Map
│   │   │   └── FridayAI.jsx     ← 🆕 Upgraded FRIDAY AI Orb
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── CitizenDashboard.jsx
│   │   └── utils/
│   │       └── vietnamData.js
│   ├── vite.config.js            ← 🆕 MapLibre chunk split
│   └── package.json              ← 🆕 maplibre-gl 3.6.2 added
└── backend/
    ├── routes/
    │   └── ai.js                 ← FRIDAY /chat + /speak routes
    └── server.js
```

---

## 🎯 Hackathon Features Checklist
- ✅ MapLibre GL JS 3D Map with heatmaps
- ✅ 4 map style themes
- ✅ Animated city markers with orbit rings
- ✅ FRIDAY AI voice orb with 4-state HUD
- ✅ Expandable FRIDAY chat panel + history
- ✅ 15 smart offline fallbacks
- ✅ Groq llama-3.3-70b-versatile integration
- ✅ Chatterbox TTS + Web Speech API fallback
- ✅ City-gated analytics (no random data)
- ✅ CO₂ Command Center
- ✅ Climate Disaster Predictor
- ✅ Renewable Energy Optimizer
- ✅ AI Traffic Heatmaps
- ✅ Industry Emission Tracker
- ✅ Admin + Citizen dual dashboards
- ✅ PDF Report Generation
