/* ============================================================
 * SABAN — LIGHTING PRESETS
 * --------------------------------------------------------------
 * Add ambient + directional sun to a scene.
 * Returns { ambient, sun } — caller can mutate intensities later
 * via SABAN.presets.sky.timeOfDay() for time-of-day animation.
 *
 * USAGE:
 *   const { ambient, sun } = SABAN.presets.lighting.standard(scene);
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const T = window.THREE;
  const lighting = {};
  window.SABAN.presets.lighting = lighting;

  /**
   * Standard outdoor preset — hemisphere ambient + directional sun
   * with shadow mapping configured for a ~600m × 600m scene.
   */
  lighting.standard = function (scene, opts) {
    opts = opts || {};
    const ambientIntensity = opts.ambientIntensity != null ? opts.ambientIntensity : 0.6;
    const sunIntensity = opts.sunIntensity != null ? opts.sunIntensity : 1.4;
    const shadowExtent = opts.shadowExtent || 300;

    const ambient = new T.HemisphereLight(0x9bc6e8, 0x3a4a3a, ambientIntensity);
    scene.add(ambient);

    const sun = new T.DirectionalLight(0xfff3d6, sunIntensity);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -shadowExtent;
    sun.shadow.camera.right = shadowExtent;
    sun.shadow.camera.top = shadowExtent;
    sun.shadow.camera.bottom = -shadowExtent;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = shadowExtent * 5;
    sun.shadow.bias = -0.0003;
    scene.add(sun);
    scene.add(sun.target);

    return { ambient: ambient, sun: sun };
  };

  /**
   * Pre-baked time-of-day presets (no animation, just setting).
   * @param state {ambient, sun, sky?, renderer?}
   * @param mode 'day' | 'sunset' | 'night'
   */
  lighting.applyMode = function (state, mode) {
    const { ambient, sun, sky, renderer } = state;
    if (mode === 'day') {
      sun.color.setHex(0xfff3d6);
      sun.intensity = 1.4;
      ambient.intensity = 0.6;
      if (renderer) renderer.toneMappingExposure = 0.55;
      if (sky) sky.material.uniforms.turbidity.value = 8;
    } else if (mode === 'sunset') {
      sun.color.setHex(0xff9050);
      sun.intensity = 0.9;
      ambient.intensity = 0.5;
      if (renderer) renderer.toneMappingExposure = 0.7;
      if (sky) sky.material.uniforms.turbidity.value = 12;
    } else if (mode === 'night') {
      sun.color.setHex(0x4060a0);
      sun.intensity = 0.15;
      ambient.intensity = 0.25;
      if (renderer) renderer.toneMappingExposure = 0.9;
      if (sky) sky.material.uniforms.turbidity.value = 0.5;
    }
  };
})();
