/* ============================================================
 * SABAN — PROCEDURAL TEXTURES
 * --------------------------------------------------------------
 * Canvas-based texture generators. No external image deps.
 * Each fn returns THREE.CanvasTexture with sRGBEncoding (where
 * appropriate) and RepeatWrapping pre-configured.
 * Mined from masterplan_3d_v2.html (2026-05-03).
 * ============================================================ */
(function () {
  'use strict';
  const T = window.THREE;
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const tex = {};
  window.SABAN.materials.textures = tex;

  // -------------- Wood (vertical grain, 256×1024) --------------
  tex.wood = function () {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 1024;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, '#5a3a1f');
    grad.addColorStop(0.5, '#7a4f2a');
    grad.addColorStop(1, '#5a3a1f');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 1024);
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = 'rgba(' + (30 + Math.random() * 30) + ',' +
        (20 + Math.random() * 20) + ',10,' +
        (0.3 + Math.random() * 0.3) + ')';
      ctx.lineWidth = 0.5 + Math.random() * 1.5;
      ctx.beginPath();
      const x = Math.random() * 256;
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + 10, 300, x - 10, 700, x + 5, 1024);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 256; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke();
    }
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.encoding = T.sRGBEncoding;
    return t;
  };

  // -------------- Grass (512×512, dense flecks) --------------
  tex.grass = function (opts) {
    opts = opts || {};
    const repeat = opts.repeat || 40;
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#3a6a3a'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 512, y = Math.random() * 512;
      ctx.fillStyle = 'rgba(' + (40 + Math.random() * 40) + ',' +
        (80 + Math.random() * 60) + ',' + (30 + Math.random() * 30) + ',' +
        (0.4 + Math.random() * 0.3) + ')';
      ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.encoding = T.sRGBEncoding;
    return t;
  };

  // -------------- Asphalt (256×256, gritty) --------------
  tex.asphalt = function () {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#2a2a2e'; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = 'rgba(' + (60 + Math.random() * 40) + ',' +
        (60 + Math.random() * 40) + ',' + (65 + Math.random() * 40) + ',' +
        (0.3 + Math.random() * 0.4) + ')';
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
    }
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.encoding = T.sRGBEncoding;
    return t;
  };

  // -------------- Sand (256×256, light beige) --------------
  tex.sand = function () {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#d4be88'; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = 'rgba(' + (180 + Math.random() * 40) + ',' +
        (160 + Math.random() * 30) + ',' + (100 + Math.random() * 30) + ',' +
        (0.3 + Math.random() * 0.4) + ')';
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
    }
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.encoding = T.sRGBEncoding;
    return t;
  };

  // -------------- Water normal map (512×512, layered sine waves) --------------
  // KEY: Use this with MeshPhongMaterial.normalMap to fake water reflections
  // WITHOUT triggering THREE.Water's WebGLRenderTarget (which fails on file://).
  tex.waterNormal = function () {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(512, 512);
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const i = (y * 512 + x) * 4;
        const nx = Math.sin(x * 0.05) * Math.cos(y * 0.04) * 0.3
          + Math.sin(x * 0.12 + y * 0.08) * 0.2
          + Math.sin(x * 0.25) * 0.1;
        const ny = Math.cos(x * 0.04) * Math.sin(y * 0.05) * 0.3
          + Math.cos(x * 0.08 + y * 0.12) * 0.2
          + Math.cos(y * 0.25) * 0.1;
        img.data[i] = 128 + nx * 127;     // R = X normal
        img.data[i + 1] = 128 + ny * 127;   // G = Y normal
        img.data[i + 2] = 200;               // B = Z (mostly up)
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    return t;
  };

  // Cache helper — generate once, reuse many
  tex.cache = {};
  tex.get = function (name, opts) {
    const key = name + ':' + JSON.stringify(opts || {});
    if (!tex.cache[key]) {
      const fn = tex[name];
      if (!fn) throw new Error('Unknown texture: ' + name);
      tex.cache[key] = fn(opts);
    }
    return tex.cache[key];
  };
})();
