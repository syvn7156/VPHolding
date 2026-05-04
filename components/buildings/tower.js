/* ============================================================
 * SABAN — Tower (cao tầng, residential/commercial)
 * --------------------------------------------------------------
 * opts:
 *   x, z          — ground center
 *   floors        — số tầng (default 30)
 *   floorHeight   — chiều cao tầng (default 3.5)
 *   width, depth  — footprint (default 22 × 22)
 *   rotationY     — rad (default 0)
 *   name          — label
 *   glassColor    — hex (default 0x88c4a8 — green glass)
 *   showFins      — bool (default true) — wood vertical fins
 *   showSlabs     — bool (default true) — line slab markers
 *   showPodium    — bool (default true) — base podium block
 *   showCrown     — bool (default true) — rooftop block
 *   nightGlow     — bool (default true) — register for night animation
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, M = window.SABAN.materials, U = window.SABAN.utils;

  window.SABAN.components.Tower = function (opts) {
    opts = opts || {};
    const W = opts.width || 22;
    const D = opts.depth || 22;
    const fh = opts.floorHeight || 3.5;
    const floors = opts.floors || 30;
    const H = floors * fh;
    const showFins = opts.showFins !== false;
    const showSlabs = opts.showSlabs !== false;
    const showPodium = opts.showPodium !== false;
    const showCrown = opts.showCrown !== false;

    const g = new T.Group();
    g.userData.type = 'Tower';
    g.userData.name = opts.name || 'Tower';

    // ---- Glass body ----
    const glassMat = M.greenGlass({ color: opts.glassColor });
    const glass = new T.Mesh(new T.BoxGeometry(W, H, D), glassMat);
    glass.position.y = H / 2;
    glass.castShadow = glass.receiveShadow = true;
    g.add(glass);

    // ---- Floor slab lines ----
    if (showSlabs) {
      const slabMat = new T.LineBasicMaterial({ color: 0x2a3a3a, transparent: true, opacity: 0.4 });
      for (let y = fh; y < H; y += fh) {
        const pts = [
          new T.Vector3(-W / 2, y, -D / 2), new T.Vector3(W / 2, y, -D / 2),
          new T.Vector3(W / 2, y, -D / 2), new T.Vector3(W / 2, y, D / 2),
          new T.Vector3(W / 2, y, D / 2), new T.Vector3(-W / 2, y, D / 2),
          new T.Vector3(-W / 2, y, D / 2), new T.Vector3(-W / 2, y, -D / 2),
        ];
        const lg = new T.BufferGeometry().setFromPoints(pts);
        g.add(new T.LineSegments(lg, slabMat));
      }
    }

    // ---- Wood fins (4 trên mỗi mặt) ----
    if (showFins) {
      const woodMat = M.woodPanel();
      for (let i = 0; i < 4; i++) {
        const xPos = -W / 2 + (i + 0.5) * (W / 4);
        const zPos = -D / 2 + (i + 0.5) * (D / 4);
        const finN = new T.Mesh(new T.BoxGeometry(1.2, H, 1.2), woodMat);
        finN.position.set(xPos, H / 2, -D / 2 - 0.6); finN.castShadow = true; g.add(finN);
        const finS = new T.Mesh(new T.BoxGeometry(1.2, H, 1.2), woodMat);
        finS.position.set(xPos, H / 2, D / 2 + 0.6); finS.castShadow = true; g.add(finS);
        const finE = new T.Mesh(new T.BoxGeometry(1.2, H, 1.2), woodMat);
        finE.position.set(W / 2 + 0.6, H / 2, zPos); finE.castShadow = true; g.add(finE);
        const finW = new T.Mesh(new T.BoxGeometry(1.2, H, 1.2), woodMat);
        finW.position.set(-W / 2 - 0.6, H / 2, zPos); finW.castShadow = true; g.add(finW);
      }
    }

    // ---- Crown (rooftop) ----
    if (showCrown) {
      const crown = new T.Mesh(new T.BoxGeometry(W + 3, 4, D + 3), M.crown());
      crown.position.y = H + 2;
      crown.castShadow = true;
      g.add(crown);
    }

    // ---- Podium (đế) ----
    if (showPodium) {
      const podium = new T.Mesh(new T.BoxGeometry(W + 8, 12, D + 8), M.podium());
      podium.position.y = 6;
      podium.castShadow = podium.receiveShadow = true;
      g.add(podium);
    }

    // ---- Night glow strip ----
    if (opts.nightGlow !== false) {
      const glow = new T.Mesh(
        new T.BoxGeometry(W + 1, H - 10, D + 1),
        new T.MeshBasicMaterial({ color: 0xffd690, transparent: true, opacity: 0 })
      );
      glow.position.y = H / 2 + 5;
      g.add(glow);
      U.markNightGlow(glow, 0.45);
    }

    g.position.set(opts.x || 0, 0, opts.z || 0);
    if (opts.rotationY) g.rotation.y = opts.rotationY;
    return g;
  };
})();
