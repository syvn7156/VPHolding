/* ============================================================
 * SABAN — Clubhouse (tiện ích trung tâm: low-rise + glass top)
 * --------------------------------------------------------------
 * opts: x, z, width, depth, height, dome (bool), rotationY
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials;

  window.SABAN.components.Clubhouse = function (opts) {
    opts = opts || {};
    const W = opts.width || 50;
    const D = opts.depth || 24;
    const H = opts.height || 8;

    const g = new T.Group();
    g.userData.type = 'Clubhouse';
    g.userData.name = opts.name || 'Clubhouse';

    // Body
    const body = new T.Mesh(
      new T.BoxGeometry(W, H, D),
      new T.MeshStandardMaterial({ color: opts.color || 0xb8a888, roughness: 0.6 })
    );
    body.position.y = H / 2;
    body.castShadow = body.receiveShadow = true;
    g.add(body);

    // Glass roof strip
    const glassTop = new T.Mesh(
      new T.BoxGeometry(W - 2, 1, D - 2),
      M.greenGlass()
    );
    glassTop.position.y = H + 0.5;
    g.add(glassTop);

    // Optional dome
    if (opts.dome) {
      const dome = new T.Mesh(
        new T.SphereGeometry(D / 3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        M.greenGlass({ opacity: 0.5 })
      );
      dome.position.y = H + 1;
      g.add(dome);
    }

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
