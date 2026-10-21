# Prompt Update — VietCarbon AI + HydroGrid AI Integration

Do not change HydroGrid AI design/features.

Update only the existing VietCarbon AI system with these fixes:

1. Citizen Data Flow
- When citizen logs in and submits details, store data in backend database under CitizenData.
- Admin must see this data in Citizen Data and AI Data Center.
- Show where the data goes: Citizen Form → MongoDB CitizenData → AI Data Center → Map/Heatmaps → Reports/Alerts.
- Do not display fake personal notifications as message-only output.

2. AI Data Center
- Add sidebar item: AI Data Center.
- Show collected citizen data, city samples, daily data, map markers, confidence score, daily city integration data, and realistic decision notes.

3. Map Fixes
- Improve Vietnam map like Google Maps style.
- Show city markers, small town/district markers, factory/industrial hotspot markers, and traffic route lines.
- On click/hover, show proper highlighted information.
- Show image preview for factory/industrial zone popups.
- Add realistic hotspot info for Cat Lai Port, Dinh Vu Industrial Area, Thang Long Industrial Park, Hoa Khanh IZ, Tra Noc IZ, Phu My IZ.
- Highlight traffic corridors such as Hanoi-Hai Phong and HCMC-Cat Lai-Vung Tau.

4. Report Generator Fix
- Fix frontend API route mismatch.
- Generate city report using selected city data, citizen data, and Vietnam stats.
- Remove generic unrealistic “AI suggestion lines.”
- Replace with realistic operational action plan.

5. Keep Existing Features
- Keep HydroGrid AI unchanged.
- Keep FRIDAY bottom command mode unchanged.
- Keep existing sidebar options.
- Keep dark green futuristic UI.
