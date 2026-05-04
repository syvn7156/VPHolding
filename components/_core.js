/* ============================================================
 * SABAN 3D PLATFORM — CORE
 * --------------------------------------------------------------
 * Global namespace + helpers + robust CDN loader.
 * NO ES Module. NO importmap. file:// portable.
 * Three.js r128 fixed.
 * ============================================================ */
(function (global) {
  'use strict';

  // -------------- Namespace ---------------
  const SABAN = global.SABAN = global.SABAN || {
    version: '1.0.0',
    components: {},     // { Tower, Villa, Tree, ... }
    materials: {},      // { greenGlass(), woodPanel(), ... }
    presets: {},        // { lighting, cameras, sky }
    utils: {},
    _registry: {        // runtime registry
      animUpdaters: [], // fn(dt, time) called every frame
      nightGlows: [],   // meshes that fade in at night
      animWater: [],    // mesh.userData.flowSpeed
    }
  };

  // -------------- Loader (robust 3-tier CDN) ---------------
  SABAN.utils.LIB_SOURCES = [
    { name: 'Local (./lib/)',    base: './lib' },
    { name: 'jsDelivr CDN',      base: 'https://cdn.jsdelivr.net/npm/three@0.128.0' },
    { name: 'unpkg CDN',          base: 'https://unpkg.com/three@0.128.0' }
  ];

  // local-vs-CDN path mapping
  SABAN.utils.LIB_FILES = [
    { local: '/three.min.js',     cdn: '/build/three.min.js' },
    { local: '/OrbitControls.js', cdn: '/examples/js/controls/OrbitControls.js' },
    { local: '/Water.js',         cdn: '/examples/js/objects/Water.js' },
    { local: '/Sky.js',           cdn: '/examples/js/objects/Sky.js' },
    // GLTFLoader optional — load only if scene needs it (see loadGLTFLoader)
  ];

  SABAN.utils.GLTF_FILE =
    { local: '/GLTFLoader.js', cdn: '/examples/js/loaders/GLTFLoader.js' };

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => resolve(url);
      s.onerror = () => reject(new Error('script load failed: ' + url));
      document.head.appendChild(s);
    });
  }
  SABAN.utils.loadScript = loadScript;

  /**
   * Try local first, then CDN fallback chain.
   * @param {object} file { local, cdn }
   * @param {function} log (msg, cls) — optional logger ('ok'|'err'|'pending')
   * @returns {Promise<string>} source name that succeeded
   */
  async function loadFile(file, log, srcIdx = 0) {
    const sources = SABAN.utils.LIB_SOURCES;
    if (srcIdx >= sources.length) throw new Error('All sources failed for ' + file.local);
    const src = sources[srcIdx];
    const path = (srcIdx === 0) ? file.local : file.cdn;
    const url = src.base + path;
    try {
      await loadScript(url);
      return src.name;
    } catch (e) {
      if (log) log('  ⚠ ' + src.name + ' failed → next source...', 'pending');
      return loadFile(file, log, srcIdx + 1);
    }
  }
  SABAN.utils.loadFile = loadFile;

  /**
   * Load all core libs (three + OrbitControls + Sky + Water).
   * @param {function} log
   * @param {object} opts { gltf: bool — also load GLTFLoader }
   */
  SABAN.utils.loadAll = async function (log, opts) {
    opts = opts || {};
    const files = SABAN.utils.LIB_FILES.slice();
    if (opts.gltf) files.push(SABAN.utils.GLTF_FILE);
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const fname = f.local.replace('/', '');
      if (log) log('[' + (i + 1) + '/' + files.length + '] Loading ' + fname + '...', 'pending');
      try {
        const name = await loadFile(f, log);
        if (log) log('  ✓ Done (' + name + ')', 'ok');
      } catch (e) {
        if (log) log('  ✗ FAILED to load ' + fname, 'err');
        throw e;
      }
    }
    if (log) log('✓ All libraries ready.', 'ok');
  };

  // -------------- Math helpers ---------------
  SABAN.utils.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  SABAN.utils.randomRange = (lo, hi) => lo + Math.random() * (hi - lo);
  SABAN.utils.degToRad = (d) => d * Math.PI / 180;
  SABAN.utils.radToDeg = (r) => r * 180 / Math.PI;

  // -------------- Geometry helpers ---------------
  /**
   * Build a THREE.Shape from polygon vertices [[x,z],[x,z],...].
   * Returns a Shape in XY space — caller must rotateX(-PI/2) to lay flat.
   */
  SABAN.utils.polygonShape = function (vertices) {
    const T = global.THREE;
    const shape = new T.Shape();
    shape.moveTo(vertices[0][0], vertices[0][1]);
    for (let i = 1; i < vertices.length; i++) {
      shape.lineTo(vertices[i][0], vertices[i][1]);
    }
    shape.lineTo(vertices[0][0], vertices[0][1]);
    return shape;
  };

  /**
   * Build a closed THREE.Line boundary from vertices [[x,z],[x,z],...].
   */
  SABAN.utils.makeBoundary = function (vertices, color, yOffset) {
    const T = global.THREE;
    yOffset = yOffset === undefined ? 0.5 : yOffset;
    color = color === undefined ? 0xffd166 : color;
    const pts = vertices.map(v => new T.Vector3(v[0], yOffset, v[1]));
    pts.push(new T.Vector3(vertices[0][0], yOffset, vertices[0][1]));
    return new T.Line(
      new T.BufferGeometry().setFromPoints(pts),
      new T.LineBasicMaterial({ color: color })
    );
  };

  // -------------- Animation registry ---------------
  /**
   * Register a per-frame updater: fn(dt, totalTime).
   */
  SABAN.utils.registerUpdater = function (fn) {
    SABAN._registry.animUpdaters.push(fn);
  };

  /**
   * Mark a water mesh so its normal map will be auto-animated.
   * @param mesh — must have material.normalMap
   * @param flowSpeed { x, y } — normal map offset velocity (per second)
   */
  SABAN.utils.markAnimWater = function (mesh, flowSpeed) {
    mesh.userData.isAnimWater = true;
    mesh.userData.flowSpeed = flowSpeed || { x: 0.015, y: 0.005 };
    SABAN._registry.animWater.push(mesh);
  };

  /**
   * Mark a mesh as a "night glow" — opacity faded in when sun elevation < 0.
   * Mesh material must be transparent.
   */
  SABAN.utils.markNightGlow = function (mesh, maxOpacity) {
    mesh.userData.isNightGlow = true;
    mesh.userData.nightMaxOpacity = (maxOpacity == null) ? 0.45 : maxOpacity;
    SABAN._registry.nightGlows.push(mesh);
  };

  // -------------- Scene factory ---------------
  /**
   * Create a configured renderer + scene + camera + controls trio.
   * @param canvas — HTMLCanvasElement
   * @param opts { camera: {fov, near, far, position, target}, shadows: bool }
   */
  SABAN.utils.makeStage = function (canvas, opts) {
    const T = global.THREE;
    opts = opts || {};
    const camOpts = opts.camera || {};

    const scene = new T.Scene();

    const renderer = new T.WebGLRenderer({
      canvas: canvas, antialias: true, powerPreference: 'high-performance'
    });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = (opts.shadows !== false);
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.55;
    renderer.outputEncoding = T.sRGBEncoding;

    const camera = new T.PerspectiveCamera(
      camOpts.fov || 45,
      innerWidth / innerHeight,
      camOpts.near || 1,
      camOpts.far || 6000
    );
    const cp = camOpts.position || [380, 280, 380];
    camera.position.set(cp[0], cp[1], cp[2]);

    const controls = new T.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 30;
    controls.maxDistance = 1500;
    controls.maxPolarAngle = Math.PI * 0.495;
    const ct = camOpts.target || [-20, 30, 0];
    controls.target.set(ct[0], ct[1], ct[2]);

    addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });

    return { scene: scene, renderer: renderer, camera: camera, controls: controls };
  };

  /**
   * Start the standard animation loop. Calls all registered updaters,
   * animates water normal maps + night glows, updates controls + renders.
   * @param stage { scene, renderer, camera, controls }
   * @param onFps fn(fps) — optional, called twice per second
   */
  SABAN.utils.startLoop = function (stage, onFps) {
    let lastT = performance.now();
    let frames = 0, fpsTimer = lastT;

    function frame(now) {
      const dt = Math.min((now - lastT) / 1000, 0.1);
      lastT = now;
      frames++;
      if (onFps && (now - fpsTimer > 500)) {
        onFps(Math.round(frames * 1000 / (now - fpsTimer)));
        frames = 0; fpsTimer = now;
      }

      // animate water normal maps
      const wlist = SABAN._registry.animWater;
      for (let i = 0; i < wlist.length; i++) {
        const w = wlist[i];
        if (w.material && w.material.normalMap) {
          w.material.normalMap.offset.x += w.userData.flowSpeed.x * dt;
          w.material.normalMap.offset.y += w.userData.flowSpeed.y * dt;
        }
      }

      // run user updaters
      const ulist = SABAN._registry.animUpdaters;
      for (let i = 0; i < ulist.length; i++) ulist[i](dt, now);

      stage.controls.update();
      stage.renderer.render(stage.scene, stage.camera);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  // -------------- Component dispatcher ---------------
  /**
   * Create a component by type-name. Used by composer to read JSON config.
   * @param type — 'Tower', 'Tree', 'Lagoon', etc. (must be registered)
   * @param opts — passed through to component factory
   * @returns THREE.Group | THREE.Mesh
   */
  SABAN.utils.create = function (type, opts) {
    const factory = SABAN.components[type];
    if (!factory) throw new Error('Unknown component type: ' + type);
    return factory(opts || {});
  };

})(window);
