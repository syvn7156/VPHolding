/* ============================================================
 * SABAN — PBR MATERIAL PRESETS
 * --------------------------------------------------------------
 * 9 named materials. Each fn returns a fresh THREE.Material.
 * Mined from masterplan_3d_v2.html (2026-05-03).
 *
 * USAGE:
 *   const m = SABAN.materials.greenGlass();
 *   const tower = new THREE.Mesh(geom, m);
 * ============================================================ */
(function () {
  'use strict';
  const T = window.THREE;
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const M = window.SABAN.materials;
  const tex = M.textures;

  // -------------- 1. Green tinted glass (cao tầng tower) --------------
  M.greenGlass = function (opts) {
    opts = opts || {};
    return new T.MeshStandardMaterial({
      color: opts.color || 0x88c4a8,
      metalness: opts.metalness != null ? opts.metalness : 0.65,
      roughness: opts.roughness != null ? opts.roughness : 0.18,
      transparent: true,
      opacity: opts.opacity != null ? opts.opacity : 0.78,
      emissive: 0x102218,
      emissiveIntensity: 0.15
    });
  };

  // -------------- 2. Wood panel (gỗ ốp tower fin / dock) --------------
  M.woodPanel = function (opts) {
    opts = opts || {};
    const t = tex.get('wood');
    if (opts.repeat) t.repeat.set(opts.repeat[0], opts.repeat[1]);
    else t.repeat.set(2, 6);
    return new T.MeshStandardMaterial({
      map: t,
      roughness: 0.7,
      metalness: 0.05,
      color: opts.tint || 0xc0a878
    });
  };

  // -------------- 3. Concrete (xám trung tính) --------------
  M.concrete = function (opts) {
    opts = opts || {};
    return new T.MeshStandardMaterial({
      color: opts.color || 0xc8c4be,
      roughness: 0.85,
      metalness: 0.05
    });
  };

  // -------------- 4. Podium (đế tháp, beige ấm) --------------
  M.podium = function (opts) {
    opts = opts || {};
    return new T.MeshStandardMaterial({
      color: opts.color || 0xe8d8b8,
      roughness: 0.7,
      metalness: 0.1
    });
  };

  // -------------- 5. Grass (lawn) --------------
  M.grass = function (opts) {
    opts = opts || {};
    return new T.MeshStandardMaterial({
      map: tex.get('grass', { repeat: opts.repeat || 40 }),
      roughness: 1
    });
  };

  // -------------- 6. Asphalt (đường nội bộ + cao tốc) --------------
  M.asphalt = function () {
    return new T.MeshStandardMaterial({
      map: tex.get('asphalt'),
      roughness: 0.9
    });
  };

  // -------------- 7. Sand (bãi tắm) --------------
  M.sand = function () {
    return new T.MeshStandardMaterial({
      map: tex.get('sand'),
      roughness: 1
    });
  };

  // -------------- 8. Dock (gỗ cầu tàu) --------------
  M.dock = function (opts) {
    opts = opts || {};
    return new T.MeshStandardMaterial({
      color: opts.color || 0x6e4f2e,
      roughness: 0.7
    });
  };

  // -------------- 9. Metal frame (khung kính / lan can) --------------
  M.metalFrame = function (opts) {
    opts = opts || {};
    return new T.MeshStandardMaterial({
      color: opts.color || 0x4a5560,
      roughness: 0.35,
      metalness: 0.85
    });
  };

  // -------------- Water (procedural normal-map fake reflection) --------------
  // PHILOSOPHY: avoid THREE.Water (its WebGLRenderTarget breaks on file://).
  // Use MeshPhongMaterial + animated normal map instead.
  M.water = function (opts) {
    opts = opts || {};
    const normMap = tex.get('waterNormal').clone();
    normMap.needsUpdate = true;
    normMap.wrapS = normMap.wrapT = T.RepeatWrapping;
    if (opts.repeat) normMap.repeat.set(opts.repeat[0], opts.repeat[1]);
    const ns = opts.normalScale != null ? opts.normalScale : 0.4;
    return new T.MeshPhongMaterial({
      color: opts.color || 0x1a4a6a,
      normalMap: normMap,
      normalScale: new T.Vector2(ns, ns),
      shininess: 120,
      specular: 0xffffff,
      transparent: true,
      opacity: opts.opacity != null ? opts.opacity : 0.88,
      side: T.DoubleSide
    });
  };

  // -------------- Lane marking (đường vạch trắng) --------------
  M.laneWhite = function () {
    return new T.MeshBasicMaterial({ color: 0xffffff });
  };

  // -------------- Boat hull (color varies) --------------
  M.boatHull = function (opts) {
    opts = opts || {};
    const colors = [0xffffff, 0xfff5d0, 0xe8f4ff, 0xffe8e8];
    return new T.MeshStandardMaterial({
      color: opts.color || colors[Math.floor(Math.random() * colors.length)],
      roughness: 0.4,
      metalness: 0.1
    });
  };

  // -------------- Crown (top of tower, dark green) --------------
  M.crown = function () {
    return new T.MeshStandardMaterial({ color: 0x4a7a4a, roughness: 0.8 });
  };

})();
