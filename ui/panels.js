/* ============================================================
 * SABAN — UI PANEL FACTORY (v1.1)
 * --------------------------------------------------------------
 * Build standard panels (info, views, legend, time slider, stats,
 * loading overlay, help panel, master controls) into <body>.
 * v1.1: + collapsible panels + master clean-view + keyboard help
 * ============================================================ */
(function () {
  'use strict';
  if (!window.SABAN) throw new Error('SABAN core not loaded');
  const ui = {};
  window.SABAN.ui = ui;

  ui.build = function (opts) {
    opts = opts || {};
    const refs = {};

    // -------- Loading overlay --------
    const loading = document.createElement('div');
    loading.id = 'saban-loading';
    loading.innerHTML =
      '<div class="spinner"></div>' +
      '<div>Dang tai thu vien 3D...</div>' +
      '<pre id="saban-load-status">Khoi dong...</pre>';
    document.body.appendChild(loading);
    refs.loading = loading;
    refs.loadStatus = loading.querySelector('#saban-load-status');
    refs.logStatus = function (msg, cls) {
      const line = document.createElement('div');
      if (cls === 'ok') line.className = 'saban-ok';
      else if (cls === 'err') line.className = 'saban-err';
      else if (cls === 'pending') line.className = 'saban-pending';
      line.textContent = msg;
      refs.loadStatus.appendChild(line);
    };

    // -------- Canvas --------
    let canvas = document.getElementById('saban-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'saban-canvas';
      document.body.appendChild(canvas);
    }
    refs.canvas = canvas;

    // -------- Info panel --------
    if (opts.info) {
      const info = document.createElement('div');
      info.id = 'saban-info';
      info.className = 'saban-panel saban-hidden';
      let html = '';
      if (opts.info.title) html += '<h1>' + opts.info.title + '</h1>';
      if (opts.info.subtitle) html += '<div class="sub">' + opts.info.subtitle + '</div>';
      html += '<div class="sub" style="margin-top:6px">' +
        '<kbd>Chuot trai</kbd> xoay &middot; <kbd>Lan</kbd> zoom &middot; ' +
        '<kbd>Phai</kbd> di chuyen &middot; <kbd>Mui ten</kbd> pan &middot; <kbd>WASD</kbd> dieu khien' +
        '</div>';
      if (opts.info.footer) html += '<div class="sub" style="margin-top:4px;color:#ffd166">' + opts.info.footer + '</div>';
      info.innerHTML = html;
      document.body.appendChild(info);
      refs.info = info;
    }

    // -------- Views panel --------
    if (opts.views && opts.views.length) {
      const v = document.createElement('div');
      v.id = 'saban-views';
      v.className = 'saban-panel saban-hidden';
      let html = '<div class="header">CAMERA VIEWS (Goc nhin)</div>';
      const cams = window.SABAN.presets.cameras.views;
      opts.views.forEach((name, idx) => {
        const view = cams[name];
        const label = view ? view.label : name;
        const num = idx + 1;
        html += '<button data-view="' + name + '"><span style="opacity:0.6">[' + num + ']</span> ' + label + '</button>';
      });
      v.innerHTML = html;
      document.body.appendChild(v);
      refs.views = v;
      refs.onViewClick = function (handler) {
        v.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => handler(btn.dataset.view));
        });
      };
    }

    // -------- Legend panel --------
    if (opts.legend && opts.legend.length) {
      const l = document.createElement('div');
      l.id = 'saban-legend';
      l.className = 'saban-panel saban-hidden';
      let html = '<div class="header">CHU THICH</div>';
      opts.legend.forEach(item => {
        html += '<div class="row"><span class="swatch" style="background:' +
          item.color + '"></span>' + item.label + '</div>';
      });
      l.innerHTML = html;
      document.body.appendChild(l);
      refs.legend = l;
    }

    // -------- Time slider --------
    if (opts.time) {
      const t = document.createElement('div');
      t.id = 'saban-time';
      t.className = 'saban-panel saban-hidden';
      const init = opts.timeInitial != null ? opts.timeInitial : 60;
      t.innerHTML =
        '<label>Time of Day &middot; <span id="saban-time-label">15:00</span></label>' +
        '<input id="saban-time-slider" type="range" min="0" max="100" value="' + init + '">' +
        '<div class="vals"><span>06:00</span><span>12:00</span><span>18:00</span><span>22:00</span></div>';
      document.body.appendChild(t);
      refs.time = t;
      refs.timeSlider = t.querySelector('#saban-time-slider');
      refs.timeLabel = t.querySelector('#saban-time-label');
    }

    // -------- FPS stats --------
    if (opts.stats) {
      const s = document.createElement('div');
      s.id = 'saban-stats';
      s.className = 'saban-panel saban-hidden';
      s.innerHTML = '<span id="saban-fps">FPS: --</span>';
      document.body.appendChild(s);
      refs.stats = s;
      refs.fpsEl = s.querySelector('#saban-fps');
      refs.setFps = function (n) { refs.fpsEl.textContent = 'FPS: ' + n; };
    }

    // -------- Help panel (keyboard shortcuts) --------
    if (opts.help !== false) {
      const h = document.createElement('div');
      h.id = 'saban-help';
      h.className = 'saban-panel saban-hidden';
      h.innerHTML =
        '<h2>Keyboard shortcuts</h2>' +
        '<table>' +
        '<tr><td>Mui ten</td><td>Pan camera</td></tr>' +
        '<tr><td>W / S</td><td>Zoom in/out</td></tr>' +
        '<tr><td>A / D</td><td>Xoay trai/phai</td></tr>' +
        '<tr><td>Q / E</td><td>Ngang / Cui</td></tr>' +
        '<tr><td>1-6</td><td>Camera presets</td></tr>' +
        '<tr><td>Space</td><td>Reset view</td></tr>' +
        '<tr><td>L</td><td>Toggle Legend</td></tr>' +
        '<tr><td>H</td><td>Clean view</td></tr>' +
        '</table>';
      document.body.appendChild(h);
      refs.help = h;
    }

    // -------- Master controls (top-center, always visible) --------
    const mc = document.createElement('div');
    mc.id = 'saban-master-controls';
    mc.className = 'saban-hidden';
    let mcHtml = '<button data-act="all" title="Hide all panels (H)">Clean</button>' +
      '<button data-act="legend" title="Toggle Legend (L)">Legend</button>';
    if (opts.help !== false) {
      mcHtml += '<button data-act="help" title="Phim tat (Help)">Help</button>';
    }
    mc.innerHTML = mcHtml;
    document.body.appendChild(mc);
    refs.masterControls = mc;

    // -------- Toggle helpers --------
    const panelMap = {
      info: refs.info, views: refs.views, legend: refs.legend,
      time: refs.time, stats: refs.stats, help: refs.help
    };
    let allHidden = false;
    const stateBeforeHide = {};

    refs.togglePanel = function (which) {
      if (which === 'all') {
        allHidden = !allHidden;
        Object.keys(panelMap).forEach(k => {
          const p = panelMap[k];
          if (!p) return;
          if (allHidden) {
            stateBeforeHide[k] = p.classList.contains('saban-hidden');
            p.classList.add('saban-hidden');
          } else {
            if (!stateBeforeHide[k]) p.classList.remove('saban-hidden');
          }
        });
        const cleanBtn = mc.querySelector('[data-act="all"]');
        if (cleanBtn) {
          if (allHidden) cleanBtn.classList.add('active');
          else cleanBtn.classList.remove('active');
        }
      } else {
        const p = panelMap[which];
        if (!p) return;
        p.classList.toggle('saban-hidden');
      }
    };

    mc.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => refs.togglePanel(btn.dataset.act));
    });

    // -------- Add collapse buttons (-/+) to each panel --------
    function addCollapseBtn(panel) {
      if (!panel) return;
      const btn = document.createElement('button');
      btn.className = 'saban-toggle-btn';
      btn.title = 'Thu gon / Mo rong';
      btn.textContent = '-';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const collapsed = panel.classList.toggle('saban-panel-collapsed');
        btn.textContent = collapsed ? '+' : '-';
      });
      panel.appendChild(btn);
    }
    addCollapseBtn(refs.info);
    addCollapseBtn(refs.views);
    addCollapseBtn(refs.legend);
    addCollapseBtn(refs.help);

    refs.hideLoading = function () {
      loading.classList.add('saban-hidden');
      document.querySelectorAll('.saban-panel').forEach(p => p.classList.remove('saban-hidden'));
      mc.classList.remove('saban-hidden');
    };

    return refs;
  };
})();
