/* ============================================================
 * SABAN — Street Furniture (đồ đạc đô thị)
 * --------------------------------------------------------------
 * REAL-WORLD DIMENSIONS:
 *   Bench (ghế đá công viên):       1.6m × 0.5m × 0.45m
 *   TrashBin (thùng rác):           0.4m × 0.4m × 0.9m
 *   Bollard (cọc chặn xe):          Ø 0.15m × 0.9m
 *   Flagpole (cột cờ):              cao 10m, Ø 0.1m + cờ 1.5m × 1m
 *   TrafficLight (đèn giao thông):  cao 5.5m
 *   Pavilion (chòi nghỉ vuông):     4m × 4m × 3m
 *   Fountain (đài phun nước):       Ø 6m, đài cao 0.8m + tia 2m
 *   Sign (biển hiệu):               1.2m × 1.8m × 0.05m, post 2.5m
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, U = window.SABAN.utils, M = window.SABAN.materials;

  // -------------- Bench --------------
  window.SABAN.components.Bench = function (opts) {
    opts = opts || {};
    const L = opts.length || 1.6;

    const g = new T.Group();
    g.userData.type = 'Bench';
    g.userData.realDim = { L, W: 0.5, H: 0.45 };

    const woodMat = new T.MeshStandardMaterial({
      color: opts.color || 0x6e4f2e, roughness: 0.7
    });

    // Seat
    const seat = new T.Mesh(new T.BoxGeometry(L, 0.06, 0.45), woodMat);
    seat.position.y = 0.4;
    seat.castShadow = seat.receiveShadow = true;
    g.add(seat);

    // Backrest
    const back = new T.Mesh(new T.BoxGeometry(L, 0.4, 0.06), woodMat);
    back.position.set(0, 0.6, -0.2);
    back.castShadow = true;
    g.add(back);

    // Legs (metal)
    const legMat = new T.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.7 });
    [-L * 0.4, L * 0.4].forEach(x => {
      const leg = new T.Mesh(new T.BoxGeometry(0.06, 0.4, 0.5), legMat);
      leg.position.set(x, 0.2, 0);
      g.add(leg);
    });

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };

  // -------------- TrashBin --------------
  window.SABAN.components.TrashBin = function (opts) {
    opts = opts || {};
    const W = 0.4, H = 0.9;

    const g = new T.Group();
    g.userData.type = 'TrashBin';
    g.userData.realDim = { W, H };

    const body = new T.Mesh(
      new T.CylinderGeometry(W / 2, W / 2 * 0.85, H, 8),
      new T.MeshStandardMaterial({ color: opts.color || 0x2a4a3a, roughness: 0.7 })
    );
    body.position.y = H / 2;
    body.castShadow = true;
    g.add(body);

    // Lid
    const lid = new T.Mesh(
      new T.CylinderGeometry(W / 2 * 1.05, W / 2 * 1.05, 0.05, 8),
      new T.MeshStandardMaterial({ color: 0x1a2a1a, roughness: 0.6 })
    );
    lid.position.y = H + 0.025;
    g.add(lid);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    return g;
  };

  // -------------- Bollard (cọc chặn xe) --------------
  window.SABAN.components.Bollard = function (opts) {
    opts = opts || {};
    const H = opts.height || 0.9;
    const m = new T.Mesh(
      new T.CylinderGeometry(0.07, 0.075, H, 8),
      new T.MeshStandardMaterial({ color: opts.color || 0xcccccc, roughness: 0.5, metalness: 0.6 })
    );
    m.position.set(opts.x || 0, H / 2, opts.z || 0);
    m.castShadow = true;
    m.userData.type = 'Bollard';
    m.userData.realDim = { H };

    // Reflective stripe
    const stripe = new T.Mesh(
      new T.CylinderGeometry(0.076, 0.076, 0.08, 8),
      new T.MeshBasicMaterial({ color: 0xff3333 })
    );
    stripe.position.set(opts.x || 0, H * 0.85, opts.z || 0);
    const g = new T.Group();
    g.add(m); g.add(stripe);
    g.userData.type = 'Bollard';
    return g;
  };

  // -------------- Flagpole (cột cờ) --------------
  window.SABAN.components.Flagpole = function (opts) {
    opts = opts || {};
    const H = opts.height || 10;
    const flagW = opts.flagWidth || 1.5;
    const flagH = opts.flagHeight || 1.0;

    const g = new T.Group();
    g.userData.type = 'Flagpole';
    g.userData.realDim = { H };

    // Pole
    const pole = new T.Mesh(
      new T.CylinderGeometry(0.06, 0.08, H, 8),
      new T.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4, metalness: 0.6 })
    );
    pole.position.y = H / 2;
    pole.castShadow = true;
    g.add(pole);

    // Base
    const base = new T.Mesh(
      new T.CylinderGeometry(0.3, 0.4, 0.4, 8),
      new T.MeshStandardMaterial({ color: 0x556677, roughness: 0.7 })
    );
    base.position.y = 0.2;
    g.add(base);

    // Flag (Vietnam red with yellow star)
    const flag = new T.Mesh(
      new T.PlaneGeometry(flagW, flagH),
      new T.MeshStandardMaterial({
        color: opts.flagColor || 0xc0102b,
        roughness: 0.85,
        side: T.DoubleSide
      })
    );
    flag.position.set(flagW / 2, H - flagH / 2 - 0.3, 0);
    g.add(flag);

    // Topper
    const topper = new T.Mesh(
      new T.SphereGeometry(0.12, 8, 8),
      new T.MeshStandardMaterial({ color: 0xf2d11a, roughness: 0.3, metalness: 0.7 })
    );
    topper.position.y = H + 0.05;
    g.add(topper);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };

  // -------------- Pavilion (chòi nghỉ) --------------
  window.SABAN.components.Pavilion = function (opts) {
    opts = opts || {};
    const W = opts.width || 4;
    const D = opts.depth || 4;
    const H = opts.height || 3;

    const g = new T.Group();
    g.userData.type = 'Pavilion';
    g.userData.realDim = { W, D, H };

    // 4 columns
    const colMat = new T.MeshStandardMaterial({ color: 0xeeece4, roughness: 0.7 });
    [[-W / 2, -D / 2], [W / 2, -D / 2], [-W / 2, D / 2], [W / 2, D / 2]].forEach(([x, z]) => {
      const col = new T.Mesh(new T.BoxGeometry(0.2, H, 0.2), colMat);
      col.position.set(x, H / 2, z);
      col.castShadow = true;
      g.add(col);
    });

    // Roof (pyramid)
    const roof = new T.Mesh(
      new T.ConeGeometry(Math.max(W, D) * 0.75, 1.2, 4),
      new T.MeshStandardMaterial({ color: opts.roofColor || 0x8a3a2a, roughness: 0.8 })
    );
    roof.position.y = H + 0.6;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    g.add(roof);

    // Floor
    const floor = new T.Mesh(
      new T.BoxGeometry(W, 0.15, D),
      new T.MeshStandardMaterial({ color: 0xc8b888, roughness: 0.85 })
    );
    floor.position.y = 0.075;
    floor.receiveShadow = true;
    g.add(floor);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };

  // -------------- Fountain (đài phun nước) --------------
  window.SABAN.components.Fountain = function (opts) {
    opts = opts || {};
    const R = opts.radius || 3;
    const H = opts.height || 0.8;

    const g = new T.Group();
    g.userData.type = 'Fountain';
    g.userData.realDim = { R, H };

    // Outer ring
    const ring = new T.Mesh(
      new T.CylinderGeometry(R, R, H, 24),
      new T.MeshStandardMaterial({ color: opts.color || 0xc8c4be, roughness: 0.7 })
    );
    ring.position.y = H / 2;
    ring.castShadow = ring.receiveShadow = true;
    g.add(ring);

    // Inner water
    const water = new T.Mesh(
      new T.CircleGeometry(R * 0.85, 24),
      M.water({ color: 0x4ac4f0, normalScale: 0.15, repeat: [2, 2] })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = H + 0.02;
    g.add(water);
    U.markAnimWater(water, { x: 0.005, y: 0.005 });

    // Center pillar + jet (water spire)
    const pillar = new T.Mesh(
      new T.CylinderGeometry(0.25, 0.35, H * 1.4, 12),
      new T.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.6 })
    );
    pillar.position.y = H * 0.8;
    g.add(pillar);

    // Water jet (cone, semi-transparent)
    const jet = new T.Mesh(
      new T.ConeGeometry(0.5, 2.0, 12, 1, true),
      new T.MeshPhongMaterial({
        color: 0x88c4f0, transparent: true, opacity: 0.5,
        side: T.DoubleSide, shininess: 100
      })
    );
    jet.position.y = H * 1.4 + 1.0;
    g.add(jet);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    return g;
  };

  // -------------- TrafficLight (đèn giao thông) --------------
  window.SABAN.components.TrafficLight = function (opts) {
    opts = opts || {};
    const H = opts.height || 5.5;

    const g = new T.Group();
    g.userData.type = 'TrafficLight';
    g.userData.realDim = { H };

    const post = new T.Mesh(
      new T.CylinderGeometry(0.08, 0.1, H, 6),
      new T.MeshStandardMaterial({ color: 0x666666, roughness: 0.6 })
    );
    post.position.y = H / 2;
    post.castShadow = true;
    g.add(post);

    // Horizontal arm
    const arm = new T.Mesh(
      new T.CylinderGeometry(0.06, 0.06, 1.2, 6),
      new T.MeshStandardMaterial({ color: 0x666666 })
    );
    arm.rotation.z = Math.PI / 2;
    arm.position.set(0.5, H - 0.3, 0);
    g.add(arm);

    // Lamp box (3 lights vertical)
    const box = new T.Mesh(
      new T.BoxGeometry(0.3, 0.9, 0.3),
      new T.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.7 })
    );
    box.position.set(1.0, H - 0.5, 0);
    g.add(box);

    // Red, yellow, green lights
    [[0.3, 0xff2222], [0, 0xffaa00], [-0.3, 0x22cc44]].forEach(([y, c]) => {
      const light = new T.Mesh(
        new T.SphereGeometry(0.08, 8, 8),
        new T.MeshBasicMaterial({ color: c })
      );
      light.position.set(1.0, H - 0.5 + y, 0.16);
      g.add(light);
    });

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };

  // -------------- Sign (biển hiệu / báo) --------------
  window.SABAN.components.Sign = function (opts) {
    opts = opts || {};
    const W = opts.width || 1.2;
    const H = opts.height || 1.8;
    const postH = opts.postHeight || 2.5;

    const g = new T.Group();
    g.userData.type = 'Sign';

    const post = new T.Mesh(
      new T.CylinderGeometry(0.05, 0.05, postH, 6),
      new T.MeshStandardMaterial({ color: 0x556677, roughness: 0.6 })
    );
    post.position.y = postH / 2;
    g.add(post);

    const board = new T.Mesh(
      new T.BoxGeometry(W, H, 0.05),
      new T.MeshStandardMaterial({ color: opts.color || 0x4a90c2, roughness: 0.7 })
    );
    board.position.y = postH + H * 0.2;
    board.castShadow = true;
    g.add(board);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
