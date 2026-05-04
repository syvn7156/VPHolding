/* ============================================================
 * SABAN — Bush (bụi cây tròn, low-poly sphere)
 * --------------------------------------------------------------
 * opts: x, z, radius, color
 * Cluster: SABAN.components.BushCluster({ positions: [[x,z,r],...] })
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;

  window.SABAN.components.Bush = function (opts) {
    opts = opts || {};
    const r = opts.radius || 1.2;
    const m = new T.Mesh(
      new T.SphereGeometry(r, 8, 6),
      new T.MeshStandardMaterial({ color: opts.color || 0x4a8a4a, roughness: 0.9 })
    );
    m.position.set(opts.x || 0, r * 0.6, opts.z || 0);
    m.castShadow = true;
    m.userData.type = 'Bush';
    return m;
  };

  window.SABAN.components.BushCluster = function (opts) {
    opts = opts || {};
    const positions = opts.positions || [];
    const n = positions.length;
    const g = new T.Group();
    g.userData.type = 'BushCluster';
    if (n === 0) return g;

    const geom = new T.SphereGeometry(1, 8, 6);
    const mat = new T.MeshStandardMaterial({
      color: opts.color || 0x4a8a4a, roughness: 0.9
    });
    const inst = new T.InstancedMesh(geom, mat, n);
    inst.castShadow = true;
    const dummy = new T.Object3D();
    for (let i = 0; i < n; i++) {
      const p = positions[i];
      const r = p[2] != null ? p[2] : 1.2;
      dummy.position.set(p[0], r * 0.6, p[1]);
      dummy.scale.setScalar(r);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    g.add(inst);
    return g;
  };
})();
