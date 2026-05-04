/* ============================================================
 * SABAN — Boat (du thuyền nhỏ ven dock)
 * --------------------------------------------------------------
 * opts: x, z, length, color, withCabin (bool)
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials;

  window.SABAN.components.Boat = function (opts) {
    opts = opts || {};
    const L = opts.length || 18;
    const W = L * 0.4;
    const colors = [0xffffff, 0xfff5d0, 0xe8f4ff, 0xffe8e8];
    const color = opts.color || colors[Math.floor(Math.random() * colors.length)];

    const g = new T.Group();
    g.userData.type = 'Boat';

    // Hull
    const hull = new T.Mesh(
      new T.BoxGeometry(W, 2.5, L),
      new T.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.1 })
    );
    hull.position.y = 1.5;
    hull.castShadow = true;
    g.add(hull);

    // Cabin
    if (opts.withCabin !== false) {
      const cabin = new T.Mesh(
        new T.BoxGeometry(W * 0.7, 2, L * 0.4),
        new T.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5 })
      );
      cabin.position.set(0, 3.5, L * 0.05);
      cabin.castShadow = true;
      g.add(cabin);

      // Cabin glass
      const glass = new T.Mesh(
        new T.BoxGeometry(W * 0.65, 1.4, L * 0.42),
        M.greenGlass({ color: 0x88c4d8, opacity: 0.6 })
      );
      glass.position.set(0, 3.6, L * 0.05);
      g.add(glass);
    }

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
