# Final Map + AI Upgrade Changes

Added:
- Renewable energy images mapped to solar, wind, hydro, floating solar, hydrogen, smart village and agrivoltaics markers.
- Larger MapLibre map height to remove blank map space.
- Vietnam national border approximation plus province/district guide lines.
- Major road/street CO2 corridors including National Highway 1A, Hanoi Ring Road, HCMC airport/Thu Duc corridor, Hai Phong port roads.
- Stronger traffic heatmap visualization.
- Alert detail workflow: click alert -> affected city/district/town -> impact/action -> show on map -> send citizen alert.
- Citizen alert messages saved to localStorage for citizen message-box demo.
- AI Insights now waits for user question + selected city/topic before giving answer.
- AI report filters: state/city/district/town + daily/monthly/yearly + topic.
- Soil recommendations are location-based and include a Show on Map action.

Note:
- True live weather needs a real weather API key in backend. Current UI uses city baseline data when API is unavailable.
- For exact official district boundary polygons, connect a Vietnam district GeoJSON API/file later. Current version provides visible guide boundaries and roads for prototype/demo.
