/* ============================================================
 * SABAN — Lagoon (hồ tròn / kidney với deck quanh)
 * --------------------------------------------------------------
 * opts: x, z, radius, scale (vec2 [sx,sz] for kidney shape),
 *       color (hex water color), withDeck (bool), deckRingOuter,
 *       flowSpeed { x, y }
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials, U = window.SABAN.utils;

  window.SABAN.components.Lagoon = function (opts) {
    opts = opts || {};
    const r = opts.radius || 28;
    const sx = (opts.scale && opts.scale[0]) || 1.4;
    const sz = (opts.scale && opts.scale[1]) || 0.7;
    const color = opts.color || 0x3aa9d6;

    const g = new T.Group();
    g.userData.type = 'Lagoon';

    // Water surface
    const waterMat = M.water({ color: color, normalScale: 0.3, repeat: [4, 4] });
    const water = new T.Mesh(new T.CircleGeometry(r, 48), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.4;
    water.scale.set(sx, 1, sz);
    g.add(water);
    U.markAnimWater(water, opts.flowSpeed || { x: 0.008, y: 0.012 });

    // Deck ring (sand-colored ring around water)
    if (opts.withDeck !== false) {
      const ringOuter = opts.deckRingOuter || 50;
      const deck = new T.Mesh(
        new T.RingGeometry(r * 0.7, ringOuter, 48),
        new T.MeshStandardMaterial({ color: 0xe8d8b8, roughness: 0.9 })
      );
      deck.rotation.x = -Math.PI / 2;
      deck.position.y = 0.35;
      deck.scale.set(sx, sz / 1.4 * 1, 1);
      deck.receiveShadow = true;
      g.add(deck);
    }

    g.position.set(opts.x || 0, 0, opts.z || 0);
    return g;
  };

  // -------------- Pool (hồ bơi vuông/chữ nhật) --------------
  window.SABAN.components.Pool = function (opts) {
    opts = opts || {};
    const W = opts.width || 25;
    const D = opts.depth || 12;
    const tile = opts.tileColor || 0xe8e0d0;

    const g = new T.Group();
    g.userData.type = 'Pool';

    // Pool deck (tile)
    const deck = new T.Mesh(
      new T.PlaneGeometry(W + 6, D + 6),
      new T.MeshStandardMaterial({ color: tile, roughness: 0.85 })
    );
    deck.rotation.x = -Math.PI / 2;
    deck.position.y = 0.35;
    deck.receiveShadow = true;
    g.add(deck);

    // Water
    const waterMat = M.water({ color: opts.color || 0x4ac4f0, normalScale: 0.18, repeat: [3, 2] });
    const water = new T.Mesh(new T.PlaneGeometry(W, D), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.4;
    g.add(water);
    U.markAnimWater(water, { x: 0.005, y: 0.005 });

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
