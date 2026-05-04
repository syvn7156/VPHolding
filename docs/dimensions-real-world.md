# Real-World Dimensions — SaBan 3D v1.1

> **Quy tắc:** Mọi component dùng kích thước thực tế Việt Nam (VN real-world dimensions). 1 unit = 1 mét. Khi không spec, dùng default theo bảng dưới.

---

## 🚗 Vehicles (Phương tiện)

| Component | VN dim | EN dim | Tham chiếu thực tế (Real-world reference) |
|:---|:---:|:---:|:---|
| `Car` | Dài 4.5m × Rộng 1.8m × Cao 1.5m | 4.5×1.8×1.5 m | Toyota Vios, Honda City, Mazda 3 |
| `SUV` | Dài 4.8m × Rộng 2.0m × Cao 1.8m | 4.8×2.0×1.8 m | Toyota Fortuner, Honda CRV, Hyundai Santa Fe |
| `Bus` | Dài 12m × Rộng 2.5m × Cao 3.2m | 12×2.5×3.2 m | Phenikaa-Citadel BS-Series, Daewoo BS106 (45 chỗ) |
| `Minibus` | Dài 7m × Rộng 2.2m × Cao 2.7m | 7×2.2×2.7 m | Ford Transit, Hyundai Solati (16 chỗ) |
| `Truck` | Dài 6m × Rộng 2.2m × Cao 2.5m | 6×2.2×2.5 m | Hyundai Porter, Hino XZU (xe tải nhẹ 2-3 tấn) |
| `Motorbike` | Dài 2.0m × Rộng 0.7m × Cao 1.1m | 2.0×0.7×1.1 m | Honda Wave Alpha, Yamaha Sirius |
| `Boat` | Dài 18m | 18 m | Du thuyền cá nhân nhỏ |
| `Yacht` | Dài 28m | 28 m | Du thuyền cao cấp 2-deck |

---

## 🏢 Buildings (Công trình)

| Component | VN dim (default) | Per-floor | Tham chiếu |
|:---|:---:|:---:|:---|
| `Tower` (chung cư) | 22m × 22m × 30 tầng = ~105m cao | 3.5 m/tầng | Mỗi tầng cao chuẩn cao cấp |
| `Tower` (office) | 30m × 30m | 4.0 m/tầng | Văn phòng hạng A |
| `Villa` (biệt thự đơn lập) | 14m × 12m × 2 tầng = ~6.6m | 3.3 m/tầng | Biệt thự 200-300m² đất |
| `Shophouse` (nhà phố) | 5m × 18m × 4 tầng × 5 căn | 3.5 m/tầng | Nhà phố thương mại tiêu chuẩn |
| `Podium` | 80m × 50m × 12m | — | Đế cụm tower mixed-use |
| `Clubhouse` | 50m × 24m × 8m | — | Tiện ích trung tâm resort |

---

## 🌳 Vegetation (Cây xanh)

| Component | VN dim | Tán (canopy) | Loài thực tế (VN species) |
|:---|:---:|:---:|:---|
| `BigTree` | Cao 14m, trunk Ø 0.6m | Tán Ø 8-10m | Xà cừ, đa, sấu, cây cổ thụ phượng già |
| `Tree` (medium) | Cao 6-9m | Tán Ø 5m | Phượng vĩ, bằng lăng, hoa sữa trẻ |
| `SmallTree` | Cao 2.5-4m | Tán Ø 2m | Hoa giấy, lộc vừng, mai vàng |
| `TallPalm` | Cao 12-15m | — | Cọ dầu, cau lá nhung, cau bụng |
| `Palm` (medium) | Cao 8m | — | Cau vua, dừa cảnh trưởng thành |
| `ShortPalm` | Cao 4-6m | — | Cau Hawaii, dừa lùn |
| `Bush` | Cao 1-1.5m | Ø 1.2-2m | Hoa giấy bonsai, mẫu đơn |
| `Hedge` | Cao 1.2m, dày 0.4m | line | Mây Tàu, hoa râm bụt cắt tỉa |

---

## 🛣️ Infrastructure (Hạ tầng)

| Component | VN dim | Tham chiếu |
|:---|:---:|:---|
| `Road` (strip — đường nội bộ 2 làn) | Rộng 7-8m | Đường khu dân cư |
| `Road` (strip — đường chính 4 làn) | Rộng 14m | Đường nội đô tiêu chuẩn |
| `Expressway` (cao tốc) | Rộng 30m, deck cao 5m | DCT Cao Lâm, Cao tốc TPHCM-LT |
| `Bridge` | Span 60m, rộng 8m | Cầu đi bộ trong khu đô thị |
| `Dock` | Dài 60m, rộng 4m | Marina cầu tàu chuẩn |
| `Boardwalk` | Dài 200m, rộng 6m | Đường dạo ven biển/sông |
| `Parking` (1 slot) | 2.5m × 5m | TCVN 4319-2012 |

---

## 🪑 Street Furniture (Đồ đạc đô thị)

| Component | VN dim | EN dim | Tham chiếu |
|:---|:---:|:---:|:---|
| `StreetLamp` | Cao 8m, post Ø 0.15m | 8 m × Ø 0.15 m | Cột đèn LED đường nội đô VN |
| `StreetLamp` (high-mast) | Cao 12-15m | — | Quảng trường, sân golf |
| `TrafficLight` | Cao 5.5m | 5.5 m | Đèn giao thông tiêu chuẩn |
| `Bench` | Dài 1.6m × 0.5m × 0.45m | 1.6×0.5×0.45 m | Ghế đá công viên VN |
| `TrashBin` | Ø 0.4m × cao 0.9m | Ø 0.4 × 0.9 m | Thùng rác công cộng 60L |
| `Bollard` | Ø 0.15m × cao 0.9m | Ø 0.15 × 0.9 m | Cọc chặn xe inox |
| `Flagpole` | Cao 10m, Ø 0.1m + cờ 1.5×1m | 10 m × Ø 0.1 m | Cột cờ cơ quan VN |
| `Pavilion` (chòi nghỉ) | 4m × 4m × 3m cao | 4×4×3 m | Chòi nghỉ công viên |
| `Fountain` | Ø 6m × 0.8m + tia 2m | Ø 6 × 0.8 + 2 m jet | Đài phun nước trung tâm |
| `Sign` (biển hiệu) | 1.2m × 1.8m × 0.05m, post 2.5m | — | Biển báo đô thị, billboard nhỏ |

---

## 💧 Water (Mặt nước)

| Component | VN dim | Tham chiếu |
|:---|:---:|:---|
| `Lagoon` (resort hồ) | Ø 28m + scale [1.4, 0.7] kidney | Hồ trung tâm resort cao cấp |
| `Pool` (hồ bơi gia đình) | 25m × 12m | Pool clubhouse tiêu chuẩn |
| `Pool` (Olympic) | 50m × 25m | Hồ thi đấu chuẩn FINA |
| `River` (sông nhỏ) | Rộng 30-50m | Sông Tô Lịch, kênh nội đô |
| `River` (sông lớn) | Rộng 200-400m | Sông Sài Gòn, sông Hồng |
| `Canal` | Rộng 18m | Kênh tiêu thoát |

---

## 📐 Spacing & Density (Khoảng cách)

| Asset | Spacing chuẩn | Lý do |
|:---|:---:|:---|
| Cột đèn dọc đường (StreetLamp) | 25-30m | Đảm bảo lux trên đường |
| Cột đèn dọc đường nội bộ | 20m | Khu dân cư mật độ cao |
| Cây cổ thụ vỉa hè | 8-10m | Đủ không gian tán phát triển |
| Cây nhỏ trang trí | 3-5m | Cây hoa, cây cảnh |
| Cọc chặn xe (Bollard) | 1.2-1.5m | Chống xe ô tô lọt qua |
| Ghế đá công viên | 15-20m | Đường đi dạo |

---

## ⚠️ Common mistakes (Lỗi thường gặp)

| Lỗi | Cảnh báo |
|:---|:---|
| Tower 22m × 22m nhưng đặt 8m từ nhau | **SAI** — khoảng cách giữa tower phải ≥ 1× chiều cao (tức 100m+). VN: theo TCVN khoảng cách thông thoáng, gió, ánh sáng. |
| Cao tốc 30m nhưng deck 1m | **SAI** — deck phải 4-5m mới qua khỏi tầng trệt và pillar đủ vững |
| Bus 8m × 4m | **SAI** — bus 45 chỗ cố định 12m × 2.5m |
| BigTree đặt cách tường tower 2m | **SAI** — tán cây 8-10m sẽ chạm/vào tower. Cách tường ≥ 6m |
| Marina dock 30m × 6m chỉ 1 cầu | **SAI** — 6 cầu × 60m × 4m mới đủ chỗ neo 12 boats |

---

## 📚 Reference Standards

- **TCVN 4319-2012** — Nhà ở chung cư — Tiêu chuẩn thiết kế
- **QCVN 01:2021/BXD** — Quy chuẩn quy hoạch xây dựng
- **TCVN 5729-2012** — Đường ô tô cao tốc
- **TCVN 4054-2005** — Đường ô tô — Yêu cầu thiết kế
