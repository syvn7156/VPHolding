# Material Catalog — SaBan 3D v1.0

> 5 procedural textures + 11 PBR material presets. Tất cả tạo runtime từ canvas — không cần file ảnh ngoài.

---

## Procedural Textures (5)

| Name | Size | Encoding | Use case |
|:---|:---|:---|:---|
| `wood` | 256 × 1024 | sRGB | Vertical grain — tower fins, dock planks |
| `grass` | 512 × 512 (tiled 40×40) | sRGB | Lawn surface |
| `asphalt` | 256 × 256 | sRGB | Road, parking |
| `sand` | 256 × 256 | sRGB | Beach |
| `waterNormal` | 512 × 512 | linear | Water normal map (animated) |

### Cách lấy
```js
const tex = SABAN.materials.textures.get('grass', { repeat: 40 });
const tex2 = SABAN.materials.textures.wood();  // direct
```

> **Cache:** `tex.get(name, opts)` cache theo `name + JSON(opts)`. Gọi nhiều lần với cùng args → trả về cùng instance.

---

## PBR Material Presets (11)

| Name | Type | metalness | roughness | Use |
|:---|:---|:---:|:---:|:---|
| `greenGlass()` | MeshStandardMaterial | 0.65 | 0.18 | Tower glass, podium glass |
| `woodPanel()` | MeshStandardMaterial + wood map | 0.05 | 0.7 | Tower fins, accent panels |
| `concrete()` | MeshStandardMaterial | 0.05 | 0.85 | Walls, pillars |
| `podium()` | MeshStandardMaterial | 0.1 | 0.7 | Beige/warm base block |
| `grass()` | MeshStandardMaterial + grass map | — | 1.0 | Lawn |
| `asphalt()` | MeshStandardMaterial + asphalt map | — | 0.9 | Road |
| `sand()` | MeshStandardMaterial + sand map | — | 1.0 | Beach |
| `dock()` | MeshStandardMaterial | — | 0.7 | Wood dock |
| `metalFrame()` | MeshStandardMaterial | 0.85 | 0.35 | Window frames, railings |
| `crown()` | MeshStandardMaterial | — | 0.8 | Tower top (dark green) |
| `water()` | **MeshPhongMaterial** + animated normalMap | — | — | Water (avoid THREE.Water!) |

### Tại sao `water()` là MeshPhongMaterial chứ không phải Standard

> **CRITICAL:** THREE.Water (từ Water.js) tạo `WebGLRenderTarget` để cube-map reflection. Trên `file://`, browser chặn vì lý do security origin → toàn bộ scene fail load.
>
> **Workaround:** Dùng `MeshPhongMaterial` + animated `normalMap` (procedural waterNormal). Mất "real reflection" nhưng giữ được visual feel tốt + chạy file:// được.

### Customize
Mọi preset đều nhận `opts` để override:

```js
M.greenGlass({ color: 0xa0d0c4, opacity: 0.6 })
M.woodPanel({ tint: 0xa08868, repeat: [3, 8] })
M.water({ color: 0x4ac4f0, normalScale: 0.2, opacity: 0.85 })
```

---

## Lưu ý kỹ thuật

1. **Encoding:** Các color textures (wood, grass, asphalt, sand) phải `sRGBEncoding`. Normal map giữ `linear` (default).

2. **RepeatWrapping:** Tất cả default đã set `wrapS = wrapT = RepeatWrapping`. Sửa `tex.repeat.set(u, v)` để tile.

3. **Renderer settings cần thiết:**
   ```js
   renderer.toneMapping = THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure = 0.55;
   renderer.outputEncoding = THREE.sRGBEncoding;
   ```

4. **Performance:** 1 material instance shared giữa nhiều mesh. Don't create per-mesh.
