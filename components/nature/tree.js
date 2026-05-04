/* ============================================================
 * SABAN — Tree (cây cone+trunk, có 2 mode: single hoặc cluster)
 * --------------------------------------------------------------
 * SINGLE mode (1 cây):
 *   SABAN.components.Tree({ x, z, scale })
 *
 * CLUSTER mode (rừng — InstancedMesh, optimal cho >50 cây):
 *   SABAN.components.TreeCluster({
 *     positions: [[x,z,scale], ...],   // array of [x,z,scale]
 *     trunkColor, leafColor
 *   })
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;

  // Single tree
  window.SABAN.components.Tree = function (opts) {
    opts = opts || {};
    const scale = opts.scale || 1;
    const g = new T.Group();
    g.userData.type = 'Tree';

    const trunk = new T.Mesh(
      new T.CylinderGeometry(0.3, 0.5, 4),
      new T.MeshStandardMaterial({ color: 0x5a3a1f, roughness: 0.9 })
    );
    trunk.position.y = 2 * scale;
    trunk.castShadow = true;
    g.add(trunk);

    const leaves = new T.Mesh(
      new T.ConeGeometry(2.5, 6, 7),
      new T.MeshStandardMaterial({ color: opts.leafColor || 0x3a6a3a, roughness: 0.8 })
    );
    leaves.position.y = 6 * scale;
    leaves.castShadow = true;
    g.add(leaves);

    g.scale.setScalar(scale);
    g.position.set(opts.x || 0, 0, opts.z || 0);
    g.rotation.y = Math.random() * Math.PI * 2;
    return g;
  };

  // Cluster — uses InstancedMesh for performance (1 draw call for all trunks/leaves)
  window.SABAN.components.TreeCluster = function (opts) {
    opts = opts || {};
    const positions = opts.positions || [];
    const n = positions.length;
    if (n === 0) return new T.Group();

    const g = new T.Group();
    g.userData.type = 'TreeCluster';
    g.userData.count = n;

    const trunkGeom = new T.CylinderGeometry(0.3, 0.5, 4);
    const trunkMat = new T.MeshStandardMaterial({
      color: opts.trunkColor || 0x5a3a1f, roughness: 0.9
    });
    const leafGeom = new T.ConeGeometry(2.5, 6, 7);
    const leafMat = new T.MeshStandardMaterial({
      color: opts.leafColor || 0x3a6a3a, roughness: 0.8
    });

    const trunks = new T.InstancedMesh(trunkGeom, trunkMat, n);
    const leaves = new T.InstancedMesh(leafGeom, leafMat, n);
    trunks.castShadow = leaves.castShadow = true;

    const dummy = new T.Object3D();
    for (let i = 0; i < n; i++) {
      const p = positions[i];
      const x = p[0], z = p[1], s = p[2] != null ? p[2] : (0.7 + Math.random() * 0.6);
      dummy.position.set(x, 2 * s, z);
      dummy.scale.setScalar(s);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.updateMatrix();
      trunks.setMatrixAt(i, dummy.matrix);

      dummy.position.y = 6 * s;
      dummy.updateMatrix();
      leaves.setMatrixAt(i, dummy.matrix);
    }
    trunks.instanceMatrix.needsUpdate = true;
    leaves.instanceMatrix.needsUpdate = true;
    g.add(trunks); g.add(leaves);
    return g;
  };
})();
