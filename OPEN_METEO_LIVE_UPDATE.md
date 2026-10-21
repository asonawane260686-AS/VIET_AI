# Open-Meteo Live Data Update

This build connects the dashboard to Open-Meteo APIs for real weather and air-quality values.

## Live sources
- Weather forecast/current data: `https://api.open-meteo.com/v1/forecast`
- Air quality/current AQI data: `https://air-quality-api.open-meteo.com/v1/air-quality`

## What is now live
- City temperature
- Wind speed and gusts
- Rain/precipitation
- Weather code/icon
- US AQI
- PM2.5, PM10, CO, NO2, SO2, Ozone
- 2026 AQI row is calculated from current Open-Meteo city values
- Flood, heatwave, traffic and solar score react to live weather conditions

## What remains simulated
Open-Meteo does not provide city CO₂ emissions, factory emissions, traffic counts, soil fertility, EV count, or renewable production. Those values still use the existing 2026 live simulation layer while 2021-2025 remain constant.
