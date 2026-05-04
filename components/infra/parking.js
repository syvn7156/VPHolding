/* ============================================================
 * SABAN — Parking lot (bãi đỗ xe lộ thiên)
 * --------------------------------------------------------------
 * opts: x, z, rows, cols, slotW (default 2.5), slotL (default 5),
 *       rotationY, withCars (bool — chèn xe demo)
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials;

  window.SABAN.components.Parking = function (opts) {
    opts = opts || {};
    const rows = opts.rows || 3;
    const cols = opts.cols || 8;
    const slotW = opts.slotW || 2.5;
    const slotL = opts.slotL || 5;
    const aisle = opts.aisle || 6;

    const g = new T.Group();
    g.userData.type = 'Parking';

    const totalW = cols * slotW;
    const totalL = rows * slotL + (rows - 1) * aisle;

    // Asphalt base
    const base = new T.Mesh(
      new T.PlaneGeometry(totalW + 4, totalL + 4),
      M.asphalt()
    );
    base.rotation.x = -Math.PI / 2;
    base.position.y = 0.05;
    base.receiveShadow = true;
    g.add(base);

    // Slot dividers (white lines)
    const laneMat = M.laneWhite();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const m = new T.Mesh(new T.PlaneGeometry(0.15, slotL), laneMat);
        m.rotation.x = -Math.PI / 2;
        m.position.set(
          -totalW / 2 + c * slotW,
          0.1,
          -totalL / 2 + r * (slotL + aisle) + slotL / 2
        );
        g.add(m);
      }
    }

    // Demo cars (random fill 60%)
    if (opts.withCars !== false) {
      const carColors = [0xffffff, 0xc0392b, 0x2c3e50, 0x16a085, 0xf39c12, 0x000000, 0x95a5a6];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.6) continue;
          const car = new T.Group();
          const color = carColors[Math.floor(Math.random() * carColors.length)];
          const body = new T.Mesh(
            new T.BoxGeometry(2, 1.2, 4.5),
            new T.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.3 })
          );
          body.position.y = 0.8;
          body.castShadow = true;
          car.add(body);
          const top = new T.Mesh(
            new T.BoxGeometry(1.7, 0.9, 2.5),
            new T.MeshStandardMaterial({ color: color, roughness: 0.4 })
          );
          top.position.y = 1.7;
          car.add(top);
          car.position.set(
            -totalW / 2 + c * slotW + slotW / 2,
            0.1,
            -totalL / 2 + r * (slotL + aisle) + slotL / 2
          );
          g.add(car);
        }
      }
    }

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
