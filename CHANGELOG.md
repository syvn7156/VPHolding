# Changelog — VP Sa Bàn 3D Platform

## v1.0.0 — 2026-05-03

### 🎉 Initial release

**Core platform:**
- Folder structure (`.platforms/saban-3d/` với 8 nhóm: lib/components/materials/presets/ui/boilerplate/examples/docs)
- Vendor libs: Three.js r128 + OrbitControls + Sky + Water + GLTFLoader
- `SABAN.*` global namespace (no ES Module, file:// portable)

**Components (15 / 5 nhóm):**
- 🏢 Buildings: Tower, Villa, Shophouse, Podium, Clubhouse
- 🌳 Nature: Tree, Bush, Palm
- 🛣️ Infrastructure: Road, Bridge, Dock, Parking
- 💧 Water: Lagoon, River, Pool
- 🚤 Vehicles: Boat, Yacht

**Materials:**
- 5 procedural textures (wood, grass, asphalt, sand, water-normal)
- 9 PBR materials (greenGlass, woodPanel, concrete, podium, grass, asphalt, sand, dock, metalFrame)

**Presets:**
- Lighting: day / sunset / night
- Cameras: 6 góc chuẩn (aerial_sw, aerial_top, aerial_e, aerial_s, aerial_se_night, ground)
- Sky-time: Hosek-Wilkie + time-of-day slider

**UI:**
- Standard panels (info, views, legend, time slider, FPS stats, loading overlay)

**Workflows:**
- `/biz-saban-blueprint` (Phase 1: hình + số liệu → JSON + SVG preview)
- `/biz-saban-3d` (Phase 2: JSON đã verified → 3D HTML)

**Skill:**
- `saban-3d-builder` (component reference, pitfalls, performance tips)

**Reference example:**
- `examples/01-phuc-thinh-tam-da/` — migrated từ `Demo_BOD/masterplan_300ha/masterplan_3d_v2.html` (legacy giữ nguyên)

**Migration source:**
- Mining từ `masterplan_3d_v2.html` v2 (895 dòng inline) — chiều 2026-05-03
