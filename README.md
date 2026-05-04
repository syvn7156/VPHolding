# 🏝️ VP Sa Bàn 3D Platform v1.0

> **Nền tảng tạo sa bàn 3D web (3D architectural diorama platform)** cho mọi dự án BĐS của VP Holding.
> Component-based, reusable, file:// portable.
> **Created:** 2026-05-03 · **Maintainer:** Thanh Phong Nguyen

---

## ✨ Triết lý (Design Philosophy)

| # | Nguyên tắc | Vì sao |
|:---:|:---|:---|
| 1 | **Component-first (component-hóa trước)** | Mỗi block (tower, tree, dock) tách riêng, dùng lại được vô hạn dự án |
| 2 | **JSON-driven** | Dự án mới = 1 file JSON + run composer. Không code lại scene |
| 3 | **No ES Module + No importmap** | HTML phải mở được `file://` (BOD click đúp), không CORS |
| 4 | **Three.js r128 fixed** | Mọi addon cùng phiên bản, không drift |
| 5 | **CDN fallback chain** | Local lib trước → CDN backup, không bao giờ chết |
| 6 | **PBR realistic** | MeshStandardMaterial + procedural textures + Hosek-Wilkie sky + real water shader |

---

## 🚀 Quick Start

### Tạo sa bàn mới — 2 phase

```
Phase 1: /biz-saban-blueprint   (Hình + số liệu → site.config.json + preview SVG)
                                 ⏸ CHECKPOINT: anh duyệt JSON
Phase 2: /biz-saban-3d           (JSON đã verified → sa bàn 3D HTML + screenshot)
```

### Manual (không qua workflow)

```bash
# 1. Copy boilerplate sang folder dự án mới
cp -r .platforms/saban-3d/boilerplate Demo_BOD/<TEN_DU_AN>

# 2. Sửa site.config.json (boundary, buildings, water, ...)

# 3. Mở starter.html trong Chrome
```

---

## 📁 Cấu trúc folder

```
.platforms/saban-3d/
├── lib/              ← Vendor: three.min.js r128 + addons + GLTFLoader
├── components/       ← 15 reusable components (5 nhóm)
│   ├── _core.js      ← SABAN namespace + helpers + CDN loader
│   ├── buildings/    ← tower, villa, shophouse, podium, clubhouse
│   ├── nature/       ← tree, bush, palm
│   ├── infra/        ← road, bridge, dock, parking
│   ├── water/        ← lagoon, river, pool
│   └── vehicles/     ← boat, yacht
├── materials/        ← procedural-textures.js + pbr-presets.js
├── presets/          ← lighting.js + cameras.js + sky-time.js
├── ui/               ← panels.css + panels.js (info/views/legend/time/stats)
├── boilerplate/      ← starter.html + site.config.json + README
├── examples/         ← 01-phuc-thinh-tam-da, 02-..., ...
└── docs/             ← component-catalog, material-catalog, camera-catalog,
                       scale-and-coordinates, troubleshooting
```

---

## 📐 Convention

| Quy ước (Convention) | Giá trị |
|:---|:---|
| Đơn vị độ dài (Length unit) | 1 unit = 1 mét |
| Trục hướng (Axis) | +X = Đông (East) · -Z = Bắc (North) · +Y = Lên (Up) |
| Boundary CCW | Polygon đỉnh theo chiều ngược kim đồng hồ |
| Tower height | Mỗi tầng = 3.3m (residential) hoặc 4.0m (commercial) |
| File HTML | Standalone, mở `file://` được, không cần web server |

---

## 🔗 Liên kết

- Workflow Phase 1: `.agents/workflows/biz-saban-blueprint.md`
- Workflow Phase 2: `.agents/workflows/biz-saban-3d.md`
- Skill reference: `.agents/skills/saban-3d-builder/SKILL.md`
- Component catalog: `docs/component-catalog.md`
- Reference example: `examples/01-phuc-thinh-tam-da/`

---

## 📜 License

Internal use only — VP Holding.
