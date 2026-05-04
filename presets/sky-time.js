/* ============================================================
 * SABAN — SKY + TIME-OF-DAY
 * --------------------------------------------------------------
 * Hosek-Wilkie Sky shader + sun position calculator.
 * Hooks: turbidity / rayleigh / sun elevation, all wired
 * to a [0,1] time value (0 = midnight, 0.5 = noon).
 *
 * USAGE:
 *   const sky = SABAN.presets.sky.create(scene);
 *   SABAN.presets.sky.timeOfDay({ scene, sky, sun, ambient, renderer }, 0.6);
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;
  const sky = {};
  window.SABAN.presets.sky = sky;

  /**
   * Create a Hosek-Wilkie Sky and add to scene.
   * Requires THREE.Sky (loaded from Sky.js).
   */
  sky.create = function (scene, opts) {
    opts = opts || {};
    const skyMesh = new T.Sky();
    skyMesh.scale.setScalar(opts.scale || 10000);
    scene.add(skyMesh);
    const u = skyMesh.material.uniforms;
    u.turbidity.value = opts.turbidity != null ? opts.turbidity : 8;
    u.rayleigh.value = opts.rayleigh != null ? opts.rayleigh : 2;
    u.mieCoefficient.value = opts.mieCoefficient != null ? opts.mieCoefficient : 0.005;
    u.mieDirectionalG.value = opts.mieDirectionalG != null ? opts.mieDirectionalG : 0.8;
    return skyMesh;
  };

  /**
   * Compute sun direction vector for a [0,1] time of day.
   * 0 = midnight, 0.25 = 06:00, 0.5 = noon, 0.75 = 18:00, 1 = midnight.
   * Returns Vector3 (unit length).
   */
  sky.sunDirection = function (t) {
    const hourAngle = (t - 0.5) * Math.PI * 2; // 0 at noon
    const elev = Math.cos(hourAngle);
    const phi = Math.acos(T.MathUtils.clamp(elev, -1, 1));
    const theta = Math.PI - hourAngle * 0.5;
    const v = new T.Vector3();
    v.setFromSphericalCoords(1, phi, theta);
    return v;
  };

  /**
   * Update entire scene to reflect time of day t ∈ [0,1].
   * Updates: sky uniforms, sun light position/color/intensity,
   *          ambient intensity, renderer exposure, night-glow opacity.
   * @param state { scene, sky, sun, ambient, renderer }
   * @param t [0,1]
   */
  sky.timeOfDay = function (state, t) {
    const { scene, sky: skyMesh, sun, ambient, renderer } = state;
    const sunPos = sky.sunDirection(t);

    if (skyMesh) skyMesh.material.uniforms.sunPosition.value.copy(sunPos);
    sun.position.copy(sunPos).multiplyScalar(800);
    sun.target.position.set(0, 0, 0);

    const elev = sunPos.y;

    if (elev > 0.1) {
      // Day
      sun.color.setHex(0xfff3d6);
      sun.intensity = 1.4 * Math.min(1, elev * 2);
      ambient.intensity = 0.6;
      if (renderer) renderer.toneMappingExposure = 0.55;
      if (skyMesh) skyMesh.material.uniforms.turbidity.value = 8;
    } else if (elev > -0.1) {
      // Sunrise/sunset
      sun.color.setHex(0xff9050);
      sun.intensity = 0.9;
      ambient.intensity = 0.5;
      if (renderer) renderer.toneMappingExposure = 0.7;
      if (skyMesh) skyMesh.material.uniforms.turbidity.value = 12;
    } else {
      // Night
      sun.color.setHex(0x4060a0);
      sun.intensity = 0.15;
      ambient.intensity = 0.25;
      if (renderer) renderer.toneMappingExposure = 0.9;
      if (skyMesh) skyMesh.material.uniforms.turbidity.value = 0.5;
    }

    // Night glow on registered meshes
    const nightAmt = elev < 0.05 ? Math.min(1, (0.05 - elev) * 8) : 0;
    const reg = window.SABAN._registry.nightGlows;
    for (let i = 0; i < reg.length; i++) {
      const m = reg[i];
      if (m.material) {
        m.material.opacity = nightAmt * (m.userData.nightMaxOpacity || 0.45);
      }
    }
  };

  /**
   * Format a time slider value (0..100) into "HH:MM (period)".
   */
  sky.formatTime = function (sliderValue) {
    const t = sliderValue / 100;
    const hours = Math.floor(t * 24);
    const mins = Math.floor((t * 24 - hours) * 60);
    let period;
    if (hours < 6) period = 'sáng sớm';
    else if (hours < 12) period = 'sáng';
    else if (hours < 18) period = 'chiều';
    else period = 'tối';
    return String(hours).padStart(2, '0') + ':' +
      String(mins).padStart(2, '0') + ' ' + period;
  };
})();
