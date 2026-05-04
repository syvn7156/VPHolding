/* ============================================================
 * SABAN — KEYBOARD CONTROLS
 * --------------------------------------------------------------
 * Compose with OrbitControls. Adds keyboard movement on top of
 * mouse/touch. Designed for desktop + tablets with hardware kbd.
 *
 * KEY MAP:
 *   ↑ ↓ ← →     Pan camera + target (XZ plane, screen-relative)
 *   W / S       Dolly (zoom in/out along view direction)
 *   A / D       Yaw (rotate camera around target)
 *   Q / E       Roll-up / Roll-down (pitch)
 *   Space       Reset to last preset view
 *   H           Hide all panels (clean view mode)
 *   L           Toggle Legend panel
 *   1-6         Jump to preset views (aerial_sw, aerial_top, ...)
 *
 * USAGE:
 *   const kb = SABAN.presets.keyboard.attach(stage, {
 *     panSpeed: 1.5, dollySpeed: 1.2, yawSpeed: 0.8,
 *     onTogglePanel: (which) => ...
 *   });
 *   // kb.detach();  to remove
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;
  const kb = {};
  window.SABAN.presets.keyboard = kb;

  kb.attach = function (stage, opts) {
    opts = opts || {};
    const camera = stage.camera, controls = stage.controls;
    const panSpeed = opts.panSpeed != null ? opts.panSpeed : 1.5;       // m/frame at 60fps base
    const dollySpeed = opts.dollySpeed != null ? opts.dollySpeed : 1.2;
    const yawSpeed = opts.yawSpeed != null ? opts.yawSpeed : 0.8;       // rad/sec
    const pitchSpeed = opts.pitchSpeed != null ? opts.pitchSpeed : 0.6;
    const onTogglePanel = opts.onTogglePanel || (() => {});
    const onPresetView = opts.onPresetView || (() => {});

    const presets = ['aerial_sw', 'aerial_top', 'aerial_e', 'aerial_s', 'aerial_se_night', 'ground'];
    const keysDown = new Set();

    // -------- Pan helpers (screen-relative, XZ plane) --------
    const _forward = new T.Vector3();
    const _right = new T.Vector3();
    const _up = new T.Vector3(0, 1, 0);

    function getFlatVectors() {
      camera.getWorldDirection(_forward);
      _forward.y = 0; _forward.normalize();
      _right.crossVectors(_forward, _up).normalize();
    }

    function panBy(dx, dz) {
      // dx along +right, dz along +forward
      const off = new T.Vector3();
      off.copy(_right).multiplyScalar(dx);
      off.add(_forward.clone().multiplyScalar(dz));
      camera.position.add(off);
      controls.target.add(off);
    }

    function dollyBy(amount) {
      // Move camera toward/away from target along view direction
      const off = new T.Vector3();
      off.copy(_forward).multiplyScalar(amount);
      const dist = camera.position.distanceTo(controls.target);
      if (dist + amount * (-1) > 5 && dist + amount * (-1) < 5000) {
        camera.position.add(off);
      }
    }

    function yawBy(angle) {
      // Rotate camera around target on Y axis
      const off = new T.Vector3().subVectors(camera.position, controls.target);
      const r = Math.hypot(off.x, off.z);
      const a = Math.atan2(off.x, off.z) + angle;
      off.x = r * Math.sin(a);
      off.z = r * Math.cos(a);
      camera.position.copy(controls.target).add(off);
    }

    function pitchBy(angle) {
      const off = new T.Vector3().subVectors(camera.position, controls.target);
      const r = off.length();
      let pitch = Math.asin(off.y / r) + angle;
      pitch = Math.max(-1.5, Math.min(1.5, pitch));  // clamp ~ +- 86deg
      const yaw = Math.atan2(off.x, off.z);
      const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      off.x = r * cosP * Math.sin(yaw);
      off.z = r * cosP * Math.cos(yaw);
      off.y = r * sinP;
      camera.position.copy(controls.target).add(off);
    }

    // -------- Per-frame update via SABAN updater registry --------
    let lastT = performance.now();
    function update(dt) {
      if (keysDown.size === 0) return;
      getFlatVectors();
      // Speed scales with current camera distance (more zoom = faster pan)
      const dist = camera.position.distanceTo(controls.target);
      const speedMult = Math.max(0.3, dist / 200);
      const pan = panSpeed * 60 * dt * speedMult;
      const dolly = dollySpeed * 60 * dt * speedMult;

      if (keysDown.has('ArrowUp'))    panBy(0, pan);
      if (keysDown.has('ArrowDown'))  panBy(0, -pan);
      if (keysDown.has('ArrowLeft'))  panBy(-pan, 0);
      if (keysDown.has('ArrowRight')) panBy(pan, 0);
      if (keysDown.has('KeyW'))       dollyBy(dolly);
      if (keysDown.has('KeyS'))       dollyBy(-dolly);
      if (keysDown.has('KeyA'))       yawBy(yawSpeed * dt);
      if (keysDown.has('KeyD'))       yawBy(-yawSpeed * dt);
      if (keysDown.has('KeyQ'))       pitchBy(pitchSpeed * dt);
      if (keysDown.has('KeyE'))       pitchBy(-pitchSpeed * dt);
      controls.update();
    }

    window.SABAN.utils.registerUpdater(update);

    // -------- Event handlers --------
    function onKeyDown(e) {
      // Don't capture if user is typing in an input
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

      // Movement keys — collect in set
      const movementKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                            'KeyW', 'KeyS', 'KeyA', 'KeyD', 'KeyQ', 'KeyE'];
      if (movementKeys.indexOf(e.code) !== -1) {
        keysDown.add(e.code);
        e.preventDefault();
        return;
      }

      // One-shot keys
      if (e.code === 'Space') {
        onPresetView('aerial_sw');
        e.preventDefault();
      } else if (e.code === 'KeyH') {
        onTogglePanel('all');
        e.preventDefault();
      } else if (e.code === 'KeyL') {
        onTogglePanel('legend');
        e.preventDefault();
      } else if (e.code.startsWith('Digit')) {
        const n = parseInt(e.code.replace('Digit', ''), 10);
        if (n >= 1 && n <= presets.length) {
          onPresetView(presets[n - 1]);
          e.preventDefault();
        }
      }
    }

    function onKeyUp(e) {
      keysDown.delete(e.code);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return {
      detach: function () {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        keysDown.clear();
      },
      keysDown: keysDown
    };
  };
})();
