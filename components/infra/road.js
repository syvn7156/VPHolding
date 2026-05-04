/* ============================================================
 * SABAN — Road (đường nội bộ + cao tốc)
 * --------------------------------------------------------------
 * 3 sub-types:
 *
 * 1. Strip (đoạn thẳng): SABAN.components.Road({
 *      type: 'strip', x, z, length, width, rotationY, lanes (bool)
 *    })
 *
 * 2. Loop (vòng kín, oval): SABAN.components.Road({
 *      type: 'loop', cx, cz, rx, rz, width, segments
 *    })
 *
 * 3. Path (đường cong từ điểm): SABAN.components.Road({
 *      type: 'path', points: [[x,z],...], width, closed
 *    })
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials;

  window.SABAN.components.Road = function (opts) {
    opts = opts || {};
    // 'mode' (not 'type') because 'type' is consumed by composer for dispatch.
    const mode = opts.mode || 'strip';
    const g = new T.Group();
    g.userData.type = 'Road';

    if (mode === 'strip') {
      const L = opts.length || 100;
      const W = opts.width || 14;
      const road = new T.Mesh(new T.PlaneGeometry(W, L), M.asphalt());
      road.rotation.x = -Math.PI / 2;
      road.position.set(opts.x || 0, 0.1, opts.z || 0);
      road.receiveShadow = true;
      g.add(road);
      // Lane markings
      if (opts.lanes !== false) {
        const laneMat = M.laneWhite();
        for (let z = -L / 2 + 10; z < L / 2; z += 20) {
          const m = new T.Mesh(new T.PlaneGeometry(0.4, 8), laneMat);
          m.rotation.x = -Math.PI / 2;
          m.position.set(opts.x || 0, 0.15, (opts.z || 0) + z);
          g.add(m);
        }
      }
      if (opts.rotationY) g.rotation.y = opts.rotationY;
    }

    else if (mode === 'loop') {
      const cx = opts.cx || 0, cz = opts.cz || 0;
      const rx = opts.rx || 75, rz = opts.rz || 80;
      const width = opts.width || 4;
      const segments = opts.segments || 64;
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        pts.push(new T.Vector3(cx + rx * Math.cos(a), 0.15, cz + rz * Math.sin(a)));
      }
      const tubeGeom = new T.TubeGeometry(
        new T.CatmullRomCurve3(pts, true), 100, width, 4, true
      );
      const ring = new T.Mesh(tubeGeom, M.asphalt());
      ring.position.y = 0.2;
      ring.receiveShadow = true;
      g.add(ring);
    }

    else if (mode === 'path') {
      const points = opts.points || [];
      const width = opts.width || 4;
      const closed = !!opts.closed;
      if (points.length < 2) return g;
      const v3 = points.map(p => new T.Vector3(p[0], 0.15, p[1]));
      const tubeGeom = new T.TubeGeometry(
        new T.CatmullRomCurve3(v3, closed), Math.max(points.length * 8, 64), width, 4, closed
      );
      const path = new T.Mesh(tubeGeom, M.asphalt());
      path.position.y = 0.2;
      path.receiveShadow = true;
      g.add(path);
    }

    return g;
  };

  // -------------- Expressway (cao tốc trên cao, có pillar) --------------
  window.SABAN.components.Expressway = function (opts) {
    opts = opts || {};
    const L = opts.length || 900;
    const W = opts.width || 30;
    const H = opts.deckHeight || 5;
    const x = opts.x || 0, z = opts.z || 0;
    const pillarStep = opts.pillarStep || 80;
    const dir = opts.direction || 'x';  // 'x' or 'z'

    const g = new T.Group();
    g.userData.type = 'Expressway';

    const sx = dir === 'x' ? L : W;
    const sz = dir === 'x' ? W : L;

    const deck = new T.Mesh(
      new T.BoxGeometry(sx, 4, sz),
      M.asphalt()
    );
    deck.position.set(x, H, z);
    deck.castShadow = deck.receiveShadow = true;
    g.add(deck);

    // Pillars
    const concreteMat = M.concrete();
    const half = (dir === 'x' ? L : L) / 2;
    for (let p = -half; p <= half; p += pillarStep) {
      const pillar = new T.Mesh(
        new T.CylinderGeometry(2.5, 3, H + 1),
        concreteMat
      );
      if (dir === 'x') pillar.position.set(x + p, (H + 1) / 2, z);
      else pillar.position.set(x, (H + 1) / 2, z + p);
      pillar.castShadow = true;
      g.add(pillar);
    }

    // Lane markings on deck top
    const laneMat = M.laneWhite();
    for (let s = -half + 10; s <= half; s += 18) {
      const m1 = new T.Mesh(new T.PlaneGeometry(8, 0.4), laneMat);
      m1.rotation.x = -Math.PI / 2;
      if (dir === 'x') m1.position.set(x + s, H + 2.05, z - 5);
      else m1.position.set(x - 5, H + 2.05, z + s);
      g.add(m1);
      const m2 = new T.Mesh(new T.PlaneGeometry(8, 0.4), laneMat);
      m2.rotation.x = -Math.PI / 2;
      if (dir === 'x') m2.position.set(x + s, H + 2.05, z + 5);
      else m2.position.set(x + 5, H + 2.05, z + s);
      g.add(m2);
    }

    return g;
  };
})();
