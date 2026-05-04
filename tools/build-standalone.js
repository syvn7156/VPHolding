#!/usr/bin/env node
// Build single-file standalone HTML with EVERYTHING inline (no CDN)
// Usage: node tools/build-standalone.js examples/01-phuc-thinh-tam-da
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const exampleDir = process.argv[2] || 'examples/01-phuc-thinh-tam-da';
const outName = path.basename(exampleDir) + '.standalone.html';

// Three.js core + addons (INLINE — no CDN, works behind firewalls / blocked CDNs)
const VENDOR_FILES = [
  'lib/three.min.js',
  'lib/OrbitControls.js',
  'lib/Sky.js',
  'lib/Water.js'
];

const PLATFORM_FILES = [
  'components/_core.js',
  'materials/procedural-textures.js',
  'materials/pbr-presets.js',
  'components/buildings/tower.js',
  'components/buildings/villa.js',
  'components/buildings/shophouse.js',
  'components/buildings/podium.js',
  'components/buildings/clubhouse.js',
  'components/nature/tree.js',
  'components/nature/bush.js',
  'components/nature/palm.js',
  'components/nature/tree-variants.js',
  'components/infra/road.js',
  'components/infra/bridge.js',
  'components/infra/dock.js',
  'components/infra/parking.js',
  'components/water/lagoon.js',
  'components/water/river.js',
  'components/vehicles/boat.js',
  'components/vehicles/yacht.js',
  'components/vehicles/car.js',
  'components/vehicles/bus.js',
  'components/furniture/street-lamp.js',
  'components/furniture/street-furniture.js',
  'presets/lighting.js',
  'presets/cameras.js',
  'presets/sky-time.js',
  'presets/keyboard-controls.js',
  'ui/panels.js',
  'composer.js'
];

const css = fs.readFileSync(path.join(ROOT, 'ui/panels.css'), 'utf8');
const cfg = fs.readFileSync(path.join(ROOT, exampleDir, 'site.config.json'), 'utf8');

let vendorJs = '';
VENDOR_FILES.forEach(p => {
  const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
  vendorJs += '\n/* ===== ' + p + ' ===== */\n' + src + '\n';
});

let platformJs = '';
PLATFORM_FILES.forEach(p => {
  const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
  platformJs += '\n/* ===== ' + p + ' ===== */\n' + src + '\n';
});

const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>VP Holding - Phuc Thinh Tam Da Sa Ban 3D (standalone)</title>
<style>
${css}
#saban-fatal { position: fixed; top: 0; left: 0; right: 0; padding: 16px;
  background: #c00; color: white; font-family: monospace; font-size: 12px;
  z-index: 99999; max-height: 50vh; overflow: auto; white-space: pre-wrap; }
</style>
</head>
<body>
<script>
// ============================================================
// FATAL ERROR DISPLAY — must come BEFORE bundle so we catch
// any error during script eval too
// ============================================================
window.addEventListener('error', function(e) {
  let div = document.getElementById('saban-fatal');
  if (!div) {
    div = document.createElement('div');
    div.id = 'saban-fatal';
    div.textContent = 'ERROR caught by global handler:\\n';
    (document.body || document.documentElement).appendChild(div);
  }
  div.textContent += '\\n' + (e.message || e.error || e) +
    (e.filename ? '\\n  file: ' + e.filename + ':' + e.lineno : '') +
    (e.error && e.error.stack ? '\\n' + e.error.stack : '');
});
</script>

<!-- Three.js + OrbitControls + Sky + Water (INLINE — no external dep) -->
<script>
${vendorJs}
</script>

<!-- Platform bundle (30 modules) -->
<script>
${platformJs}
</script>

<!-- Site config + bootstrap -->
<script>
const SITE_CONFIG = ${cfg};

(function () {
  function start() {
    try {
      // Verify dependencies
      if (typeof THREE === 'undefined') throw new Error('THREE not loaded');
      if (!THREE.OrbitControls) throw new Error('OrbitControls not loaded');
      if (!THREE.Sky) throw new Error('Sky not loaded');
      if (!window.SABAN) throw new Error('SABAN namespace missing');

      // Build UI
      const refs = SABAN.ui.build({
        info:   SITE_CONFIG.ui.info,
        views:  SITE_CONFIG.ui.views,
        legend: SITE_CONFIG.ui.legend,
        time:   SITE_CONFIG.ui.time,
        timeInitial: SITE_CONFIG.ui.timeInitial,
        stats:  SITE_CONFIG.ui.stats,
        help:   SITE_CONFIG.ui.help
      });

      // Stage + lights + sky
      const stage = SABAN.utils.makeStage(refs.canvas, SITE_CONFIG.stage);
      const lights = SABAN.presets.lighting.standard(stage.scene, SITE_CONFIG.lighting);
      const sky = SABAN.presets.sky.create(stage.scene);

      // Compose
      SABAN.compose(stage, sky, lights, SITE_CONFIG);

      // Wire time slider
      let timeChange = null;
      if (refs.timeSlider) {
        timeChange = function () {
          const t = parseFloat(refs.timeSlider.value) / 100;
          SABAN.presets.sky.timeOfDay({
            scene: stage.scene, sky: sky, sun: lights.sun,
            ambient: lights.ambient, renderer: stage.renderer
          }, t);
          refs.timeLabel.textContent = SABAN.presets.sky.formatTime(refs.timeSlider.value);
        };
        refs.timeSlider.addEventListener('input', timeChange);
        timeChange();
      }

      // Camera presets
      const goView = function (name) {
        const v = SABAN.presets.cameras.lerp(stage, name, 1100);
        if (v.autoNight && refs.timeSlider) {
          refs.timeSlider.value = 90;
          if (timeChange) timeChange();
        }
      };
      if (refs.onViewClick) refs.onViewClick(goView);

      // Keyboard
      SABAN.presets.keyboard.attach(stage, {
        panSpeed: 1.5, dollySpeed: 1.2, yawSpeed: 0.8, pitchSpeed: 0.6,
        onPresetView: goView, onTogglePanel: refs.togglePanel
      });

      // Show panels + start render loop
      refs.hideLoading();
      SABAN.utils.startLoop(stage, function (fps) {
        if (refs.setFps) refs.setFps(fps);
      });
    } catch (err) {
      const div = document.createElement('div');
      div.id = 'saban-fatal';
      div.textContent = 'FATAL: ' + (err.message || err) +
        (err.stack ? '\\n\\n' + err.stack : '');
      document.body.appendChild(div);
      console.error(err);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
</script>
</body>
</html>
`;

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const outPath = path.join(ROOT, 'dist', outName);
fs.writeFileSync(outPath, html);
console.log('✓ Built fully self-contained:', outPath);
console.log('  Size:', (html.length / 1024).toFixed(1), 'KB');
console.log('  Vendor inline:', VENDOR_FILES.length, 'files');
console.log('  Platform modules:', PLATFORM_FILES.length, 'files');
console.log('  Zero CDN dependencies. Works on file://, dynu, any HTTP host.');
