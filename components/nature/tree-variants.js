/* ============================================================
 * SABAN — Tree Variants (đa dạng cây xanh)
 * --------------------------------------------------------------
 * REAL-WORLD DIMENSIONS:
 *   BigTree (cây cổ thụ — xà cừ, đa, sấu trưởng thành):
 *     Tổng cao: 12-15m · Tán: Ø 8-10m · Trunk Ø 0.6m
 *   MediumTree (current Tree — phượng, bằng lăng):
 *     Tổng cao: 6-9m · Tán: Ø 5m · Trunk Ø 0.3m
 *   SmallTree (cây cảnh — hoa giấy, lộc vừng):
 *     Tổng cao: 2.5-4m · Tán: Ø 2m
 *   TallPalm (cọ cao):                  cao 12-15m
 *   ShortPalm (dừa cảnh / cau Hawaii):  cao 4-6m
 *   Hedge (hàng rào cây):               cao 1.2m, dài tùy
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;

  // -------------- BigTree (cây cổ thụ) --------------
  // Multi-layer foliage (3 spheres) cho tán dày, realistic
  window.SABAN.components.BigTree = function (opts) {
    opts = opts || {};
    const H = opts.height || 14;
    const trunkR = opts.trunkRadius || 0.4;
    const canopyR = opts.canopyRadius || 4.5;

    const g = new T.Group();
    g.userData.type = 'BigTree';
    g.userData.realDim = { H, canopyR };

    // Trunk
    const trunk = new T.Mesh(
      new T.CylinderGeometry(trunkR * 0.7, trunkR, H * 0.55, 8),
      new T.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.95 })
    );
    trunk.position.y = H * 0.275;
    trunk.castShadow = true;
    g.add(trunk);

    // Canopy — 3 overlapping spheres for fluffy look
    const leafColor = opts.leafColor || 0x2e5a2a;
    const leafMat = new T.MeshStandardMaterial({ color: leafColor, roughness: 0.85 });
    const layers = [
      { r: canopyR * 1.0, y: H * 0.55, scale: [1.0, 0.85, 1.0] },
      { r: canopyR * 0.85, y: H * 0.75, scale: [1.1, 0.95, 1.05] },
      { r: canopyR * 0.65, y: H * 0.92, scale: [0.9, 1.0, 0.9] }
    ];
    layers.forEach(l => {
      const sph = new T.Mesh(
        new T.SphereGeometry(l.r, 12, 8),
        leafMat
      );
      sph.position.y = l.y;
      sph.scale.set(l.scale[0], l.scale[1], l.scale[2]);
      sph.castShadow = true;
      g.add(sph);
    });

    g.scale.setScalar(opts.scale || 1);
    g.position.set(opts.x || 0, 0, opts.z || 0);
    g.rotation.y = Math.random() * Math.PI * 2;
    return g;
  };

  // -------------- BigTreeCluster (InstancedMesh-based) --------------
  // Note: multi-layer canopy không dễ instance — dùng group of instanced bases
  window.SABAN.components.BigTreeCluster = function (opts) {
    opts = opts || {};
    const positions = opts.positions || [];
    const g = new T.Group();
    g.userData.type = 'BigTreeCluster';
    g.userData.count = positions.length;

    positions.forEach(p => {
      const tree = window.SABAN.components.BigTree({
        x: p[0], z: p[1],
        scale: p[2] != null ? p[2] : (0.85 + Math.random() * 0.3),
        leafColor: opts.leafColor
      });
      g.add(tree);
    });
    return g;
  };

  // -------------- SmallTree (cây cảnh thấp) --------------
  window.SABAN.components.SmallTree = function (opts) {
    opts = opts || {};
    const H = opts.height || 3.5;
    const canopyR = opts.canopyRadius || 1.2;

    const g = new T.Group();
    g.userData.type = 'SmallTree';
    g.userData.realDim = { H, canopyR };

    // Trunk
    const trunk = new T.Mesh(
      new T.CylinderGeometry(0.08, 0.12, H * 0.4, 6),
      new T.MeshStandardMaterial({ color: 0x6e4f2e, roughness: 0.9 })
    );
    trunk.position.y = H * 0.2;
    trunk.castShadow = true;
    g.add(trunk);

    // Canopy — single sphere
    const leaf = new T.Mesh(
      new T.SphereGeometry(canopyR, 10, 6),
      new T.MeshStandardMaterial({
        color: opts.leafColor || 0x7aa84a,
        roughness: 0.8
      })
    );
    leaf.position.y = H * 0.6;
    leaf.scale.set(1, 1.15, 1);
    leaf.castShadow = true;
    g.add(leaf);

    g.scale.setScalar(opts.scale || 1);
    g.position.set(opts.x || 0, 0, opts.z || 0);
    g.rotation.y = Math.random() * Math.PI * 2;
    return g;
  };

  // -------------- SmallTreeCluster --------------
  window.SABAN.components.SmallTreeCluster = function (opts) {
    opts = opts || {};
    const positions = opts.positions || [];
    const g = new T.Group();
    g.userData.type = 'SmallTreeCluster';
    g.userData.count = positions.length;
    positions.forEach(p => {
      g.add(window.SABAN.components.SmallTree({
        x: p[0], z: p[1],
        scale: p[2] != null ? p[2] : (0.8 + Math.random() * 0.4),
        leafColor: opts.leafColor
      }));
    });
    return g;
  };

  // -------------- TallPalm (cọ cao) --------------
  window.SABAN.components.TallPalm = function (opts) {
    opts = opts || {};
    return window.SABAN.components.Palm(Object.assign({
      height: 14, fronds: 8
    }, opts));
  };

  // -------------- ShortPalm (cau Hawaii / dừa cảnh) --------------
  window.SABAN.components.ShortPalm = function (opts) {
    opts = opts || {};
    return window.SABAN.components.Palm(Object.assign({
      height: 4.5, fronds: 6
    }, opts));
  };

  // -------------- Hedge (hàng rào cây) --------------
  // Đặt theo line giống StreetLampLine
  window.SABAN.components.Hedge = function (opts) {
    opts = opts || {};
    const from = opts.from || [-10, 0];
    const to = opts.to || [10, 0];
    const H = opts.height || 1.2;
    const W = opts.thickness || 0.4;

    const dx = to[0] - from[0], dz = to[1] - from[1];
    const len = Math.hypot(dx, dz);
    const cx = (from[0] + to[0]) / 2;
    const cz = (from[1] + to[1]) / 2;
    const ang = Math.atan2(-dz, dx);

    const g = new T.Group();
    g.userData.type = 'Hedge';
    g.userData.realDim = { L: len, H, W };

    // Solid hedge body (slightly bumpy via small overlapping segments)
    const segCount = Math.max(2, Math.floor(len / 1.0));
    const segLen = len / segCount;
    const baseMat = new T.MeshStandardMaterial({
      color: opts.color || 0x4a7a3a,
      roughness: 0.9
    });
    for (let i = 0; i < segCount; i++) {
      const t = (i + 0.5) / segCount - 0.5;
      const seg = new T.Mesh(
        new T.BoxGeometry(segLen * 1.05, H, W),
        baseMat
      );
      seg.position.set(t * len, H / 2, 0);
      seg.scale.y = 0.95 + Math.random() * 0.1;
      seg.castShadow = seg.receiveShadow = true;
      g.add(seg);
    }

    g.position.set(cx, 0, cz);
    g.rotation.y = -ang;
    return g;
  };
})();
