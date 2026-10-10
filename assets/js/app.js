/**
 * Rubik's Cube Guide — page behaviour.
 * - English by default; a 中文 choice is kept for the current tab only.
 * - Renders every .dg diagram from CubeSim (cases are computed from the algorithms themselves).
 * - Turns every .alg button into a link to the 3D player (cubing.js <twisty-player>).
 */
(function () {
  'use strict';
  const Cube = window.CubeSim;
  const LANG_KEY = 'rc_lang';
  const root = document.documentElement;
  const TITLES = {
    en: "Rubik's Cube Guide — Beginner Method, CFOP, 2×2 & 4×4",
    zh: '魔方教程 — 层先法、CFOP、二阶与四阶',
  };

  // ---------- Language ----------
  let lang = 'en';
  try { lang = sessionStorage.getItem(LANG_KEY) || 'en'; } catch (e) { /* storage unavailable */ }
  function applyLang(l) {
    lang = l;
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'zh' ? 'zh-CN' : 'en');
    document.title = TITLES[l];
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.querySelector('.lang-label').textContent = l === 'zh' ? 'EN' : 'ZH';
      btn.title = l === 'zh' ? 'Switch to English' : 'Switch to Chinese';
    }
    refreshDockText();
  }

  // ---------- Notation helpers ----------
  const PLAY_SVG = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z"/></svg>';
  function pretty(alg) {
    // Spaces between moves, keep parentheses; ASCII prime for readability.
    return alg.replace(/[’‘′]/g, "'")
      .replace(/([URFDLBurfdlbMESxyz]w?\d*'?)(?=[URFDLBurfdlbMESxyz(])/g, '$1 ')
      .replace(/\)(?=[A-Za-z(])/g, ') ')
      .replace(/\s+/g, ' ').trim();
  }
  function toCubing(alg, lowerSlice) {
    // Tutorial notation → cubing.js: lowercase = wide (3×3) or inner slice (4×4 in this guide).
    return Cube.tokenize(alg).map(t => {
      const m = t.match(/^(\d*)([a-zA-Z])(w?)(\d*)('?)$/);
      const [, pre, letter, w, amt, prime] = m;
      if ('rludfb'.includes(letter)) {
        const up = letter.toUpperCase();
        return (lowerSlice ? (pre || '2') + up : (pre || '') + up + 'w') + amt + prime;
      }
      return pre + letter + w + amt + prime;
    }).join(' ');
  }
  const simOpts = el => ({ lowerIsSlice: el.dataset.lower === 'slice' });

  // ---------- Diagrams ----------
  const isCenter = (c, n) => c.filter(v => Math.abs(v) === n - 1).length === 1;
  const isEdge = (c, n) => c.filter(v => Math.abs(v) === n - 1).length === 2;
  const MASKS = {
    cross: (s, n) => isCenter(s.home.cubie, n) || (isEdge(s.home.cubie, n) && s.home.cubie[1] === -(n - 1)),
    f1l: (s, n) => isCenter(s.home.cubie, n) || s.home.cubie[1] === -(n - 1),
    f2l: (s, n) => isCenter(s.home.cubie, n) || s.home.cubie[1] < n - 1,
    ycross: (s, n) => isCenter(s.home.cubie, n) || s.home.cubie[1] < n - 1 || isEdge(s.home.cubie, n),
    oll: (s, n) => isCenter(s.home.cubie, n) || s.home.cubie[1] < n - 1 || s.color === 'Y',
    centers: (s, n) => isCenter(s.home.cubie, n),
    reduced: (s, n) => isCenter(s.home.cubie, n) || isEdge(s.home.cubie, n),
  };
  function stateFor(el) {
    const n = parseInt(el.dataset.n || '3', 10);
    const st = Cube.solved(n);
    if (el.dataset.setup) Cube.apply(st, el.dataset.setup, simOpts(el));
    else if (el.dataset.alg) Cube.apply(st, Cube.invert(el.dataset.alg), simOpts(el));
    return st;
  }
  function renderDiagrams() {
    document.querySelectorAll('.dg').forEach(el => {
      try {
        const st = stateFor(el);
        if (el.classList.contains('ll')) {
          el.innerHTML = Cube.llDiagram(st, { mode: el.dataset.mode || 'pll', arrows: el.dataset.arrows !== 'no' });
        } else {
          const mask = MASKS[el.dataset.mask];
          el.innerHTML = Cube.isoDiagram(st, { view: el.dataset.view || 'top', mask: mask ? s => mask(s, st.n) : null });
        }
        el.querySelector('svg').setAttribute('aria-label', el.dataset.label || 'Cube diagram');
      } catch (err) {
        console.error('Diagram failed', el, err);
      }
    });
  }

  // ---------- Algorithm buttons ----------
  function setupAlgButtons() {
    document.querySelectorAll('button.alg').forEach(btn => {
      if (!btn.querySelector('code')) {
        btn.innerHTML = `<span class="play">${PLAY_SVG}</span><code>${pretty(btn.dataset.alg)}</code>` + (btn.dataset.suffix ? `<small>${btn.dataset.suffix}</small>` : '');
      }
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Play ' + pretty(btn.dataset.alg));
      btn.addEventListener('click', () => loadIntoPlayer(btn));
    });
  }

  // ---------- 3D player (cubing.js) ----------
  const dock = document.getElementById('dock');
  const dockPlayer = document.getElementById('dock-player');
  const dockTitle = document.getElementById('dock-title');
  const dockAlg = document.getElementById('dock-alg');
  let player = null, playerReady = null, current = null;

  function ensurePlayer() {
    if (playerReady) return playerReady;
    playerReady = import('https://cdn.cubing.net/v0/js/cubing/twisty').then(() => {
      player = document.createElement('twisty-player');
      player.setAttribute('puzzle', '3x3x3');
      player.setAttribute('background', 'none');
      player.setAttribute('control-panel', 'bottom-row');
      player.setAttribute('hint-facelets', 'none');
      player.setAttribute('tempo-scale', '1.3');
      player.setAttribute('experimental-setup-alg', 'z2');
      player.setAttribute('alg', '');
      dockPlayer.innerHTML = '';
      dockPlayer.appendChild(player);
      return player;
    }).catch(err => {
      console.error(err);
      dockPlayer.innerHTML = `<div class="dock-empty"><span class="en">The 3D player could not be loaded. Check your connection and reload.</span><span class="zh">3D 演示加载失败，请检查网络后刷新页面。</span></div>`;
      throw err;
    });
    return playerReady;
  }

  function refreshDockText() {
    if (!current) return;
    const name = current.dataset[lang] || current.dataset.en || '';
    dockTitle.textContent = name || pretty(current.dataset.alg);
  }

  function loadIntoPlayer(btn) {
    document.querySelectorAll('button.alg.playing').forEach(b => b.classList.remove('playing'));
    btn.classList.add('playing');
    current = btn;
    refreshDockText();
    dockAlg.textContent = pretty(btn.dataset.alg);
    dock.classList.add('open');
    const n = parseInt(btn.dataset.n || '3', 10);
    const lower = btn.dataset.lower === 'slice';
    const play = toCubing(btn.dataset.alg, lower);
    let setup = 'z2';
    if (btn.dataset.setup) setup += ' ' + toCubing(btn.dataset.setup, lower);
    else if (btn.dataset.anchor !== 'start') setup += ' ' + toCubing(Cube.invert(btn.dataset.alg), lower);
    ensurePlayer().then(p => {
      p.puzzle = n + 'x' + n + 'x' + n;
      p.experimentalSetupAlg = setup;
      p.alg = play;
      p.jumpToStart();
      setTimeout(() => p.play(), 450);
    }).catch(() => {});
  }

  // ---------- TOC highlighting ----------
  function setupToc() {
    const links = Array.from(document.querySelectorAll('.toc a[href^="#"]'));
    const targets = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if (!('IntersectionObserver' in window) || !targets.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    targets.forEach(t => obs.observe(t));
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(lang);
    renderDiagrams();
    setupAlgButtons();
    setupToc();
    document.getElementById('lang-toggle').addEventListener('click', () => {
      applyLang(lang === 'zh' ? 'en' : 'zh');
      try { sessionStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
    });
    document.getElementById('dock-close').addEventListener('click', () => dock.classList.remove('open'));
    // Desktop shows the dock from the start: load the player once the page is idle.
    if (window.matchMedia('(min-width: 1001px)').matches) {
      const load = () => ensurePlayer().catch(() => {});
      if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 2000 });
      else setTimeout(load, 800);
    }
  });
})();
