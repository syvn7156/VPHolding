/* ============================================================
 * SABAN — SCENE COMPOSER (v1.1.1)
 * --------------------------------------------------------------
 * v1.1.1: fix car/bus orientation - body is long along Z, but
 *         movement is along X, so rotate +/-90deg.
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE, U = window.SABAN.utils, M = window.SABAN.materials;

  function compose(stage, sky, lights, cfg) {
    const scene = stage.scene;
    cfg = cfg || {};

    // ---- Site ground (polygon) ----
    if (cfg.site && cfg.site.shape === 'polygon' && cfg.site.vertices) {
      const shape = U.polygonShape(cfg.site.vertices);
      const geom = new T.ShapeGeometry(shape);
      geom.rotateX(-Math.PI / 2);
      const ground = new T.Mesh(geom, M.grass());
      ground.position.y = 0.05;
      ground.receiveShadow = true;
      scene.add(ground);

      if (cfg.site.farLand !== false) {
        const fl = (cfg.site.farLand) || {};
        const farLand = new T.Mesh(
          new T.PlaneGeometry(fl.size || 2000, fl.size || 2000),
          new T.MeshStandardMaterial({ color: fl.color || 0x6a8a52, roughness: 1 })
        );
        farLand.rotation.x = -Math.PI / 2;
        farLand.position.y = -0.1;
        farLand.receiveShadow = true;
        scene.add(farLand);
      }

      const boundary = U.makeBoundary(cfg.site.vertices, cfg.site.boundaryColor || 0xffd166);
      scene.add(boundary);
    }

    // ---- Water ----
    if (cfg.water) cfg.water.forEach(w => scene.add(U.create(w.type, w)));

    // ---- Beach ----
    if (cfg.beach) cfg.beach.forEach(b => {
      const beach = new T.Mesh(
        new T.PlaneGeometry(b.width || 20, b.length || 800),
        M.sand()
      );
      beach.rotation.x = -Math.PI / 2;
      beach.position.set(b.x || 0, 0.2, b.z || 0);
      if (b.rotationY) beach.rotation.z = b.rotationY;
      beach.receiveShadow = true;
      scene.add(beach);
    });

    // ---- Buildings ----
    if (cfg.buildings) cfg.buildings.forEach(b => scene.add(U.create(b.type, b)));

    // ---- Infrastructure ----
    if (cfg.infra) cfg.infra.forEach(i => scene.add(U.create(i.type, i)));

    // ---- Vegetation ----
    if (cfg.vegetation) {
      const v = cfg.vegetation;
      if (v.trees) {
        const positions = Array.isArray(v.trees) ? v.trees : (v.trees.positions || []);
        if (positions.length > 0) scene.add(U.create('TreeCluster', { positions, leafColor: v.trees.leafColor }));
      }
      if (v.bigTrees) {
        const positions = Array.isArray(v.bigTrees) ? v.bigTrees : (v.bigTrees.positions || []);
        if (positions.length > 0) scene.add(U.create('BigTreeCluster', { positions, leafColor: v.bigTrees.leafColor }));
      }
      if (v.smallTrees) {
        const positions = Array.isArray(v.smallTrees) ? v.smallTrees : (v.smallTrees.positions || []);
        if (positions.length > 0) scene.add(U.create('SmallTreeCluster', { positions, leafColor: v.smallTrees.leafColor }));
      }
      if (v.palms) v.palms.forEach(p => scene.add(U.create('Palm', p)));
      if (v.tallPalms) v.tallPalms.forEach(p => scene.add(U.create('TallPalm', p)));
      if (v.shortPalms) v.shortPalms.forEach(p => scene.add(U.create('ShortPalm', p)));
      if (v.bushes) {
        const positions = Array.isArray(v.bushes) ? v.bushes : (v.bushes.positions || []);
        if (positions.length > 0) scene.add(U.create('BushCluster', { positions }));
      }
      if (v.hedges) v.hedges.forEach(h => scene.add(U.create('Hedge', h)));
    }

    // ---- Street furniture ----
    if (cfg.streetFurniture) cfg.streetFurniture.forEach(s => scene.add(U.create(s.type, s)));

    // ---- Vehicles (static) ----
    if (cfg.vehicles) cfg.vehicles.forEach(v => scene.add(U.create(v.type, v)));

    // ---- Animated buses on expressway ----
    // FIX v1.1.1: bus body is long along Z, motion along X -> rotate +/-90deg
    if (cfg.animatedBuses) {
      const buses = [];
      const conf = cfg.animatedBuses;
      const n = conf.count || 4;
      const yLane = conf.y || 7.1;
      const xRange = conf.xRange || [-460, 460];
      const zLanes = conf.zLanes || [197, 203];
      for (let i = 0; i < n; i++) {
        const bus = U.create('Bus', {});
        bus.position.set(
          xRange[0] + Math.random() * (xRange[1] - xRange[0]),
          yLane,
          zLanes[i % zLanes.length]
        );
        bus.userData.speed = 0.5 + Math.random() * 0.3;
        bus.userData.direction = (i % 2 === 0) ? 1 : -1;
        // Nose along +Z by default. Rotate so it faces +X (direction +1) or -X.
        bus.rotation.y = (bus.userData.direction > 0) ? Math.PI / 2 : -Math.PI / 2;
        scene.add(bus);
        buses.push(bus);
      }
      U.registerUpdater(function (dt) {
        for (let i = 0; i < buses.length; i++) {
          const c = buses[i];
          c.position.x += c.userData.speed * c.userData.direction * dt * 12;
          if (c.userData.direction > 0 && c.position.x > xRange[1]) c.position.x = xRange[0];
          if (c.userData.direction < 0 && c.position.x < xRange[0]) c.position.x = xRange[1];
        }
      });
    }

    // ---- Animated cars on expressway ----
    // FIX v1.1.1: car body is long along Z, motion along X -> rotate +/-90deg
    if (cfg.animatedCars) {
      const cars = [];
      const carColors = [0xffffff, 0xc0392b, 0x2c3e50, 0x16a085, 0xf39c12, 0x000000, 0x95a5a6];
      const conf = cfg.animatedCars;
      const n = conf.count || 18;
      const yLane = conf.y || 7.1;
      const xRange = conf.xRange || [-460, 460];
      const zLanes = conf.zLanes || [195, 205];
      for (let i = 0; i < n; i++) {
        const car = makeCar(carColors[i % carColors.length]);
        car.position.set(
          xRange[0] + Math.random() * (xRange[1] - xRange[0]),
          yLane, zLanes[i % zLanes.length]
        );
        car.userData.speed = 0.8 + Math.random() * 0.6;
        car.userData.direction = (i % 2 === 0) ? 1 : -1;
        // Nose along +Z by default. Rotate so it faces +X or -X.
        car.rotation.y = (car.userData.direction > 0) ? Math.PI / 2 : -Math.PI / 2;
        scene.add(car);
        cars.push(car);
      }
      U.registerUpdater(function (dt) {
        for (let i = 0; i < cars.length; i++) {
          const c = cars[i];
          c.position.x += c.userData.speed * c.userData.direction * dt * 12;
          if (c.userData.direction > 0 && c.position.x > xRange[1]) c.position.x = xRange[0];
          if (c.userData.direction < 0 && c.position.x < xRange[0]) c.position.x = xRange[1];
        }
      });
    }

    // ---- Cameras (register custom) ----
    if (cfg.cameras) cfg.cameras.forEach(c => {
      window.SABAN.presets.cameras.register(c.id, {
        pos: c.pos, target: c.target, label: c.label, desc: c.desc, autoNight: c.autoNight
      });
    });
  }

  function makeCar(color) {
    const g = new T.Group();
    const body = new T.Mesh(
      new T.BoxGeometry(2, 1.2, 4.5),
      new T.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.3 })
    );
    body.position.y = 0.8; body.castShadow = true; g.add(body);
    const top = new T.Mesh(
      new T.BoxGeometry(1.7, 0.9, 2.5),
      new T.MeshStandardMaterial({ color: color, roughness: 0.4 })
    );
    top.position.y = 1.7; g.add(top);
    const hl = new T.Mesh(
      new T.SphereGeometry(0.2, 6, 6),
      new T.MeshBasicMaterial({ color: 0xffffaa })
    );
    hl.position.set(0.6, 0.9, 2.2); g.add(hl);
    const hl2 = hl.clone(); hl2.position.x = -0.6; g.add(hl2);
    return g;
  }

  window.SABAN.compose = compose;
})();
