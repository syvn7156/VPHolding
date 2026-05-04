/* ============================================================
 * SABAN — CAMERA PRESETS
 * --------------------------------------------------------------
 * 6 góc chuẩn (proven) + helper để animate giữa các góc.
 *
 * USAGE:
 *   SABAN.presets.cameras.apply(stage, 'aerial_sw');
 *   SABAN.presets.cameras.register('custom1', {pos:[...], target:[...]})
 *   SABAN.presets.cameras.lerp(stage, 'aerial_top', 1100); // animated
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;
  const cams = { views: {} };
  window.SABAN.presets.cameras = cams;

  // -------------- 6 góc chuẩn từ v2 --------------
  const DEFAULT_VIEWS = {
    aerial_sw: { pos: [-380, 280, 380], target: [-20, 30, 0],
                 label: '🦅 Aerial Tây Nam', desc: 'Nhìn toàn cảnh từ góc Tây Nam (góc cinematic phổ biến)' },
    aerial_top: { pos: [-20, 600, 0.1], target: [-20, 0, 0],
                 label: '⬇ Top Down', desc: 'Mặt bằng top-down, tốt cho zoning + brief BOD' },
    aerial_e: { pos: [400, 180, 100], target: [100, 20, 0],
                 label: '⚓ Marina/Đông', desc: 'Nhìn từ phía Đông (sông/biển)' },
    aerial_s: { pos: [0, 220, 500], target: [-20, 30, 0],
                 label: '🛣 Cao tốc Nam', desc: 'Nhìn từ phía Nam (cao tốc/đường lớn)' },
    aerial_se_night: { pos: [380, 250, 380], target: [-20, 30, 0],
                 label: '🌙 Night Cinematic', desc: 'Đông Nam góc thấp + đèn thắp', autoNight: true },
    ground: { pos: [-30, 8, 0], target: [20, 8, 0],
                 label: '🚶 Mặt đất', desc: 'Walk-through level, giữa cụm tower' }
  };

  Object.keys(DEFAULT_VIEWS).forEach(k => cams.views[k] = DEFAULT_VIEWS[k]);

  cams.register = function (name, view) {
    cams.views[name] = view;
  };

  /**
   * Apply view immediately (no animation).
   * @param stage { camera, controls }
   */
  cams.apply = function (stage, name) {
    const v = cams.views[name];
    if (!v) throw new Error('Unknown view: ' + name);
    stage.camera.position.set(v.pos[0], v.pos[1], v.pos[2]);
    stage.controls.target.set(v.target[0], v.target[1], v.target[2]);
    stage.controls.update();
    return v;
  };

  /**
   * Smoothly lerp camera + target to a registered view over `dur` ms.
   * @param stage { camera, controls }
   */
  cams.lerp = function (stage, name, dur) {
    const v = cams.views[name];
    if (!v) throw new Error('Unknown view: ' + name);
    dur = dur || 1100;
    const startPos = stage.camera.position.clone();
    const startTgt = stage.controls.target.clone();
    const endPos = new T.Vector3(v.pos[0], v.pos[1], v.pos[2]);
    const endTgt = new T.Vector3(v.target[0], v.target[1], v.target[2]);
    const t0 = performance.now();
    function step() {
      const t = Math.min(1, (performance.now() - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);  // easeOutCubic
      stage.camera.position.lerpVectors(startPos, endPos, e);
      stage.controls.target.lerpVectors(startTgt, endTgt, e);
      stage.controls.update();
      if (t < 1) requestAnimationFrame(step);
    }
    step();
    return v;
  };
})();
