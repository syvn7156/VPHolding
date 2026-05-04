/* ============================================================
 * SABAN — Yacht (du thuyền cao cấp ~25-40m)
 * --------------------------------------------------------------
 * opts: x, z, length, color, decks (1|2|3), rotationY
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials;

  window.SABAN.components.Yacht = function (opts) {
    opts = opts || {};
    const L = opts.length || 28;
    const W = L * 0.28;
    const decks = opts.decks || 2;
    const color = opts.color || 0xffffff;

    const g = new T.Group();
    g.userData.type = 'Yacht';

    // Hull (slightly tapered)
    const hull = new T.Mesh(
      new T.BoxGeometry(W, 3, L),
      new T.MeshStandardMaterial({ color: color, roughness: 0.3, metalness: 0.2 })
    );
    hull.position.y = 1.8;
    hull.castShadow = true;
    g.add(hull);

    // Bow shape (triangular prow)
    const bow = new T.Mesh(
      new T.ConeGeometry(W * 0.5, L * 0.18, 4),
      new T.MeshStandardMaterial({ color: color, roughness: 0.3, metalness: 0.2 })
    );
    bow.rotation.x = Math.PI / 2;
    bow.rotation.y = Math.PI / 4;
    bow.position.set(0, 1.8, L * 0.5 + L * 0.08);
    bow.castShadow = true;
    g.add(bow);

    // Decks (stacked)
    for (let d = 1; d <= decks; d++) {
      const dW = W * (1 - d * 0.1);
      const dL = L * (0.7 - d * 0.1);
      const deck = new T.Mesh(
        new T.BoxGeometry(dW, 2.2, dL),
        new T.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5 })
      );
      deck.position.set(0, 3.3 + (d - 1) * 2.4, -L * 0.05);
      deck.castShadow = true;
      g.add(deck);

      // Deck glass
      const glass = new T.Mesh(
        new T.BoxGeometry(dW + 0.1, 1.4, dL + 0.1),
        M.greenGlass({ color: 0xa8c4dc, opacity: 0.55 })
      );
      glass.position.set(0, 3.4 + (d - 1) * 2.4, -L * 0.05);
      g.add(glass);
    }

    // Antenna mast
    const mast = new T.Mesh(
      new T.CylinderGeometry(0.05, 0.08, 4),
      new T.MeshStandardMaterial({ color: 0x222222 })
    );
    mast.position.set(0, 3.3 + decks * 2.4 + 2, -L * 0.1);
    g.add(mast);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
