/* ============================================================
 * SABAN — Cars (ô tô con + SUV + xe máy + xe tải nhẹ)
 * --------------------------------------------------------------
 * REAL-WORLD DIMENSIONS (kích thước thực tế):
 *   Car (ô tô con — Toyota Vios/Honda City):  4.5m × 1.8m × 1.5m
 *   SUV (Toyota Fortuner / Honda CRV):         4.8m × 2.0m × 1.8m
 *   Truck (xe tải nhẹ — Hyundai Porter):       6.0m × 2.2m × 2.5m
 *   Motorbike (xe máy phổ thông):              2.0m × 0.7m × 1.1m
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;

  // -------------- Car (ô tô con sedan) --------------
  window.SABAN.components.Car = function (opts) {
    opts = opts || {};
    const colors = [0xffffff, 0xc0392b, 0x2c3e50, 0x16a085, 0xf39c12, 0x000000, 0x95a5a6, 0x34495e];
    const color = opts.color || colors[Math.floor(Math.random() * colors.length)];
    const L = opts.length || 4.5;
    const W = opts.width || 1.8;
    const H = opts.height || 1.5;

    const g = new T.Group();
    g.userData.type = 'Car';
    g.userData.realDim = { L, W, H };

    // Lower body (chassis)
    const body = new T.Mesh(
      new T.BoxGeometry(W, 0.6 * H, L),
      new T.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.3 })
    );
    body.position.y = 0.35 * H;
    body.castShadow = true;
    g.add(body);

    // Cabin (mui xe — slightly narrower)
    const cabin = new T.Mesh(
      new T.BoxGeometry(W * 0.92, 0.45 * H, L * 0.55),
      new T.MeshStandardMaterial({ color: color, roughness: 0.4 })
    );
    cabin.position.set(0, 0.85 * H, -L * 0.05);
    cabin.castShadow = true;
    g.add(cabin);

    // Cabin glass (windshield + windows — green tint)
    const glass = new T.Mesh(
      new T.BoxGeometry(W * 0.93, 0.4 * H, L * 0.56),
      new T.MeshPhongMaterial({
        color: 0x2a3a3a, transparent: true, opacity: 0.5, shininess: 100
      })
    );
    glass.position.set(0, 0.87 * H, -L * 0.05);
    g.add(glass);

    // Headlights
    const hlMat = new T.MeshBasicMaterial({ color: 0xffffaa });
    [-W * 0.3, W * 0.3].forEach(x => {
      const hl = new T.Mesh(new T.SphereGeometry(0.1, 6, 6), hlMat);
      hl.position.set(x, 0.4 * H, L / 2);
      g.add(hl);
    });

    // Wheels (4)
    const wheelMat = new T.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
    const wR = 0.32;
    [[-W / 2, L * 0.35], [W / 2, L * 0.35], [-W / 2, -L * 0.35], [W / 2, -L * 0.35]]
      .forEach(([x, z]) => {
        const wheel = new T.Mesh(
          new T.CylinderGeometry(wR, wR, 0.18, 12),
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

  // -------------- SUV (Toyota Fortuner / Honda CRV) --------------
  window.SABAN.components.SUV = function (opts) {
    opts = opts || {};
    return window.SABAN.components.Car(Object.assign({
      length: 4.8, width: 2.0, height: 1.8
    }, opts));
  };

  // -------------- Truck (xe tải nhẹ — Hyundai Porter / Hino) --------------
  window.SABAN.components.Truck = function (opts) {
    opts = opts || {};
    const L = opts.length || 6.0;
    const W = opts.width || 2.2;
    const H = opts.height || 2.5;
    const colors = [0xffffff, 0x4a90c2, 0xc0392b, 0x556677];
    const cabinColor = opts.color || colors[Math.floor(Math.random() * colors.length)];

    const g = new T.Group();
    g.userData.type = 'Truck';
    g.userData.realDim = { L, W, H };

    // Cabin (1/3 chiều dài, đầu xe)
    const cabin = new T.Mesh(
      new T.BoxGeometry(W, H * 0.75, L * 0.32),
      new T.MeshStandardMaterial({ color: cabinColor, roughness: 0.5, metalness: 0.2 })
    );
    cabin.position.set(0, H * 0.375 + 0.4, L * 0.34);
    cabin.castShadow = true;
    g.add(cabin);

    // Cabin glass
    const glass = new T.Mesh(
      new T.BoxGeometry(W * 0.95, H * 0.4, L * 0.05),
      new T.MeshPhongMaterial({ color: 0x2a3a3a, transparent: true, opacity: 0.55 })
    );
    glass.position.set(0, H * 0.65, L * 0.5);
    g.add(glass);

    // Cargo box (thùng xe)
    const cargo = new T.Mesh(
      new T.BoxGeometry(W * 0.95, H * 0.85, L * 0.6),
      new T.MeshStandardMaterial({ color: opts.cargoColor || 0xc8c4be, roughness: 0.85 })
    );
    cargo.position.set(0, H * 0.425 + 0.4, -L * 0.15);
    cargo.castShadow = true;
    g.add(cargo);

    // Wheels (6 — front 2, rear 4 dual)
    const wheelMat = new T.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
    const wR = 0.45;
    const wheelPos = [
      [-W / 2, L * 0.35], [W / 2, L * 0.35],         // front
      [-W / 2, -L * 0.2], [W / 2, -L * 0.2],         // rear inner
      [-W / 2, -L * 0.35], [W / 2, -L * 0.35]        // rear outer
    ];
    wheelPos.forEach(([x, z]) => {
      const wheel = new T.Mesh(
        new T.CylinderGeometry(wR, wR, 0.22, 12),
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

  // -------------- Motorbike (xe máy phổ thông) --------------
  window.SABAN.components.Motorbike = function (opts) {
    opts = opts || {};
    const L = opts.length || 2.0;
    const colors = [0xc0392b, 0x2c3e50, 0x16a085, 0xf39c12, 0x000000];
    const color = opts.color || colors[Math.floor(Math.random() * colors.length)];

    const g = new T.Group();
    g.userData.type = 'Motorbike';
    g.userData.realDim = { L, W: 0.7, H: 1.1 };

    // Frame
    const frame = new T.Mesh(
      new T.BoxGeometry(0.3, 0.3, L * 0.7),
      new T.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.3 })
    );
    frame.position.y = 0.5;
    g.add(frame);

    // Seat
    const seat = new T.Mesh(
      new T.BoxGeometry(0.35, 0.12, 0.6),
      new T.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })
    );
    seat.position.set(0, 0.7, -0.1);
    g.add(seat);

    // Wheels
    const wheelMat = new T.MeshStandardMaterial({ color: 0x1a1a1a });
    [-L * 0.42, L * 0.42].forEach(z => {
      const w = new T.Mesh(new T.CylinderGeometry(0.32, 0.32, 0.12, 12), wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(0, 0.32, z);
      g.add(w);
    });

    // Handlebar
    const bar = new T.Mesh(
      new T.BoxGeometry(0.6, 0.05, 0.05),
      new T.MeshStandardMaterial({ color: 0x222222 })
    );
    bar.position.set(0, 1.0, L * 0.4);
    g.add(bar);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
