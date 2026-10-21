# 🌊⚡ HydroGrid AI — Integration Guide

## What's New in This Upgrade

HydroGrid AI has been fully integrated into VietCarbon AI as a new module.

### New Sidebar Entry: **HydroGrid AI** (marked NEW)

Accessible via the sidebar — cyan/blue themed to distinguish from VietCarbon's green theme.

## HydroGrid AI Pages

| Page | Description |
|------|-------------|
| **Overview Dashboard** | Live KPIs, energy flow animation, Vietnam region suitability map |
| **Renewable Monitor** | Solar/Wind/Tidal live metrics with Summer/Rainy/Cloudy simulation modes |
| **Weather AI** | 7-day forecast with AI recommendations for energy planning |
| **H₂ Production** | Electrolysis control panel, hydrogen tank animation, safety alerts |
| **Low-Carbon Mobility** | Hydrogen bus/truck/train/taxi fleet analytics |
| **AI Optimization** | FRIDAY AI decision log, routing status, optimization score |
| **Analytics** | Monthly charts, pie charts, 24-month CO₂ trend |
| **Settings** | Toggles for all systems, energy threshold sliders |

## FRIDAY AI Voice Commands (HydroGrid)

Say any of these to FRIDAY:
- **"Friday, open HydroGrid"** → Opens HydroGrid dashboard
- **"Friday, hydrogen production"** → Opens H₂ Production page
- **"Friday, electrolysis status"** → Opens H₂ Production
- **"Friday, fuel cell report"** → Opens HydroGrid

## Energy Flow Animation

The Overview page shows an animated live energy flow:
```
☀️ Solar → ⚡ AI Grid → ⚗️ Electrolysis → 🔵 H₂ Tank → 🚌 Mobility
💨 Wind  ↗
🌊 Tidal ↗
```

## Vietnam Regions Featured

- **Ninh Thuận** — Solar champion (94% score)
- **Bình Thuận** — High solar + wind
- **Hải Phòng** — Tidal energy hub
- **Đà Nẵng** — Balanced renewable
- **Quảng Ninh** — Tidal leader (91%)

## All Existing Features Preserved

✅ Vietnam 3D Map  
✅ CO₂ Monitoring  
✅ Climate & Disaster  
✅ Renewable Energy  
✅ Soil & Agriculture  
✅ Traffic & Vehicles  
✅ AQI & Pollution  
✅ AI Report  
✅ Citizen Data  
✅ Alert System  
✅ FRIDAY AI Voice  

## Running the Project

```bash
# Backend
cd backend
npm install
node server.js

# Frontend
cd frontend
npm install
npm run dev
```
