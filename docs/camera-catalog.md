# Camera Catalog — SaBan 3D v1.0

> 6 camera presets chuẩn (proven từ v2). Mỗi góc có use case cụ thể.

---

## 6 Default Views

| ID | Label | Position | Target | Use case |
|:---|:---|:---|:---|:---|
| `aerial_sw` | 🦅 Aerial Tây Nam | [-380, 280, 380] | [-20, 30, 0] | **Cinematic mặc định** — góc rộng đầu tiên BOD nhìn vào |
| `aerial_top` | ⬇ Top Down | [-20, 600, 0.1] | [-20, 0, 0] | **Mặt bằng tổ chức** — show zoning, density |
| `aerial_e` | ⚓ Marina/Đông | [400, 180, 100] | [100, 20, 0] | **Marina pitch** — view marina/sông từ phía Đông |
| `aerial_s` | 🛣 Cao tốc Nam | [0, 220, 500] | [-20, 30, 0] | **Connectivity** — show vị trí relative đường lớn |
| `aerial_se_night` | 🌙 Night Cinematic | [380, 250, 380] | [-20, 30, 0] | **Lifestyle** — auto chuyển time-slider sang 90 (đêm) |
| `ground` | 🚶 Mặt đất | [-30, 8, 0] | [20, 8, 0] | **Walk-through** — cảm giác con người |

---

## Pattern dùng

```js
// Apply ngay (không animate)
SABAN.presets.cameras.apply(stage, 'aerial_sw');

// Animate lerp 1.1s
SABAN.presets.cameras.lerp(stage, 'aerial_top', 1100);

// Đăng ký view custom
SABAN.presets.cameras.register('vip_pool', {
  pos: [-30, 25, 30],
  target: [-30, 5, 30],
  label: '💎 Góc VIP cạnh hồ',
  desc: 'Show penthouse view'
});
```

---

## Best Practices cho Pitch BOD/NĐT

### Sequence khuyến nghị (1-2 phút pitch)

| # | View | Thời lượng | Narration |
|:---:|:---|:---:|:---|
| 1 | `aerial_sw` | 5s | "Tổng thể dự án 3.71 ha với 8 tower 30 tầng..." |
| 2 | `aerial_top` | 5s | "Mặt bằng phân khu — 30% xây, 50% xanh..." |
| 3 | `aerial_e` | 8s | "Marina với 6 cầu tàu và 12 du thuyền..." |
| 4 | `aerial_s` | 5s | "Connectivity với cao tốc DCT..." |
| 5 | `ground` | 5s | "Cảm giác di chuyển giữa cụm tower..." |
| 6 | `aerial_se_night` | 12s | "Night cinematic — dấu ấn thương hiệu..." |

### Custom views nên thêm cho dự án thực

| Tình huống | Custom view đề xuất |
|:---|:---|
| Có biển/hồ hướng X | Pos cao 150-250m, từ phía X nhìn vào |
| Có địa hình đồi | Top-down ở góc 30-45° (không phải 90°) để show contour |
| Có landmark đặc biệt | Ground level ngay sát landmark, target lên trên |
| Có entry gate đẹp | Pos thấp + target hướng entry, mô phỏng "first impression" |

---

## Camera intrinsics defaults

| Param | Value | Lưu ý |
|:---|:---:|:---|
| `fov` | 45° | 45 = wide, 35 = telephoto. Đừng set > 60 (distortion fisheye) |
| `near` | 1m | OK cho sa bàn outdoor. Indoor: 0.1 |
| `far` | 6000m | Đủ cho farLand 2000×2000 |
| `pixelRatio` | min(devicePixelRatio, 2) | Cap 2 để mobile retina không kill FPS |

---

## OrbitControls defaults

| Param | Value | Mô tả |
|:---|:---:|:---|
| `enableDamping` | true | Mượt khi user dừng drag |
| `dampingFactor` | 0.06 | |
| `minDistance` | 30 | Không zoom in vào trong tower |
| `maxDistance` | 1500 | Không zoom out quá xa |
| `maxPolarAngle` | π × 0.495 | Không cho lật xuống dưới đất |
