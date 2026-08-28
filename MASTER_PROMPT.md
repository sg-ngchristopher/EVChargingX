# MASTER SYSTEM PROMPT: EVChargingX (SG EV Charger Finder)

> **Application Name**: Singapore EV Charger Finder (`EVChargingX`)  
> **Target Region**: Singapore (SG)  
> **Tech Stack**: React 18+ (TypeScript), Vite, Tailwind CSS, Express.js (Node.js & Vercel Serverless Functions), Leaflet / OpenStreetMap / OneMap SG, Disqus Community Discussions, Microsoft Clarity Analytics.

---

## 1. Project Overview & Objective

Build **EVChargingX**, a high-performance, real-time Electric Vehicle (EV) charging station finder engineered specifically for Singapore EV drivers. The application specializes in **hyperlocal 500-meter radius boundary filtering** around the driver's current GPS position or any searched destination (postal codes, landmarks, road names), providing live bay availability, speed/connector filtering, pricing breakdowns, route navigation, and community driver discussion threads.

---

## 2. Core Functional Requirements

### A. Geolocation & Destination Search
1. **Near Me (GPS Detection)**:
   - Uses browser Geolocation API (`enableHighAccuracy: true`, 8s timeout).
   - Validates coordinates against Singapore geographic bounding box (`lat: 1.15 to 1.48, lng: 103.58 to 104.05`).
   - If outside Singapore or permission is denied, gracefully falls back to central Singapore (Marina Bay Sands) with an informative message.
2. **Search Destination & Geocoding**:
   - Accepts 6-digit Singapore Postal Codes (e.g. `018956`, `529510`), MRT stations, malls, and landmark names.
   - Proxies geocoding requests through `/api/onemap/search` using Singapore OneMap API, with built-in instant local fallback coordinates for top Singapore landmarks.
   - Quick-select chips for popular SG destinations: Marina Bay Sands, Jewel Changi Airport, Orchard ION, Jurong Point, VivoCity, Woodlands Civic Centre, etc.

### B. Strict 500m Radius Boundary & Zone Statistics
1. **Distance Engine**:
   - Calculates exact Haversine distance from target point to all charging stations.
   - Default radius set to **500 meters** (strict walking/immediate parking radius), with selectable thresholds (500m, 1.0 km, 2.0 km, 5.0 km).
2. **Zone Aggregate Statistics Banner**:
   - Displays real-time station count and total available vs occupied charging bays within the active radius.
   - Calculates fastest available DC charging power (kW) and lowest price per kWh within the zone.
   - Interactive badge allowing one-tap focus to the nearest station.

### C. Filtering & Sorting
1. **Connector Types**: CCS2 (Combo 2), Type 2 (AC), CHAdeMO.
2. **Power / Speed**: DC Fast (≥50 kW), Ultra-Fast DC (≥120 kW), AC Standard (7–22 kW), customizable minimum kW slider.
3. **Major Singapore CPOs**: SP Mobility, Shell Recharge, CDG ENGIE, Charge+, Tesla Supercharger, TotalEnergies, Volt, QuickCharge.
4. **Attributes**: Available Bays Only, 24/7 Access Only, Sheltered Carpark Only.
5. **Sorting Options**: Nearest First (Distance Ascending), Most Available Bays, Fastest Power (kW), Lowest Price ($/kWh).

### D. Interactive Map View
- Built with **Leaflet / React-Leaflet** with custom dark/light tiles.
- Renders an optical **500m search zone circle** around the target location.
- Custom styled SVG charging station markers color-coded by real-time status:
  - 🟢 **Available** (≥1 bay free)
  - 🔴 **Occupied / In-use** (0 bays free)
  - ⚪ **Selected Target Marker** with pulsing radar ripple effect.
- Map popups and station card clicks sync smoothly with fly-to zoom animations.

### E. Station Details & Bay Simulator
1. **Station Modal**:
   - Full address, operating hours, carpark clearance height, shelter status, and operator badge.
   - Detailed list of charging points with individual power ratings (kW), plug types, and live bay status.
   - Transparent pricing model ($/kWh off-peak/peak and carpark gantry/parking rates).
   - Instant navigation links: **Google Maps**, **Apple Maps**, **Waze**, and **OneMap**.
2. **Interactive Bay Simulator**:
   - Driver capability to simulate bay status toggles in real-time (Available ⇄ Occupied) to test state synchronization.

### F. Community Driver Discussions (Disqus Integration)
1. **Station-Level Discussion Embeds**:
   - `<DiscussionEmbed>` configured with canonical identifier `station-{id}` and title per charging station.
   - Multilingual support switcher (English `en`, Traditional Chinese `zh_TW`, Simplified Chinese `zh_CN`, Malay `ms`, Tamil `ta`).
2. **Comment Count Badges**:
   - `<CommentCount>` displayed on station cards in the search drawer.
3. **General Community Forum Modal**:
   - Accessible via the **Discussions** button in the header for island-wide SG EV charging etiquette, CPO tariff updates, and road-trip tips (`sg-ev-community-general`).

---

## 3. Full-Stack Architecture & API Specification

### Backend Server (`server.ts` & `/api/*`)
- Runs as an Express backend locally via `tsx server.ts` (port 3000) and exports serverless handler functions for Vercel deployment.
- **Graceful Non-Blocking Fallbacks**: If API keys (`LTA_DATAMALL_API_KEY`, `ONEMAP_API_KEY`, `ONEMAP_EMAIL`) are missing, the server logs a console warning and serves high-fidelity Singapore EV dataset without halting or throwing errors.

#### API Endpoints:
1. `GET /api/health` — Returns `{ status: "ok", uptime, timestamp }`.
2. `GET /api/status` — Returns service configuration status for LTA DataMall & OneMap.
3. `GET /api/lta/ev-charging-points` — Proxies LTA DataMall OData endpoint `$filter` / batch paging.
4. `GET /api/onemap/search?q={query}` — Proxies Singapore OneMap address geocoding.
5. `POST /api/onemap/auth` — Handles OneMap token acquisition.

---

## 4. UI/UX Design System & Anti-Slop Guidelines

- **Theme & Aesthetics**:
  - Dark mode default (`#0F1115` dark canvas, `#13161C` elevated containers, `#F4F4F5` typography).
  - Light mode support (`slate-100` background, `white` cards, `slate-900` text).
  - High-contrast emerald accents (`#10B981`) for live availability indicators.
- **Typography**:
  - Primary UI: `Plus Jakarta Sans`
  - Technical / Numeric / Postal Codes: `JetBrains Mono`
- **Mobile Usability**:
  - Smooth vertical scrolling enabled with `min-h-screen`, `touch-pan-y`, and `overscroll-contain`.
  - Sticky mobile switcher bar allowing one-tap switching between **Map & 500m Ring** and **Station List**.

---

## 5. Analytics & Tracking
- **Microsoft Clarity**: Integrated in `<head>` of `index.html` with project tag `y99jliyxni` for user session analytics and heatmap monitoring.

---

## 6. Environment Variables (`.env.example`)

```env
# Singapore Land Transport Authority (LTA) DataMall API Key
LTA_DATAMALL_API_KEY=

# Singapore OneMap API Credentials (Optional)
ONEMAP_API_KEY=
ONEMAP_EMAIL=
ONEMAP_PASSWORD=

# Analytics & App Config
DISABLE_HMR=true
```
