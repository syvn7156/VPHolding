/* ============================================================
 * SABAN — Palm tree (cây dừa/cọ — phù hợp resort biển)
 * --------------------------------------------------------------
 * Mô hình low-poly: trunk cong nhẹ + 6-8 frond (cone bẹt) tỏa ra.
 * opts: x, z, height, fronds, leafColor, rotationY
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;

  window.SABAN.components.Palm = function (opts) {
    opts = opts || {};
    const H = opts.height || 8;
    const fronds = opts.fronds || 7;
    const leafColor = opts.leafColor || 0x4a7a3a;

    const g = new T.Group();
    g.userData.type = 'Palm';

    // Trunk
    const trunk = new T.Mesh(
      new T.CylinderGeometry(0.18, 0.32, H, 8),
      new T.MeshStandardMaterial({ color: 0x6e4f2e, roughness: 0.9 })
    );
    trunk.position.y = H / 2;
    trunk.rotation.z = (Math.random() - 0.5) * 0.1;  // slight lean
    trunk.castShadow = true;
    g.add(trunk);

    // Fronds (8 cones spread radially)
    const frondMat = new T.MeshStandardMaterial({ color: leafColor, roughness: 0.7, side: T.DoubleSide });
    for (let i = 0; i < fronds; i++) {
      const a = (i / fronds) * Math.PI * 2;
      const frond = new T.Mesh(
        new T.ConeGeometry(0.4, 4, 4),
        frondMat
      );
      frond.position.set(Math.cos(a) * 1.5, H + 0.5, Math.sin(a) * 1.5);
      frond.rotation.z = Math.cos(a) * 0.6 + Math.PI / 2;
      frond.rotation.y = -a;
      frond.castShadow = true;
      g.add(frond);
    }

    // Coconut cluster (small)
    if (Math.random() < 0.5) {
      const coco = new T.Mesh(
        new T.SphereGeometry(0.3, 6, 5),
        new T.MeshStandardMaterial({ color: 0x3a2a18 })
      );
      coco.position.y = H - 0.3;
      g.add(coco);
    }

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
