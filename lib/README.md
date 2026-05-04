# Vendor Libraries — Three.js r128

> **Phiên bản cố định (Fixed version):** `three@0.128.0` (r128).
> **Lý do (Why):** Mọi addon (OrbitControls, Sky, Water, GLTFLoader) phải khớp version. Nâng version = phải test lại toàn bộ.
> **KHÔNG dùng ES Module + importmap** — file HTML mở `file://` sẽ chết CORS.

---

## File trong `lib/`

| File | Size | Source | Mục đích |
|:---|---:|:---|:---|
| `three.min.js` | 603 KB | Three.js r128 minified | Core 3D engine |
| `OrbitControls.js` | 26 KB | examples/js/controls/ | Mouse rotate/zoom/pan |
| `Sky.js` | 7 KB | examples/js/objects/ | Hosek-Wilkie sky shader |
| `Water.js` | 11 KB | examples/js/objects/ | Realistic water reflections |
| `GLTFLoader.js` | 96 KB | examples/js/loaders/ | Load `.gltf`/`.glb` 3D assets |

---

## CDN Fallback Chain (load order trong HTML)

Mọi file HTML platform tuân thủ thứ tự sau:

```html
<!-- 1. Local first (fastest, works file://) -->
<script src="../../lib/three.min.js"></script>

<!-- 2. JSDelivr fallback -->
<!-- <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"></script> -->

<!-- 3. Unpkg fallback -->
<!-- <script src="https://unpkg.com/three@0.128.0/build/three.min.js"></script> -->
```

> **Best practice:** Dùng `SABAN.utils.loadScript(url, fallbackUrls[])` từ `components/_core.js` — tự động retry chuỗi CDN.

---

## URLs để re-download nếu corrupt

```bash
# Three core
curl -L https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js -o three.min.js

# Addons (r128)
curl -L https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/js/controls/OrbitControls.js -o OrbitControls.js
curl -L https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/js/objects/Sky.js -o Sky.js
curl -L https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/js/objects/Water.js -o Water.js
curl -L https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/js/loaders/GLTFLoader.js -o GLTFLoader.js
```

---

## ⚠️ Pitfalls đã gặp (Common Pitfalls)

1. **Đừng dùng r142+** — `THREE.CapsuleGeometry` chưa có ở r128, nhưng nếu user copy code mới về sẽ break.
2. **Đừng dùng `import * as THREE from 'three'`** — đó là ES Module syntax, chỉ chạy với bundler hoặc importmap. File:// sẽ chết.
3. **OrbitControls/Sky/Water expose qua `THREE.*`** sau khi load. Pattern: `new THREE.OrbitControls(...)`, không phải `new OrbitControls(...)`.
4. **GLTFLoader không tự decode Draco/KTX2** — nếu asset có Draco compression, phải thêm `DRACOLoader.js` (chưa include v1).
