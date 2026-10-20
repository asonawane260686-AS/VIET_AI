# 🇻🇳 VietCarbon AI — Smart Sustainability Platform

**Theme: Renewable Energy & Low-Carbon Mobility**

A futuristic AI-powered smart city platform monitoring Vietnam's environmental sustainability with real-time analytics, 3D mapping, and FRIDAY AI voice assistant.

## 🚀 Quick Start

```bash
# 1. Install all dependencies
npm run install-all

# 2. Configure environment (optional — works in demo mode without keys)
cp backend/.env.example backend/.env
# Add: GROQ_API_KEY, MONGODB_URI, OPENWEATHER_API_KEY

# 3. Start development (both frontend + backend)
npm run dev
```

**Default Login:**
- Admin: `manager` / `manager123`
- Citizen: any phone number

## 📊 5-Year Vietnam Data (2021–2025)

| Year | CO₂ (Mt) | Renewable% | EV Vehicles | AQI |
|------|-----------|------------|-------------|-----|
| 2021 | 162.5     | 19%        | 120K        | 61  |
| 2022 | 168.7     | 21%        | 210K        | 63  |
| 2023 | 173.4     | 24%        | 390K        | 65  |
| 2024 | 176.8     | 26%        | 640K        | 67  |
| 2025 | 179.6     | 28.7%      | 910K        | 68  |

## 🛠 Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Frontend     | React 18 + Vite + Tailwind CSS          |
| Map          | Leaflet.js (OpenStreetMap)              |
| Charts       | Recharts                                |
| Backend      | Node.js + Express                       |
| Database     | MongoDB Atlas                           |
| AI           | Groq API (Llama 3)                      |
| Voice        | Web Speech API                          |

## 🏙 Cities Monitored (2025)

| City | CO₂ (Mt) | AQI | Risk |
|------|----------|-----|------|
| Ho Chi Minh City | 18.4 | 76 | Critical |
| Hanoi | 15.2 | 82 | Critical |
| Hai Phong | 9.6 | 74 | High |
| Da Nang | 4.8 | 58 | Medium |
| Can Tho | 3.2 | 53 | High |
| Nha Trang | 1.8 | 46 | Medium |
| Hue | 1.4 | 50 | Medium |
| Vung Tau | 3.8 | 62 | Medium |

## 🤖 FRIDAY AI Voice Commands

- "Friday, show Hanoi data"
- "Friday, what's the highest CO2 city?"
- "Friday, generate sustainability report"
- "Friday, open renewable energy panel"
- "Friday, compare Ho Chi Minh and Hanoi"
- "Friday, show climate disaster data"

## 📱 Features

✅ Admin Dashboard with 11 analytics panels  
✅ Interactive Vietnam Map (Leaflet)  
✅ 5-Year Historical Data (2021–2025)  
✅ FRIDAY AI Voice Assistant  
✅ Citizen Carbon Footprint Calculator  
✅ CO₂ Heatmaps & Pollution Tracking  
✅ Renewable Energy Monitoring  
✅ Climate Disaster Risk Assessment  
✅ Soil Health & Agriculture Data  
✅ AI Report Generator  
✅ Real-time Alert System  

---

## API Key Help
See `API_KEYS_SETUP.md` for where to get Groq, MongoDB, AssemblyAI, Chatterbox TTS, and Gmail keys.

Quick backend `.env` must include:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=change_this_secret
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
ASSEMBLYAI_API_KEY=your_assemblyai_key_optional
CHATTERBOX_TTS_URL=http://localhost:8000
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
PORT=5000
FRONTEND_URL=http://localhost:5173
```
