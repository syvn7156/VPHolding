/* ============================================================
 * SABAN — Bus + Minibus (xe buýt + xe khách 16 chỗ)
 * --------------------------------------------------------------
 * REAL-WORLD DIMENSIONS:
 *   Bus (xe buýt 45 chỗ — Phenikaa-Citadel / Daewoo BS106):  12m × 2.5m × 3.2m
 *   Minibus (xe 16 chỗ — Ford Transit / Hyundai Solati):     7m × 2.2m × 2.7m
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;

  // -------------- Bus (xe buýt 45 chỗ) --------------
  window.SABAN.components.Bus = function (opts) {
    opts = opts || {};
    const L = opts.length || 12;
    const W = opts.width || 2.5;
    const H = opts.height || 3.2;
    const palette = [0xfaa61a, 0x4a90c2, 0x2ea84a, 0xc0392b, 0xf2d11a];
    const color = opts.color || palette[Math.floor(Math.random() * palette.length)];

    const g = new T.Group();
    g.userData.type = 'Bus';
    g.userData.realDim = { L, W, H };

    // Body (chassis) — slightly rounded box would be ideal but BoxGeometry OK
    const body = new T.Mesh(
      new T.BoxGeometry(W, H * 0.85, L),
      new T.MeshStandardMaterial({ color: color, roughness: 0.55, metalness: 0.15 })
    );
    body.position.y = H * 0.5;
    body.castShadow = true;
    g.add(body);

    // Roof (slightly recessed darker)
    const roof = new T.Mesh(
      new T.BoxGeometry(W * 0.95, 0.15, L * 0.95),
      new T.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 })
    );
    roof.position.y = H * 0.92;
    g.add(roof);

    // Window strip (band of glass running the length)
    const win = new T.Mesh(
      new T.BoxGeometry(W + 0.02, H * 0.32, L * 0.85),
      new T.MeshPhongMaterial({ color: 0x2a3a3a, transparent: true, opacity: 0.55, shininess: 100 })
    );
    win.position.y = H * 0.65;
    g.add(win);

    // Front windshield
    const front = new T.Mesh(
      new T.BoxGeometry(W * 0.95, H * 0.4, 0.1),
      new T.MeshPhongMaterial({ color: 0x2a3a3a, transparent: true, opacity: 0.55 })
    );
    front.position.set(0, H * 0.6, L / 2 + 0.05);
    g.add(front);

    // Door (right side, behind front wheel)
    const door = new T.Mesh(
      new T.BoxGeometry(0.05, H * 0.7, 1.0),
      new T.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.7 })
    );
    door.position.set(W / 2 + 0.025, H * 0.4, L * 0.25);
    g.add(door);

    // Headlights
    const hlMat = new T.MeshBasicMaterial({ color: 0xffffaa });
    [-W * 0.35, W * 0.35].forEach(x => {
      const hl = new T.Mesh(new T.SphereGeometry(0.18, 8, 8), hlMat);
      hl.position.set(x, H * 0.25, L / 2);
      g.add(hl);
    });

    // Wheels (6 — 2 front, 4 rear dual)
    const wheelMat = new T.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
    const wR = 0.55;
    const wheelPos = [
      [-W / 2, L * 0.35], [W / 2, L * 0.35],          // front
      [-W / 2, -L * 0.3], [W / 2, -L * 0.3],          // rear inner
      [-W / 2, -L * 0.42], [W / 2, -L * 0.42]         // rear outer
    ];
    wheelPos.forEach(([x, z]) => {
      const wheel = new T.Mesh(
        new T.CylinderGeometry(wR, wR, 0.28, 12),
        wheelMat
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, wR, z);
      g.add(wheel);
    });

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };

  // -------------- Minibus (xe 16 chỗ) --------------
  window.SABAN.components.Minibus = function (opts) {
    opts = opts || {};
    const L = opts.length || 7;
    const W = opts.width || 2.2;
    const H = opts.height || 2.7;
    const palette = [0xffffff, 0xeeeeee, 0xc0c0c0, 0x4a90c2];
    const color = opts.color || palette[Math.floor(Math.random() * palette.length)];

    const g = new T.Group();
    g.userData.type = 'Minibus';
    g.userData.realDim = { L, W, H };

    const body = new T.Mesh(
      new T.BoxGeometry(W, H * 0.85, L),
      new T.MeshStandardMaterial({ color: color, roughness: 0.45, metalness: 0.2 })
    );
    body.position.y = H * 0.5 + 0.1;
    body.castShadow = true;
    g.add(body);

    // Window band
    const win = new T.Mesh(
      new T.BoxGeometry(W + 0.02, H * 0.35, L * 0.78),
      new T.MeshPhongMaterial({ color: 0x2a3a3a, transparent: true, opacity: 0.55 })
    );
    win.position.y = H * 0.65 + 0.1;
    g.add(win);

    // Wheels
    const wheelMat = new T.MeshStandardMaterial({ color: 0x1a1a1a });
    const wR = 0.4;
    [[-W / 2, L * 0.3], [W / 2, L * 0.3], [-W / 2, -L * 0.3], [W / 2, -L * 0.3]]
      .forEach(([x, z]) => {
        const wheel = new T.Mesh(new T.CylinderGeometry(wR, wR, 0.22, 12), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, wR, z);
        g.add(wheel);
      });

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
