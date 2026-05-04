/* ============================================================
 * SABAN — Dock (cầu tàu marina + boardwalk)
 * --------------------------------------------------------------
 * opts: x, z, length, width, height (above water), planks (bool),
 *       boardwalk (bool — long parallel deck)
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials;

  window.SABAN.components.Dock = function (opts) {
    opts = opts || {};
    const L = opts.length || 60;
    const W = opts.width || 4;
    const H = opts.height || 0.5;

    const g = new T.Group();
    g.userData.type = 'Dock';

    const dock = new T.Mesh(
      new T.BoxGeometry(L, 0.6, W),
      M.dock()
    );
    dock.position.y = H;
    dock.castShadow = dock.receiveShadow = true;
    g.add(dock);

    // Plank texture (visible cross-lines)
    if (opts.planks !== false) {
      const lineMat = new T.LineBasicMaterial({ color: 0x3a2a18, transparent: true, opacity: 0.5 });
      for (let x = -L / 2; x <= L / 2; x += 2) {
        const pts = [
          new T.Vector3(x, H + 0.31, -W / 2),
          new T.Vector3(x, H + 0.31, W / 2)
        ];
        g.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), lineMat));
      }
    }

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };

  // -------------- Boardwalk (đường dạo dài ven nước) --------------
  window.SABAN.components.Boardwalk = function (opts) {
    opts = opts || {};
    const L = opts.length || 200;
    const W = opts.width || 6;
    const H = opts.height || 0.7;

    const g = new T.Group();
    g.userData.type = 'Boardwalk';

    const board = new T.Mesh(
      new T.BoxGeometry(W, 1, L),
      M.dock()
    );
    board.position.y = H;
    board.castShadow = board.receiveShadow = true;
    g.add(board);

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
