# Boilerplate — Cách dùng

> Khi cần tạo sa bàn 3D mới, copy 2 file này sang folder dự án + chỉnh `site.config.json`.

---

## Quy trình 4 bước

### 1. Copy boilerplate

```powershell
# Ví dụ: dự án mới "BaoLoc Resort"
mkdir Demo_BOD\BaoLoc_Resort\saban
cp .platforms\saban-3d\boilerplate\starter.html Demo_BOD\BaoLoc_Resort\saban\index.html
cp .platforms\saban-3d\boilerplate\site.config.json Demo_BOD\BaoLoc_Resort\saban\
```

### 2. Sửa `site.config.json`

| Trường (Field) | Mô tả | Ví dụ |
|:---|:---|:---|
| `name` | Tên dự án | `"BaoLoc Resort"` |
| `site.vertices` | Polygon ranh đất `[[x,z],...]` (mét, gốc tọa độ tại tâm site) | `[[-300,-200],[300,-200],[200,200],[-200,200]]` |
| `site.area_ha` | Diện tích (ha) — chỉ để hiển thị | `35.6` |
| `site.northDeg` | Độ lệch hướng Bắc (rad) | `0` (Bắc trùng -Z) |
| `buildings[]` | Mảng tower/villa/shophouse | xem catalog |
| `water[]` | Mảng lagoon/river/pool/canal | xem catalog |
| `infra[]` | Đường, cầu, dock | xem catalog |
| `vegetation.trees` | Mảng `[x,z,scale]` | `[[100,50,1.2],...]` |
| `cameras[]` | Custom views (optional) | `{id:"my_view",pos:[...],target:[...],label:"..."}` |

### 3. Mở Chrome

Click đúp `index.html`. Nếu trắng màn hình (CORS error trong DevTools), mở starter.html, paste JSON vào biến `SITE_CONFIG_DEFAULT` thay vì fetch.

### 4. Verify

- ✅ 8 panel hiện ra (info góc trái, views góc phải, legend, time slider, stats)
- ✅ Click các button view → camera lerp
- ✅ Kéo time slider → bầu trời + đèn đêm thay đổi
- ✅ FPS ≥ 30 (nếu < 20: giảm `vegetation.trees` count, hoặc tắt shadow trên mesh không quan trọng)

---

## Đường dẫn tương đối

```
saban-3d/boilerplate/starter.html
   ../components/...   ← CORE + components
   ../materials/...
   ../presets/...
   ../ui/...
   ../lib/...
   ./site.config.json  ← cùng folder
```

> Khi copy ra ngoài (vd `Demo_BOD/X/saban/index.html`), starter.html cần đường dẫn `../../../.platforms/saban-3d/...`. Workflow `/biz-saban-3d` sẽ tự sửa đường dẫn này.

---

## Schema cheat sheet (xem `docs/component-catalog.md` để full)

```json
{
  "buildings": [
    { "type": "Tower", "x": 0, "z": 0, "floors": 30, "width": 22, "depth": 22, "name": "T1" },
    { "type": "Villa", "x": 100, "z": -50, "floors": 2, "roofType": "pitched" },
    { "type": "Shophouse", "x": -100, "z": 80, "count": 5, "floors": 4 },
    { "type": "Clubhouse", "x": 50, "z": 0, "width": 50, "dome": true }
  ],
  "water": [
    { "type": "Lagoon", "x": 0, "z": 0, "radius": 28, "scale": [1.4, 0.7] },
    { "type": "River", "mode": "rectangle", "x": 200, "z": 0, "width": 80, "length": 600 },
    { "type": "Pool", "x": -50, "z": 50, "width": 25, "depth": 12 },
    { "type": "Canal", "x": 0, "z": -180, "width": 18, "length": 900 }
  ],
  "infra": [
    { "type": "Road", "mode": "loop", "cx": 0, "cz": 0, "rx": 75, "rz": 80 },
    { "type": "Expressway", "x": 0, "z": 200, "length": 900, "width": 30 },
    { "type": "Dock", "x": 180, "z": -45, "length": 60 },
    { "type": "Boardwalk", "x": 150, "z": 0, "length": 200 },
    { "type": "Bridge", "x": 100, "z": 0, "span": 60 },
    { "type": "Parking", "x": -150, "z": -100, "rows": 3, "cols": 8 }
  ]
}
```
