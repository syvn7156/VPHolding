/* ============================================================
 * SABAN — Stadium (Sân vận động oval lớn)
 * --------------------------------------------------------------
 * REAL-WORLD DIMENSIONS:
 *   Oval Stadium 50,000 cho:  250m x 200m, cao 30-40m
 *   Mid-size:                  200m x 160m, cao 25m
 *
 * opts: x, z, length, width, height, fieldColor, seatColor, rotationY
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;

  window.SABAN.components.Stadium = function (opts) {
    opts = opts || {};
    const L = opts.length || 200;
    const W = opts.width || 160;
    const H = opts.height || 25;

    const g = new T.Group();
    g.userData.type = 'Stadium';
    g.userData.realDim = { L, W, H };

    // Field (green oval inside)
    const field = new T.Mesh(
      new T.RingGeometry(0, L * 0.4, 48),
      new T.MeshStandardMaterial({ color: opts.fieldColor || 0x3a8a4a, roughness: 0.95 })
    );
    field.rotation.x = -Math.PI / 2;
    field.position.y = 0.1;
    field.scale.set(1.0, 1, W / L);
    field.receiveShadow = true;
    g.add(field);

    // Inner seating ring (lower bowl)
    const seatMat = new T.MeshStandardMaterial({
      color: opts.seatColor || 0xb8a888, roughness: 0.7
    });
    const innerRing = new T.Mesh(
      new T.RingGeometry(L * 0.4, L * 0.46, 48),
      seatMat
    );
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = H * 0.3;
    innerRing.scale.set(1.0, 1, W / L);
    innerRing.castShadow = true; innerRing.receiveShadow = true;
    g.add(innerRing);

    // Mid seating bowl (taller)
    const midRing = new T.Mesh(
      new T.RingGeometry(L * 0.46, L * 0.5, 48),
      seatMat
    );
    midRing.rotation.x = -Math.PI / 2;
    midRing.position.y = H * 0.6;
    midRing.scale.set(1.0, 1, W / L);
    midRing.castShadow = true;
    g.add(midRing);

    // Outer wall (highest, with roof structure)
    const outerWall = new T.Mesh(
      new T.CylinderGeometry(L * 0.5, L * 0.5, H, 48, 1, true),
      new T.MeshStandardMaterial({
        color: 0xffffff, roughness: 0.3, metalness: 0.6,
        side: T.DoubleSide
      })
    );
    outerWall.scale.set(1.0, 1, W / L);
    outerWall.position.y = H / 2;
    outerWall.castShadow = true;
    g.add(outerWall);

    // Roof ring (signature canopy)
    const roof = new T.Mesh(
      new T.RingGeometry(L * 0.42, L * 0.52, 48),
      new T.MeshStandardMaterial({
        color: 0xeeeeee, roughness: 0.2, metalness: 0.7,
        side: T.DoubleSide
      })
    );
    roof.rotation.x = -Math.PI / 2;
    roof.position.y = H + 1;
    roof.scale.set(1.0, 1, W / L);
    roof.castShadow = true;
    g.add(roof);

    // Floodlight pylons (4 corners)
    const pylonMat = new T.MeshStandardMaterial({ color: 0x444444, roughness: 0.6 });
    [[L * 0.45, 0, W * 0.4], [L * 0.45, 0, -W * 0.4],
     [-L * 0.45, 0, W * 0.4], [-L * 0.45, 0, -W * 0.4]].forEach(p => {
      const pylon = new T.Mesh(
        new T.CylinderGeometry(0.3, 0.4, H + 8, 6),
        pylonMat
      );
      pylon.position.set(p[0], (H + 8) / 2, p[2]);
      pylon.castShadow = true;
      g.add(pylon);

      // Light box at top
      const box = new T.Mesh(
        new T.BoxGeometry(2, 1, 2),
        new T.MeshBasicMaterial({ color: 0xffffe0 })
      );
      box.position.set(p[0], H + 8, p[2]);
      g.add(box);
    });

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };

  // -------------- Amphitheater (Khán đài vòng cung Hy Lạp) --------------
  window.SABAN.components.Amphitheater = function (opts) {
    opts = opts || {};
    const outerR = opts.radius || 60;
    const stepCount = opts.steps || 6;
    const stepHeight = 0.8;
    const stepDepth = (outerR - outerR * 0.35) / stepCount;
    const archAngle = opts.archAngle || Math.PI * 1.2;  // 216 degrees arc

    const g = new T.Group();
    g.userData.type = 'Amphitheater';
    g.userData.realDim = { outerR, steps: stepCount };

    const seatMat = new T.MeshStandardMaterial({
      color: opts.color || 0xc8b888, roughness: 0.85
    });

    // Concentric stepped rings (only half-arc, like Greek style)
    for (let i = 0; i < stepCount; i++) {
      const ri = outerR * 0.35 + i * stepDepth;
      const ro = ri + stepDepth * 0.95;
      const ring = new T.Mesh(
        new T.RingGeometry(ri, ro, 32, 1, -archAngle / 2, archAngle),
        seatMat
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = i * stepHeight + 0.05;
      ring.castShadow = true; ring.receiveShadow = true;
      g.add(ring);

      // Step face (vertical riser)
      const riser = new T.Mesh(
        new T.CylinderGeometry(ri, ri, stepHeight, 32, 1, true,
          -archAngle / 2 + Math.PI / 2, archAngle),
        seatMat
      );
      riser.position.y = i * stepHeight + stepHeight / 2;
      g.add(riser);
    }

    // Stage platform (center)
    const stage = new T.Mesh(
      new T.CircleGeometry(outerR * 0.32, 32, -archAngle / 2, archAngle),
      new T.MeshStandardMaterial({ color: 0xe8d8b8, roughness: 0.8 })
    );
    stage.rotation.x = -Math.PI / 2;
    stage.position.y = 0.05;
    stage.receiveShadow = true;
    g.add(stage);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
