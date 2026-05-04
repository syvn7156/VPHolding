/* ============================================================
 * SABAN — River (sông / kênh — plane dài + animated normal)
 * --------------------------------------------------------------
 * Mode 'rectangle' (đơn giản): x, z, width, length, rotationY
 * Mode 'path' (uốn cong): points: [[x,z],...], width
 *
 * opts: color, flowSpeed {x,y}, normalRepeat [u,v]
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials, U = window.SABAN.utils;

  window.SABAN.components.River = function (opts) {
    opts = opts || {};
    const mode = opts.mode || 'rectangle';
    const g = new T.Group();
    g.userData.type = 'River';

    if (mode === 'rectangle') {
      const W = opts.width || 400;
      const L = opts.length || 1200;
      const repeat = opts.normalRepeat || [8, 24];
      const waterMat = M.water({
        color: opts.color || 0x1a4a6a,
        normalScale: opts.normalScale || 0.6,
        repeat: repeat,
        opacity: 0.88
      });
      const w = new T.Mesh(new T.PlaneGeometry(W, L), waterMat);
      w.rotation.x = -Math.PI / 2;
      w.position.set(opts.x || 0, opts.y || 0.3, opts.z || 0);
      g.add(w);
      U.markAnimWater(w, opts.flowSpeed || { x: 0.015, y: 0.005 });
      if (opts.rotationY) g.rotation.y = opts.rotationY;
    }

    else if (mode === 'path') {
      // Approximation: build extruded ribbon along path
      const points = opts.points || [];
      if (points.length < 2) return g;
      const W = opts.width || 18;
      const v3 = points.map(p => new T.Vector3(p[0], 0, p[1]));
      const curve = new T.CatmullRomCurve3(v3);
      const tubeGeom = new T.TubeGeometry(curve, points.length * 8, W / 2, 6, false);
      const waterMat = M.water({
        color: opts.color || 0x2a5a4a,
        normalScale: opts.normalScale || 0.3,
        repeat: opts.normalRepeat || [20, 1]
      });
      const w = new T.Mesh(tubeGeom, waterMat);
      w.position.y = 0.25;
      g.add(w);
      U.markAnimWater(w, opts.flowSpeed || { x: 0.03, y: 0 });
    }

    return g;
  };

  // -------------- Canal (đoạn thẳng — alias) --------------
  window.SABAN.components.Canal = function (opts) {
    opts = opts || {};
    const W = opts.width || 18;
    const L = opts.length || 900;

    const g = new T.Group();
    g.userData.type = 'Canal';

    const waterMat = M.water({
      color: opts.color || 0x2a5a4a,
      normalScale: 0.3,
      repeat: opts.normalRepeat || [20, 1]
    });
    const w = new T.Mesh(new T.PlaneGeometry(L, W), waterMat);
    w.rotation.x = -Math.PI / 2;
    w.position.set(opts.x || 0, 0.25, opts.z || 0);
    g.add(w);
    U.markAnimWater(w, opts.flowSpeed || { x: 0.03, y: 0 });

    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
