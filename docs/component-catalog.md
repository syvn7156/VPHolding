# Component Catalog — SaBan 3D v1.0

> Tham chiếu nhanh 15 components chia 5 nhóm. Mọi component theo signature `SABAN.components.<Name>(opts)` → trả về `THREE.Group`.

---

## 🏢 Buildings (5 components)

### Tower
Cao tầng kính + thanh gỗ. Component chủ lực cho khu đô thị.

| Field | Type | Default | Mô tả |
|:---|:---|:---|:---|
| `x`, `z` | number | 0 | Vị trí ground center |
| `floors` | int | 30 | Số tầng |
| `floorHeight` | number | 3.5 | m/tầng |
| `width`, `depth` | number | 22, 22 | Footprint (m) |
| `glassColor` | hex | 0x88c4a8 | Màu kính (xanh ngọc default) |
| `showFins` | bool | true | 4 thanh gỗ mỗi mặt |
| `showSlabs` | bool | true | Line slab markers (sàn) |
| `showPodium` | bool | true | Khối đế |
| `showCrown` | bool | true | Khối mái |
| `nightGlow` | bool | true | Đăng ký night-mode opacity |
| `name` | string | "Tower" | Label |
| `rotationY` | rad | 0 | |

```json
{ "type": "Tower", "x": 0, "z": 0, "floors": 30, "width": 22, "depth": 22, "name": "T1" }
```

### Villa
Biệt thự đơn lập 2-3 tầng có vườn.

| Field | Default | Mô tả |
|:---|:---|:---|
| `width`, `depth` | 14, 12 | |
| `floors` | 2 | |
| `roofType` | 'pitched' | 'flat' \| 'pitched' (cone 4 cạnh) |
| `wallColor` | 0xf2e8d8 | |
| `roofColor` | 0x8a3a2a | |

### Shophouse
Dãy nhà phố thương mại liền kề.

| Field | Default | Mô tả |
|:---|:---|:---|
| `count` | 5 | Số căn |
| `width` (per unit) | 5 | |
| `depth` | 18 | |
| `floors` | 4 | |
| `facadeColor` | auto palette | 5 màu xoay vòng nếu không set |

### Podium
Khối đế đa năng (base block cho cụm tower).

| Field | Default |
|:---|:---|
| `width`, `depth`, `height` | 80, 50, 12 |

### Clubhouse
Tiện ích trung tâm low-rise.

| Field | Default |
|:---|:---|
| `width`, `depth`, `height` | 50, 24, 8 |
| `dome` | false | Thêm hemisphere kính trên đỉnh |

---

## 🌳 Nature (3 components)

### Tree (single) / TreeCluster
- `Tree`: 1 cây (cone+trunk). Dùng cho < 10 cây.
- `TreeCluster`: InstancedMesh, performance optimal cho > 50 cây.

```json
// Single
{ "type": "Tree", "x": 50, "z": -30, "scale": 1.0 }

// Cluster (RECOMMENDED for forests)
"vegetation": {
  "trees": [[50,-30,1.0], [55,-32,0.9], ...]
}
```

### Bush / BushCluster
Bụi cây tròn low-poly. Chiều cao ~ radius × 0.6.

### Palm
Cây dừa/cọ — phù hợp resort biển. 6-8 fronds tỏa từ trunk.

| Field | Default |
|:---|:---|
| `height` | 8 |
| `fronds` | 7 |
| `leafColor` | 0x4a7a3a |

---

## 🛣️ Infrastructure (5 components)

### Road
3 modes: `strip` (thẳng) · `loop` (vòng kín) · `path` (đường cong từ điểm).

```json
// Strip
{ "type": "Road", "mode": "strip", "x": -180, "z": 0, "length": 800, "width": 14, "lanes": true }

// Loop (oval)
{ "type": "Road", "mode": "loop", "cx": 0, "cz": 0, "rx": 75, "rz": 80, "width": 4 }

// Path
{ "type": "Road", "mode": "path", "points": [[0,0],[50,30],[100,80]], "width": 6 }
```

### Expressway
Cao tốc trên cao có pillar đỡ. `direction: 'x' | 'z'`.

| Field | Default |
|:---|:---|
| `length`, `width`, `deckHeight` | 900, 30, 5 |
| `pillarStep` | 80 |

### Bridge
Cầu bắc qua nước, có railing.

### Dock / Boardwalk
- `Dock`: cầu tàu marina (60×4×0.6 default)
- `Boardwalk`: đường dạo dài ven nước (200×6 default)

### Parking
Bãi đỗ lộ thiên với markings + demo cars.

| Field | Default |
|:---|:---|
| `rows`, `cols` | 3, 8 |
| `slotW`, `slotL` | 2.5, 5 |
| `withCars` | true (60% fill) |

---

## 💧 Water (4 components)

### Lagoon
Hồ tròn / kidney có deck quanh.

| Field | Default |
|:---|:---|
| `radius` | 28 |
| `scale` | [1.4, 0.7] (kidney shape) |
| `color` | 0x3aa9d6 |
| `withDeck` | true |
| `deckRingOuter` | 50 |
| `flowSpeed` | { x: 0.008, y: 0.012 } |

### River
Sông chính. 2 modes:

```json
// Rectangle (sông thẳng)
{ "type": "River", "mode": "rectangle", "x": 330, "z": 0, "width": 400, "length": 1200,
  "color": 0x1a4a6a, "normalRepeat": [8, 24], "flowSpeed": { "x": 0.015, "y": 0.005 } }

// Path (sông uốn cong)
{ "type": "River", "mode": "path", "points": [[0,0],[100,50],[200,150]], "width": 30 }
```

### Canal
Kênh thẳng nhỏ (alias rectangle với defaults nhỏ hơn).

### Pool
Hồ bơi hình chữ nhật, có tile deck.

---

## 🚤 Vehicles (6 components — v1.1 expanded)

### Boat / Yacht (water)
- `Boat`: du thuyền nhỏ ~18m, có cabin optional
- `Yacht`: du thuyền cao cấp 25-40m, decks: 1|2|3 stacked

### Car / SUV / Bus / Minibus / Truck / Motorbike (land — v1.1)
Tất cả mặc định **kích thước thực tế VN** (xem `dimensions-real-world.md`):

| Type | Real-world dim | Reference |
|:---|:---:|:---|
| `Car` | 4.5 × 1.8 × 1.5 m | Toyota Vios, Honda City |
| `SUV` | 4.8 × 2.0 × 1.8 m | Fortuner, CRV |
| `Bus` | 12 × 2.5 × 3.2 m | Bus 45 chỗ Phenikaa-Citadel |
| `Minibus` | 7 × 2.2 × 2.7 m | Ford Transit 16 chỗ |
| `Truck` | 6 × 2.2 × 2.5 m | Hyundai Porter |
| `Motorbike` | 2.0 × 0.7 × 1.1 m | Honda Wave Alpha |

```json
{ "type": "Car",       "x": 100, "z": 50, "rotationY": 0, "color": "0xc0392b" }
{ "type": "Bus",       "x": -200, "z": 195, "rotationY": 0 }
{ "type": "Motorbike", "x": -50, "z": -20, "color": "0xc0392b" }
```

---

## 🪑 Street Furniture (8 components — v1.1 NEW)

| Component | Real-world dim | Use case |
|:---|:---:|:---|
| `StreetLamp` | Cao 8m, post Ø 0.15m | Cột đèn đường — modes: 'single'/'double'/'square' |
| `StreetLampLine` | (line array) | Auto-place dọc đường: `from`, `to`, `spacing` |
| `TrafficLight` | Cao 5.5m | Đèn giao thông |
| `Bench` | 1.6m × 0.5m × 0.45m | Ghế đá công viên |
| `TrashBin` | Ø 0.4m × 0.9m | Thùng rác công cộng |
| `Bollard` | Ø 0.15m × 0.9m | Cọc chặn xe |
| `Flagpole` | Cao 10m, cờ 1.5×1m | Cột cờ |
| `Pavilion` | 4 × 4 × 3m | Chòi nghỉ |
| `Fountain` | Ø 6m × 0.8m + tia 2m | Đài phun nước |
| `Sign` | Board 1.2 × 1.8m | Biển hiệu / billboard nhỏ |

```json
"streetFurniture": [
  { "type": "StreetLampLine", "from": [-200, 195], "to": [200, 195], "spacing": 25, "mode": "single" },
  { "type": "Fountain", "x": 0, "z": 0, "radius": 4 },
  { "type": "Bench", "x": 30, "z": 5, "rotationY": 0 },
  { "type": "Flagpole", "x": -100, "z": -90, "height": 12 }
]
```

---

## 🌳 Tree Variants (v1.1 — đa dạng cây xanh)

| Component | Real height | Canopy | VN species |
|:---|:---:|:---:|:---|
| `BigTree` / `BigTreeCluster` | 14m, trunk Ø 0.6m | 8-10m | Xà cừ, đa, sấu cổ thụ |
| `Tree` / `TreeCluster` | 6-9m | 5m | Phượng, bằng lăng |
| `SmallTree` / `SmallTreeCluster` | 2.5-4m | 2m | Hoa giấy, lộc vừng |
| `TallPalm` | 12-15m | — | Cọ dầu, cau lá nhung |
| `Palm` | 8m | — | Cau vua |
| `ShortPalm` | 4-6m | — | Cau Hawaii, dừa lùn |
| `Hedge` | 1.2m × tùy length | — | Mây Tàu, hoa râm bụt |

```json
"vegetation": {
  "trees":      [[x,z,scale], ...],     // medium (current Tree)
  "bigTrees":   [[x,z,scale], ...],     // 14m cổ thụ
  "smallTrees": [[x,z,scale], ...],     // 3m cảnh
  "tallPalms":  [{ "x": .., "z": ..}, ...],
  "shortPalms": [{ "x": .., "z": ..}, ...],
  "palms":      [{ "x": .., "z": ..}, ...],
  "bushes":     [[x,z,radius], ...],
  "hedges":     [{ "from": [x1,z1], "to": [x2,z2], "height": 1.2 }, ...]
}
```

---

## ⚙️ Special (đã built-in vào composer)

### `vegetation.trees / bushes`
Khi truyền array `[[x,z,scale], ...]`, composer tự dùng `TreeCluster` (InstancedMesh).

### `animatedCars`
Xe hơi chạy lặp trên expressway (dùng `SABAN.utils.registerUpdater`).

```json
"animatedCars": {
  "count": 18,
  "y": 7.1,
  "xRange": [-460, 460],
  "zLanes": [195, 205]
}
```

### `cameras` (custom)
Đăng ký thêm view ngoài 6 góc chuẩn.

```json
"cameras": [
  { "id": "vip_corner", "pos": [200,150,200], "target": [0,30,0], "label": "💎 Góc VIP" }
],
"ui": { "views": ["aerial_sw", ..., "vip_corner"] }
```

---

## Reference example
Xem `examples/01-phuc-thinh-tam-da/site.config.json` để có config thực tế đầy đủ.
