/* ============================================================
 * SABAN — StreetLamp (cột đèn đường)
 * --------------------------------------------------------------
 * REAL-WORLD DIMENSIONS:
 *   Cột đèn đường tiêu chuẩn (Vietnam):  cao 8m · post Ø 0.15m
 *   Cánh đèn (lamp arm):                 dài 1.5m từ post
 *   Đèn LED head:                        0.5m × 0.2m
 *
 * MODES:
 *   single  — 1 cánh (default, ven đường)
 *   double  — 2 cánh đối xứng (giải phân cách)
 *   square  — 4 cánh tỏa (quảng trường)
 *
 * Tự đăng ký nightGlow — đèn sáng vào đêm (sun.elev < 0).
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, U = window.SABAN.utils;

  window.SABAN.components.StreetLamp = function (opts) {
    opts = opts || {};
    const H = opts.height || 8;
    const armLen = opts.armLength || 1.5;
    const mode = opts.mode || 'single';
    const postColor = opts.postColor || 0x556677;

    const g = new T.Group();
    g.userData.type = 'StreetLamp';
    g.userData.realDim = { H, postRadius: 0.15 };

    // Post (cột)
    const post = new T.Mesh(
      new T.CylinderGeometry(0.13, 0.16, H, 8),
      new T.MeshStandardMaterial({ color: postColor, roughness: 0.55, metalness: 0.5 })
    );
    post.position.y = H / 2;
    post.castShadow = true;
    g.add(post);

    // Base block
    const base = new T.Mesh(
      new T.CylinderGeometry(0.25, 0.32, 0.5, 8),
      new T.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.85 })
    );
    base.position.y = 0.25;
    g.add(base);

    // Build arms + heads
    const armDirs =
      mode === 'double' ? [0, Math.PI] :
      mode === 'square' ? [0, Math.PI / 2, Math.PI, 1.5 * Math.PI] :
      [0];

    const armMat = new T.MeshStandardMaterial({ color: postColor, roughness: 0.55, metalness: 0.5 });
    const headMat = new T.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.8 });
    const lightMat = new T.MeshBasicMaterial({ color: 0xfff3a0, transparent: true, opacity: 0 });

    armDirs.forEach(ang => {
      // Arm (horizontal cylinder)
      const arm = new T.Mesh(
        new T.CylinderGeometry(0.06, 0.06, armLen, 6),
        armMat
      );
      arm.rotation.z = Math.PI / 2;
      arm.position.set(
        Math.cos(ang) * armLen / 2,
        H - 0.3,
        Math.sin(ang) * armLen / 2
      );
      arm.rotation.y = -ang;
      g.add(arm);

      // Head (LED housing)
      const head = new T.Mesh(
        new T.BoxGeometry(0.5, 0.18, 0.25),
        headMat
      );
      head.position.set(
        Math.cos(ang) * armLen,
        H - 0.4,
        Math.sin(ang) * armLen
      );
      head.rotation.y = -ang;
      g.add(head);

      // Light glow plate (under the housing — turns on at night)
      const glow = new T.Mesh(
        new T.BoxGeometry(0.45, 0.04, 0.22),
        lightMat.clone()
      );
      glow.position.set(
        Math.cos(ang) * armLen,
        H - 0.5,
        Math.sin(ang) * armLen
      );
      glow.rotation.y = -ang;
      g.add(glow);
      U.markNightGlow(glow, 0.95);
    });

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };

  // -------------- StreetLampLine — array đặt theo line --------------
  // Ví dụ: SABAN.components.StreetLampLine({ from:[-100,5], to:[100,5], spacing:25, mode:'single' })
  window.SABAN.components.StreetLampLine = function (opts) {
    opts = opts || {};
    const from = opts.from || [0, 0];
    const to = opts.to || [100, 0];
    const spacing = opts.spacing || 25;

    const dx = to[0] - from[0], dz = to[1] - from[1];
    const len = Math.hypot(dx, dz);
    const n = Math.max(2, Math.floor(len / spacing) + 1);
    const ang = Math.atan2(-dz, dx);  // facing perpendicular to line

    const g = new T.Group();
    g.userData.type = 'StreetLampLine';
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const x = from[0] + dx * t;
      const z = from[1] + dz * t;
      const lamp = window.SABAN.components.StreetLamp({
        x, z,
        height: opts.height || 8,
        mode: opts.mode || 'single',
        rotationY: ang + (opts.rotationOffset || 0)
      });
      g.add(lamp);
    }
    return g;
  };
})();
