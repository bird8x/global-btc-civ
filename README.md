# Global Bitcoin & Sovereign Compute Civilization Map

A static, zero-dependency hex-grid 4X strategy map. The architecture is inspired by Andrej Karpathy's usaciv (MIT).

Run: `python -m http.server 8080` in this folder, then open http://localhost:8080

- `data.js`  — node metrics + `SOURCES` provenance (shown in the in-app Almanac)
- `world.js` — 0.55° land hex mask rasterized from Natural Earth 1:110m land
- `app.js`   — renderer (terrain relief, coastline shimmer, badges, label declutter), lenses, search, Almanac, advisor panel

Hashrate: Hashrate Index Global Hashrate Heatmap Q4 2026 (CBECI-style pool geolocation). Other fields list their source and verification status in the Almanac.

License: MIT
