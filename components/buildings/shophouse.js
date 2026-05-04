/* ============================================================
 * SABAN — Shophouse (nhà phố thương mại 4-5 tầng, dãy)
 * --------------------------------------------------------------
 * opts: x, z, count (số căn liền kề), width (mỗi căn), depth, floors,
 *       facadeColor, rotationY
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials;

  window.SABAN.components.Shophouse = function (opts) {
    opts = opts || {};
    const count = opts.count || 5;
    const W = opts.width || 5;
    const D = opts.depth || 18;
    const floors = opts.floors || 4;
    const fh = 3.5;
    const H = floors * fh;
    const palette = [0xf2dccc, 0xe8d4c0, 0xd8c8b0, 0xeac8a8, 0xf8e8d4];

    const g = new T.Group();
    g.userData.type = 'Shophouse';
    g.userData.name = opts.name || 'Shophouse';

    for (let i = 0; i < count; i++) {
      const u = new T.Group();
      const color = opts.facadeColor || palette[i % palette.length];

      // Facade
      const wall = new T.Mesh(
        new T.BoxGeometry(W, H, D),
        new T.MeshStandardMaterial({ color: color, roughness: 0.8 })
      );
      wall.position.y = H / 2;
      wall.castShadow = wall.receiveShadow = true;
      u.add(wall);

      // Glass storefront (ground floor front)
      const glass = new T.Mesh(
        new T.BoxGeometry(W * 0.85, 3, 0.2),
        M.greenGlass({ opacity: 0.55, color: 0xc4dcd0 })
      );
      glass.position.set(0, 1.6, D / 2 + 0.05);
      u.add(glass);

      // Window strips on upper floors
      for (let f = 1; f < floors; f++) {
        const win = new T.Mesh(
          new T.BoxGeometry(W * 0.7, 1.4, 0.2),
          M.greenGlass({ opacity: 0.5, color: 0xb8d4cc })
        );
        win.position.set(0, f * fh + 1.7, D / 2 + 0.05);
        u.add(win);
      }

      // Awning over storefront
      const awning = new T.Mesh(
        new T.BoxGeometry(W + 0.2, 0.2, 1.4),
        new T.MeshStandardMaterial({ color: 0x6e4f2e, roughness: 0.7 })
      );
      awning.position.set(0, 3.4, D / 2 + 0.7);
      awning.castShadow = true;
      u.add(awning);

      u.position.x = (i - (count - 1) / 2) * W;
      g.add(u);
    }

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
