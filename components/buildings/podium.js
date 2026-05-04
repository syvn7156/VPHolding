/* ============================================================
 * SABAN — Podium (đế đa năng — base block cho cụm tower)
 * --------------------------------------------------------------
 * opts: x, z, width, depth, height, color, rotationY
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials;

  window.SABAN.components.Podium = function (opts) {
    opts = opts || {};
    const W = opts.width || 80;
    const D = opts.depth || 50;
    const H = opts.height || 12;

    const g = new T.Group();
    g.userData.type = 'Podium';

    const block = new T.Mesh(
      new T.BoxGeometry(W, H, D),
      M.podium({ color: opts.color })
    );
    block.position.y = H / 2;
    block.castShadow = block.receiveShadow = true;
    g.add(block);

    // Glass top (rooftop landscaping)
    const top = new T.Mesh(
      new T.BoxGeometry(W * 0.95, 0.8, D * 0.95),
      M.greenGlass({ opacity: 0.6, color: 0xb8d4cc })
    );
    top.position.y = H + 0.4;
    g.add(top);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
