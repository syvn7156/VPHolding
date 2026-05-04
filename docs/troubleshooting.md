# Troubleshooting — SaBan 3D v1.0

> Tất cả lỗi phổ biến + cách fix.

---

## 🔴 File không load — màn hình đen

### Symptoms
- Loading screen vĩnh viễn quay
- DevTools console: `Failed to load script ./lib/three.min.js`

### Fixes

1. **Verify file structure:**
   ```
   index.html
   ../../../.platforms/saban-3d/lib/three.min.js   ← phải tồn tại
   ```

2. **Sửa PLATFORM path:**
   ```js
   // index.html dòng đầu script
   const PLATFORM = '../../../.platforms/saban-3d';
   //                ^ đếm số ../ từ folder chứa index.html về root
   ```

3. **Check CDN fallback:** Nếu local fail, console phải show `⚠ Local failed → trying jsDelivr...`. Nếu KHÔNG hiện → core loader không chạy → check `_core.js` đã load chưa.

---

## 🔴 fetch('site.config.json') CORS error

### Symptom
```
Access to fetch at 'file:///...site.config.json' from origin 'null' has been blocked by CORS
```

### Fixes (chọn 1)

1. **VS Code Live Server extension** (RECOMMENDED):
   - Cài extension "Live Server"
   - Right-click `index.html` → "Open with Live Server"
   - Chrome mở `http://127.0.0.1:5500/...` thay vì `file://` → CORS OK

2. **Inline JSON vào HTML:**
   ```js
   // Trong index.html, sửa:
   const SITE_CONFIG_DEFAULT = { /* paste toàn bộ JSON ở đây */ };
   ```

3. **Chrome flag (NOT RECOMMENDED for production):**
   ```
   chrome.exe --allow-file-access-from-files --user-data-dir="C:\temp"
   ```

---

## 🔴 Scene tối đen / không có shadow

### Symptom
Towers/objects xuất hiện nhưng cảnh tối, không có bóng đổ.

### Fix
1. **Polygon CCW:** Site polygon vertices phải counter-clockwise. Test:
   ```js
   const sa = vertices.reduce((s, v, i, a) => {
     const n = a[(i + 1) % a.length];
     return s + (n[0] - v[0]) * (n[1] + v[1]);
   }, 0) / 2;
   if (sa > 0) console.warn('CW! Reverse vertices.');
   ```

2. **Sun position:** Time slider 0 = midnight (no sun). Set tới 50-70 (noon-afternoon).

3. **Renderer settings:** Check đã có:
   ```js
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   renderer.outputEncoding = THREE.sRGBEncoding;
   ```

---

## 🔴 Water màu xám / không thấy sông

### Symptom
Sông/hồ đáng lẽ phải là màu xanh dương, nhưng hiện màu xám hoặc invisible.

### Fixes

1. **KHÔNG dùng `THREE.Water`:** Composer mặc định dùng `MeshPhongMaterial` (custom). Nếu user customize component dùng `THREE.Water` → fail trên file://.

2. **Y position:** Water default `y: 0.3-0.4`. Nếu y < 0 → ẩn dưới ground.

3. **Normal map repeat:** Nếu `repeat: [1, 1]` → texture stretched, không thấy ripple. Set `[8, 24]` cho river dài.

---

## 🔴 FPS < 20

### Symptoms
Camera laggy khi rotate, time slider giật.

### Fixes (theo độ ưu tiên)

1. **Giảm tree count:** > 800 cây → < 500 (dùng InstancedMesh).
2. **Tắt shadow trên objects nhỏ:** Boats, cars, bushes — không cần `castShadow`.
3. **Cap pixelRatio:**
   ```js
   renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));  // mobile
   ```
4. **Giảm shadow map size:**
   ```js
   sun.shadow.mapSize.set(1024, 1024);  // từ 2048
   ```
5. **Disable transparent objects shadows:**
   ```js
   greenGlass.transparent = true;
   greenGlass.shadowSide = THREE.DoubleSide;
   ```
6. **Nếu vẫn lag:** Tăng `controls.dampingFactor` lên 0.1 (mượt hơn nhưng "trượt" hơn).

---

## 🔴 "Unknown component type"

### Symptom
```
Error: Unknown component type: Tower2
```

### Fix
Kiểm tra spelling. Component names case-sensitive:
- ✅ `Tower`, `Villa`, `Lagoon`, `River`, `TreeCluster`
- ❌ `tower`, `villa`, `lagoon`

Catalog đầy đủ: `docs/component-catalog.md`.

---

## 🔴 Tower nằm ngoài site polygon

### Symptom
Tower xuất hiện trên `farLand` (background) thay vì trong site.

### Fix
Validate: tower (x, z) phải nằm trong polygon. Algorithm point-in-polygon:

```js
function inside(p, vs) {
  let c = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], zi = vs[i][1];
    const xj = vs[j][0], zj = vs[j][1];
    if (((zi > p[1]) !== (zj > p[1])) &&
        (p[0] < (xj - xi) * (p[1] - zi) / (zj - zi) + xi))
      c = !c;
  }
  return c;
}
// Test
inside([tower.x, tower.z], site.vertices);
```

Phase 1 workflow `/biz-saban-blueprint` PHẢI run check này trước khi xuất JSON.

---

## 🔴 Camera không lerp / view button không phản hồi

### Fix
Check: `cameras.js` đã load chưa, view name có trong `SABAN.presets.cameras.views`. Console:
```js
console.log(Object.keys(SABAN.presets.cameras.views));
// ['aerial_sw', 'aerial_top', ...]
```

---

## 🔴 Time slider không thay đổi sky

### Fix
Check event listener đã wire:
```js
refs.timeSlider.addEventListener('input', onTimeChange);
onTimeChange();  // ← gọi 1 lần initial
```

Nếu sky vẫn không đổi → check `sky.create(scene)` đã add Sky vào scene chưa.

---

## 🔴 GLTFLoader báo "decode failed" với asset có Draco

### Symptom
```
GLTFLoader: No DRACOLoader instance provided.
```

### Fix
v1 platform KHÔNG include DRACOLoader. Options:
1. Re-export GLTF từ Blender, tắt Draco compression.
2. Manual load DRACOLoader.js (r128) vào `lib/`, register:
   ```js
   const dracoLoader = new THREE.DRACOLoader();
   dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
   gltfLoader.setDRACOLoader(dracoLoader);
   ```

---

## 🔴 Mobile (iPad/iPhone) — touch không hoạt động

### Fix
OrbitControls hỗ trợ touch sẵn nhưng cần meta viewport:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
```

Mobile nên dùng `pixelRatio` cap thấp hơn:
```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
```

---

## Khi nào báo Anh Phong / dùng workflow mới

| Tình huống | Action |
|:---|:---|
| User báo "tower vị trí sai" | Sửa JSON, refresh Chrome — không cần re-run workflow |
| User upload mặt bằng mới | Run lại `/biz-saban-blueprint` Phase 1 |
| User muốn thêm 1 component mới (ví dụ "thêm sân golf") | **Báo trước** — cần update component catalog (v1.1) |
| User muốn export sang Lumion/Unreal | **Out of scope** — recommend giữ JSON, dùng tool khác |
