/* ============================================================
 * SABAN — Villa (biệt thự đơn lập 2-3 tầng)
 * --------------------------------------------------------------
 * opts: x, z, width, depth, floors, roofType ('flat'|'pitched'),
 *       wallColor, roofColor, rotationY
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials;

  window.SABAN.components.Villa = function (opts) {
    opts = opts || {};
    const W = opts.width || 14;
    const D = opts.depth || 12;
    const floors = opts.floors || 2;
    const fh = 3.3;
    const H = floors * fh;
    const roofType = opts.roofType || 'pitched';

    const g = new T.Group();
    g.userData.type = 'Villa';
    g.userData.name = opts.name || 'Villa';

    // Walls
    const wall = new T.Mesh(
      new T.BoxGeometry(W, H, D),
      new T.MeshStandardMaterial({
        color: opts.wallColor || 0xf2e8d8,
        roughness: 0.85,
        metalness: 0.05
      })
    );
    wall.position.y = H / 2;
    wall.castShadow = wall.receiveShadow = true;
    g.add(wall);

    // Glass strip per floor (front)
    const glass = M.greenGlass({ opacity: 0.6, color: 0xa8d8c8 });
    for (let f = 0; f < floors; f++) {
      const w = new T.Mesh(new T.BoxGeometry(W * 0.8, 1.5, 0.2), glass);
      w.position.set(0, f * fh + 1.8, D / 2 + 0.05);
      g.add(w);
    }

    // Roof
    if (roofType === 'pitched') {
      const roofMat = new T.MeshStandardMaterial({
        color: opts.roofColor || 0x8a3a2a,
        roughness: 0.8
      });
      const roof = new T.Mesh(
        new T.ConeGeometry(Math.max(W, D) * 0.75, 3.5, 4),
        roofMat
      );
      roof.position.y = H + 1.75;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      g.add(roof);
    } else {
      const flatRoof = new T.Mesh(
        new T.BoxGeometry(W + 0.6, 0.4, D + 0.6),
        new T.MeshStandardMaterial({ color: opts.roofColor || 0xa89c88, roughness: 0.85 })
      );
      flatRoof.position.y = H + 0.2;
      flatRoof.castShadow = true;
      g.add(flatRoof);
    }

    // Garden plinth
    const plinth = new T.Mesh(
      new T.BoxGeometry(W + 4, 0.4, D + 4),
      new T.MeshStandardMaterial({ color: 0xe8d8b8, roughness: 0.9 })
    );
    plinth.position.y = 0.2;
    plinth.receiveShadow = true;
    g.add(plinth);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
