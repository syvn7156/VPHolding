# Example 01 — Phúc Thịnh Tam Đa (Migration Reference)

> **Source:** `Demo_BOD/masterplan_300ha/masterplan_3d_v2.html` (legacy giữ nguyên)
> **Migrated:** 2026-05-03 by Platform v1.0
> **Mục đích:** Chứng minh platform tái tạo identical scene với code mỏng (JSON 160 dòng + bootstrap 80 dòng) thay vì 895 dòng inline.

---

## So sánh

| Metric | v2 Legacy (inline) | Platform Example | Δ |
|:---|---:|---:|:---:|
| HTML (lines) | 895 | ~120 | **-87%** |
| Geometry/Material code | inline | reusable lib | ♻ |
| Camera presets | inline 6 | preset shared | ♻ |
| Time-of-day logic | inline | preset shared | ♻ |
| Add new tower? | sửa code 60 dòng | 1 entry JSON | 🚀 |

---

## Cách mở

```bash
# Click đúp:
F:\VP_Holding\.platforms\saban-3d\examples\01-phuc-thinh-tam-da\index.html
```

Nếu Chrome chặn `fetch('site.config.json')` từ `file://`:
- Dùng "Open with Live Server" (VS Code extension), hoặc
- Paste nội dung JSON inline vào biến trong `index.html` (xem comment).

---

## Components used

```
8 × Tower         (8 cụm 30 tầng — kính xanh + thanh gỗ)
1 × Clubhouse     (giữa cụm tower)
1 × River         (Sông Tắc, 400×1200)
1 × Lagoon        (hồ giữa cụm)
1 × Canal         (kênh nội bộ, 900×18)
1 × Beach         (bãi cát ven sông)
2 × Road          (strip + loop ring nội bộ)
1 × Expressway    (Cao tốc DCT, 900m, deck 5m)
1 × Boardwalk     (200m ven marina)
6 × Dock          (cầu tàu marina)
12 × Boat/Yacht   (đậu marina)
~62 trees         (InstancedMesh)
18 cars           (animated trên expressway)
```

---

## Verify checklist

- [ ] 8 panels load đúng (info, views, legend, time, stats)
- [ ] 6 camera buttons lerp camera mượt
- [ ] Time slider 0-100 → bầu trời + đèn night-glow chuyển đổi
- [ ] FPS ≥ 30 trên Chrome desktop
- [ ] So sánh visual với `masterplan_3d_v2.html` (legacy) — phải giống
