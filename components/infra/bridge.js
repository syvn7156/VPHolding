/* ============================================================
 * SABAN — Bridge (cầu bắc qua sông/hồ)
 * --------------------------------------------------------------
 * opts: x, z, span (chiều dài), width, deckHeight, rotationY,
 *       railing (bool, default true)
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials;

  window.SABAN.components.Bridge = function (opts) {
    opts = opts || {};
    const span = opts.span || 60;
    const W = opts.width || 8;
    const H = opts.deckHeight || 4;

    const g = new T.Group();
    g.userData.type = 'Bridge';

    // Deck
    const deck = new T.Mesh(
      new T.BoxGeometry(span, 0.6, W),
      M.dock()
    );
    deck.position.y = H;
    deck.castShadow = deck.receiveShadow = true;
    g.add(deck);

    // Pillars (3 pairs)
    const concreteMat = M.concrete();
    for (let p = -span / 3; p <= span / 3; p += span / 3) {
      const pl = new T.Mesh(new T.CylinderGeometry(0.6, 0.8, H), concreteMat);
      pl.position.set(p, H / 2, -W / 2 + 0.5);
      pl.castShadow = true;
      g.add(pl);
      const pr = pl.clone();
      pr.position.z = W / 2 - 0.5;
      g.add(pr);
    }

    // Railings
    if (opts.railing !== false) {
      const railMat = new T.MeshStandardMaterial({ color: 0xa89878, roughness: 0.7 });
      [-1, 1].forEach(side => {
        const rail = new T.Mesh(
          new T.BoxGeometry(span, 0.15, 0.15),
          railMat
        );
        rail.position.set(0, H + 1.1, side * (W / 2 - 0.15));
        g.add(rail);
        // Posts
        for (let p = -span / 2 + 2; p <= span / 2 - 2; p += 4) {
          const post = new T.Mesh(
            new T.BoxGeometry(0.15, 1.1, 0.15),
            railMat
          );
          post.position.set(p, H + 0.55, side * (W / 2 - 0.15));
          g.add(post);
        }
      });
    }

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
