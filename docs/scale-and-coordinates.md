# Scale & Coordinates — SaBan 3D v1.0

> Quy ước hệ tọa độ + tỷ lệ. **Tuân thủ tuyệt đối** để các sa bàn dùng chung component có cùng kích thước thực tế.

---

## 1. Đơn vị độ dài

> **1 unit = 1 mét.**

| Object | Dimension điển hình |
|:---|:---|
| Tower 30F (chung cư) | 22 × 22 × 105 m |
| Villa 2F | 14 × 12 × 6.6 m |
| Đường nội bộ | rộng 4-8 m |
| Cao tốc 4 làn | rộng 30 m, deck 4-5 m |
| Hồ bơi gia đình | 25 × 12 m |
| Lagoon resort | bán kính 28 m, scale [1.4, 0.7] |
| Sông lớn (Sông Tắc) | rộng 400 m |
| Cây trưởng thành | cao 6-10 m |
| Cầu tàu marina | dài 60 m, rộng 4 m |

---

## 2. Hệ trục

```
        +Y (Up)
         |
         |
         +———— +X (East / Đông)
        /
       /
      +Z (South / Nam)
     ↓
  -Z (North / Bắc)
```

| Trục | Chiều dương | Vị trí trong sa bàn |
|:---:|:---|:---|
| **+X** | Đông (East) | Sang phải khi top-down |
| **-X** | Tây (West) | Sang trái |
| **+Y** | Lên trên (Up) | Cao độ — tower height |
| **-Y** | Xuống dưới (Down) | Underground (hiếm dùng) |
| **+Z** | Nam (South) | Lùi xuống khi top-down |
| **-Z** | Bắc (North) | Lên trên khi top-down |

> **Lưu ý:** Three.js mặc định -Z = forward camera. Để khớp địa lý, gọi -Z = North.

---

## 3. Gốc tọa độ (Origin)

> **Đặt tại tâm hình học (centroid) của site polygon.**

Tại sao:
- Camera presets `[380, 280, 380]` aerial_sw nhìn về `[-20, 30, 0]` đã pre-tuned cho gốc tâm site.
- Boundary polygon có vertices đối xứng quanh `(0, 0)` → dễ visualize.
- Symmetric viewing → mọi phía đều đẹp.

Nếu site không đối xứng:
```js
// Compute centroid before placing site:
const cx = vertices.reduce((s, v) => s + v[0], 0) / vertices.length;
const cz = vertices.reduce((s, v) => s + v[1], 0) / vertices.length;
// Then shift all vertices by (-cx, -cz)
```

---

## 4. Polygon order (CRITICAL)

> **CCW (counter-clockwise) khi nhìn top-down (+Y).**

```
   N (-Z)
   ↑
   ┌─────────┐
   │ NW   NE │
W ←│         │→ E (+X)
   │ SW   SE │
   └─────────┘
   ↓
   S (+Z)
```

CCW order: **SW → SE → NE → NW** (khi nhìn xuống từ trên).

Trong JSON:
```json
"vertices": [
  [-100, 50],   // SW (x = -100, z = +50)
  [ 100, 50],   // SE
  [ 100, -50],  // NE
  [-100, -50]   // NW
]
```

> **Sai trật tự (CW)** → `THREE.ShapeGeometry` sinh normal hướng xuống → ground không nhận shadow → toàn cảnh tối thui.

### Validate
```js
function signedArea(vs) {
  let s = 0;
  for (let i = 0; i < vs.length; i++) {
    const a = vs[i], b = vs[(i + 1) % vs.length];
    s += (b[0] - a[0]) * (b[1] + a[1]);
  }
  return s / 2;
}
// signedArea > 0 → CW (đảo lại)
// signedArea < 0 → CCW (OK)
```

---

## 5. Floor height conventions

| Use case | Height per floor | Note |
|:---|:---:|:---|
| Residential standard | 3.0 m | Nhà ở thông thường |
| Residential premium | 3.3 m | Cao cấp, default platform |
| Commercial/Office | 4.0 m | Office tower |
| Lobby ground floor | 5-8 m | Có thể boost riêng floor 1 |
| Industrial / warehouse | 6-12 m | Tách biệt component |

Tower component default `floorHeight: 3.5` → cluster cao bằng 105m với 30F.

---

## 6. North arrow trong UI

Khi user thấy 2D preview hoặc 3D top-down, **luôn cần** mũi tên Bắc:

```svg
<g transform="translate(120, -180)">
  <line x1="0" y1="0" x2="0" y2="-20" stroke="red" stroke-width="2"/>
  <polygon points="0,-22 -3,-15 3,-15" fill="red"/>
  <text y="-26" font-size="8" text-anchor="middle" fill="red">N</text>
</g>
```

Nếu site có lệch hướng Bắc thật (`northDeg ≠ 0`), rotate cả site geometry hoặc rotate mũi tên Bắc cho khớp.

---

## 7. Common conversion gotchas

| Source data | Convert to platform |
|:---|:---|
| AutoCAD DWG (mm) | × 0.001 → mét |
| Lat/Long (GIS) | Web Mercator → meters offset từ centroid |
| Google Earth screenshot scale | Đo 1 dimension biết chắc → tính px-to-meter ratio |
| Mặt bằng 1/500 (cm trên giấy) | 1 cm = 5 m thực |
| Mặt bằng 1/2000 | 1 cm = 20 m thực |
