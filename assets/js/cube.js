/**
 * Tiny N×N×N cube simulator + SVG diagram renderer.
 * Works in the browser (window.CubeSim) and in Node (module.exports) for tests.
 *
 * Coordinates: x → R, y → U, z → F. Cubie centres use odd integers in
 * [-(N-1), N-1]; a sticker sits at cubie centre + unit face normal.
 */
(function (root) {
  'use strict';

  const FACES = {
    U: { axis: 1, sign: 1 }, D: { axis: 1, sign: -1 },
    R: { axis: 0, sign: 1 }, L: { axis: 0, sign: -1 },
    F: { axis: 2, sign: 1 }, B: { axis: 2, sign: -1 },
  };
  // Orientation used throughout the tutorial: yellow up, white down, green front.
  const SCHEME = { U: 'Y', D: 'W', F: 'G', B: 'B', R: 'O', L: 'R' };
  const COLORS = { Y: '#ffd500', W: '#ffffff', G: '#009b48', B: '#0046ad', O: '#ff5800', R: '#b71234', X: '#c9ced6' };

  function rot(v, axis, q) {
    // Rotate vector v by q quarter turns, counterclockwise about +axis (right-hand rule).
    let [x, y, z] = v;
    q = ((q % 4) + 4) % 4;
    for (let i = 0; i < q; i++) {
      if (axis === 0) [y, z] = [-z, y];
      else if (axis === 1) [z, x] = [-x, z];
      else [x, y] = [-y, x];
    }
    return [x, y, z];
  }

  function solved(n) {
    const stickers = [];
    const coords = [];
    for (let c = -(n - 1); c <= n - 1; c += 2) coords.push(c);
    for (const [face, { axis, sign }] of Object.entries(FACES)) {
      const others = [0, 1, 2].filter(a => a !== axis);
      for (const a of coords) for (const b of coords) {
        const cubie = [0, 0, 0];
        cubie[axis] = sign * (n - 1); cubie[others[0]] = a; cubie[others[1]] = b;
        const normal = [0, 0, 0]; normal[axis] = sign;
        stickers.push({ cubie, normal, color: SCHEME[face], home: { cubie: cubie.slice(), normal: normal.slice() }, face });
      }
    }
    return { n, stickers };
  }

  function clone(state) {
    return { n: state.n, stickers: state.stickers.map(s => ({ ...s, cubie: s.cubie.slice(), normal: s.normal.slice() })) };
  }

  // ---- Notation -------------------------------------------------------------
  // opts.lowerIsSlice: lowercase r/l/u/d/f/b = inner (2nd) layer only (the 4x4
  // convention of this tutorial). Otherwise lowercase = two outer layers (3x3).
  function parseMove(tok, n, opts = {}) {
    const m = tok.match(/^(\d*)([URFDLBurfdlbMESxyz])(w?)(\d*)('?)$/);
    if (!m) throw new Error('Bad move: ' + tok);
    const [, pre, letter, w, amtStr, prime] = m;
    let amount = amtStr ? parseInt(amtStr, 10) : 1;
    if (prime) amount = -amount;
    const upper = letter.toUpperCase();
    if ('xyz'.includes(letter)) {
      const face = { x: 'R', y: 'U', z: 'F' }[letter];
      return { face, from: 1, to: n, amount };
    }
    if ('MES'.includes(letter)) {
      const face = { M: 'L', E: 'D', S: 'F' }[letter];
      if (n % 2 === 0) throw new Error('Slice move on even cube');
      const mid = (n + 1) / 2;
      return { face, from: mid, to: mid, amount };
    }
    const lower = letter !== upper;
    let from = 1, to = 1;
    if (w) { to = pre ? parseInt(pre, 10) : 2; }
    else if (lower) {
      if (opts.lowerIsSlice) { from = to = pre ? parseInt(pre, 10) : 2; }
      else { to = pre ? parseInt(pre, 10) : 2; }
    } else if (pre) { from = to = parseInt(pre, 10); }
    return { face: upper, from, to, amount };
  }

  function normalize(alg) {
    // Unicode primes, "x3" repeat markers, and implicit spacing like "RUR'".
    let s = alg.replace(/[’‘′`]/g, "'").replace(/\)\s*x\s*(\d+)/g, ')$1');
    // Expand parenthesised groups with an optional repeat count.
    let prev;
    do {
      prev = s;
      s = s.replace(/\(([^()]*)\)(\d*)('?)/g, (_, body, rep, inv) => {
        let t = body.trim();
        if (inv) t = invert(t);
        const k = rep ? parseInt(rep, 10) : 1;
        return ' ' + Array(k).fill(t).join(' ') + ' ';
      });
    } while (s !== prev);
    return s;
  }

  function tokenize(alg) {
    const s = normalize(alg);
    const re = /(\d*[URFDLBurfdlbMESxyz]w?\d*'?)/g;
    const toks = s.match(re) || [];
    const rest = s.replace(re, '').trim();
    if (rest) throw new Error('Unparsed text in alg "' + alg + '": ' + rest);
    return toks;
  }

  function invertToken(t) {
    return t.endsWith("'") ? t.slice(0, -1) : t + "'";
  }

  function invert(alg) {
    return tokenize(alg).reverse().map(invertToken).join(' ');
  }

  function applyMove(state, mv) {
    const { n } = state;
    const { axis, sign } = FACES[mv.face];
    // Layer k (1 = outer) along the face normal has cubie coordinate sign*(n+1-2k).
    const lo = Math.min(sign * (n + 1 - 2 * mv.from), sign * (n + 1 - 2 * mv.to));
    const hi = Math.max(sign * (n + 1 - 2 * mv.from), sign * (n + 1 - 2 * mv.to));
    // A clockwise turn seen from outside the face is a negative rotation about +normal.
    const q = -mv.amount * sign;
    for (const s of state.stickers) {
      const c = s.cubie[axis];
      if (c >= lo && c <= hi) {
        s.cubie = rot(s.cubie, axis, q);
        s.normal = rot(s.normal, axis, q);
      }
    }
    return state;
  }

  function apply(state, alg, opts) {
    for (const t of tokenize(alg)) applyMove(state, parseMove(t, state.n, opts));
    return state;
  }

  // ---- Queries ----------------------------------------------------------------
  const key = (c, nrm) => c.join(',') + '|' + nrm.join(',');

  function faceGrid(state, face) {
    // Returns rows (top→bottom as seen from outside, with standard net orientation) of sticker objects.
    const { n } = state;
    const { axis, sign } = FACES[face];
    const map = new Map();
    for (const s of state.stickers) if (s.normal[axis] === sign) map.set(s.cubie.join(','), s);
    // Screen axes per face (right, down) as unit vectors in cube space.
    const AX = {
      U: [[1, 0, 0], [0, 0, 1]], D: [[1, 0, 0], [0, 0, -1]],
      F: [[1, 0, 0], [0, -1, 0]], B: [[-1, 0, 0], [0, -1, 0]],
      R: [[0, 0, -1], [0, -1, 0]], L: [[0, 0, 1], [0, -1, 0]],
    }[face];
    const rows = [];
    for (let r = 0; r < n; r++) {
      const row = [];
      for (let c = 0; c < n; c++) {
        const p = [0, 0, 0];
        p[axis] = sign * (n - 1);
        for (let i = 0; i < 3; i++) {
          if (i === axis) continue;
          p[i] += AX[0][i] * (2 * c - (n - 1)) + AX[1][i] * (2 * r - (n - 1));
        }
        row.push(map.get(p.join(',')));
      }
      rows.push(row);
    }
    return rows;
  }

  function centerColor(state, face) {
    // Colour of the face centre (for even N: the colour most common among centre stickers).
    const g = faceGrid(state, face), n = state.n, cnt = {};
    for (let r = 1; r < n - 1; r++) for (let c = 1; c < n - 1; c++) cnt[g[r][c].color] = (cnt[g[r][c].color] || 0) + 1;
    if (n === 2) return null;
    return Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0];
  }

  function isSolved(state) {
    return Object.keys(FACES).every(f => new Set(faceGrid(state, f).flat().map(s => s.color)).size === 1);
  }

  // ---- SVG rendering -----------------------------------------------------------
  function svgEl(w, h, body, cls) {
    return `<svg class="${cls || ''}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`;
  }

  /** Top-down last-layer diagram: U face plus the top row of each side face. */
  function llDiagram(state, opts = {}) {
    const n = state.n, mode = opts.mode || 'pll';
    const cell = 24 / Math.max(1, n / 3) * (opts.scale || 1);
    const strip = cell * 0.36, gap = cell * 0.12, pad = 2;
    const size = n * cell;
    const W = size + 2 * (strip + gap) + 2 * pad;
    const ox = pad + strip + gap, oy = pad + strip + gap;
    // 'edges' greys out corners too (for the yellow-cross step, where only edges matter).
    const isCorner = s => s.cubie.every(v => Math.abs(v) === n - 1);
    const paint = s => {
      if (mode === 'oll') return s.color === 'Y' ? COLORS.Y : COLORS.X;
      if (mode === 'edges') return s.color === 'Y' && !isCorner(s) ? COLORS.Y : COLORS.X;
      return COLORS[s.color];
    };
    let body = '';
    const rect = (x, y, w, h, fill) =>
      body += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" rx="${Math.min(w, h) * 0.18}" fill="${fill}" stroke="#1f2430" stroke-width="1"/>`;
    const U = faceGrid(state, 'U');
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) rect(ox + c * cell + 1, oy + r * cell + 1, cell - 2, cell - 2, paint(U[r][c]));
    // Side strips: top row of B (above), F (below), L (left), R (right) as seen from above.
    const F = faceGrid(state, 'F')[0], B = faceGrid(state, 'B')[0], L = faceGrid(state, 'L')[0], R = faceGrid(state, 'R')[0];
    for (let i = 0; i < n; i++) {
      rect(ox + i * cell + 1, oy + size + gap, cell - 2, strip, paint(F[i]));
      rect(ox + (n - 1 - i) * cell + 1, pad, cell - 2, strip, paint(B[i]));
      rect(pad, oy + i * cell + 1, strip, cell - 2, paint(L[i]));
      rect(ox + size + gap, oy + (n - 1 - i) * cell + 1, strip, cell - 2, paint(R[i]));
    }
    if (mode === 'pll' && opts.arrows !== false) body += pllArrows(state, U, ox, oy, cell);
    return svgEl(W, W, body, 'll-svg');
  }

  function pllArrows(state, U, ox, oy, cell) {
    // Arrow from where each U-layer piece is now to where the algorithm sends it (its home).
    const n = state.n, seen = new Set();
    let out = '';
    const center = (cub) => [ox + ((cub[0] + n - 1) / 2) * cell + cell / 2, oy + ((cub[2] + n - 1) / 2) * cell + cell / 2];
    // Pieces that already look solved (e.g. identical 4×4 centres or wings swapped among themselves) get no arrow.
    const faceOf = nrm => Object.keys(FACES).find(f => nrm[FACES[f].axis] === FACES[f].sign);
    const looksSolved = cub => state.stickers.filter(t => t.cubie.join() === cub.join()).every(t => t.color === SCHEME[faceOf(t.normal)]);
    for (const row of U) for (const s of row) {
      const from = s.cubie, to = s.home.cubie;
      if (from.join() === to.join() || s.home.normal[1] !== 1 || looksSolved(from)) continue;
      const k = from.join() + '>' + to.join();
      if (seen.has(k)) continue; seen.add(k);
      const [x1, y1] = center(from), [x2, y2] = center(to);
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      const sx = x1 + ux * cell * 0.22, sy = y1 + uy * cell * 0.22, ex = x2 - ux * cell * 0.22, ey = y2 - uy * cell * 0.22;
      const ah = cell * 0.28;
      out += `<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${(ex - ux * ah * 0.6).toFixed(1)}" y2="${(ey - uy * ah * 0.6).toFixed(1)}" stroke="#111827" stroke-width="${(cell * 0.09).toFixed(2)}" stroke-linecap="round"/>`;
      const px = -uy, py = ux;
      out += `<polygon points="${ex.toFixed(1)},${ey.toFixed(1)} ${(ex - ux * ah + px * ah * 0.5).toFixed(1)},${(ey - uy * ah + py * ah * 0.5).toFixed(1)} ${(ex - ux * ah - px * ah * 0.5).toFixed(1)},${(ey - uy * ah - py * ah * 0.5).toFixed(1)}" fill="#111827"/>`;
    }
    return out;
  }

  /** Isometric 3D view. opts.view: 'top' (U,F,R visible) or 'bottom' (D,F,R). opts.mask(sticker) → bool to colour. */
  function isoDiagram(state, opts = {}) {
    const n = state.n;
    const cam = opts.view === 'bottom' ? [0.95, -0.85, 1.35] : [0.95, 1.05, 1.35];
    const len = Math.hypot(...cam), v = cam.map(c => c / len);
    // Screen basis: right = up × v (horizontal), up' = v × right.
    const up = [0, 1, 0];
    let r = [up[1] * v[2] - up[2] * v[1], up[2] * v[0] - up[0] * v[2], up[0] * v[1] - up[1] * v[0]];
    const rl = Math.hypot(...r); r = r.map(c => c / rl);
    const u2 = [v[1] * r[2] - v[2] * r[1], v[2] * r[0] - v[0] * r[2], v[0] * r[1] - v[1] * r[0]];
    const S = 60 / n;
    const proj = p => [p[0] * r[0] + p[1] * r[1] + p[2] * r[2], -(p[0] * u2[0] + p[1] * u2[1] + p[2] * u2[2])];
    const polys = [];
    for (const s of state.stickers) {
      const nrm = s.normal;
      if (nrm[0] * v[0] + nrm[1] * v[1] + nrm[2] * v[2] <= 0.01) continue;
      const axis = nrm.findIndex(c => c !== 0);
      const t = [0, 1, 2].filter(a => a !== axis);
      const ctr = s.cubie.map((c, i) => c + nrm[i]);
      const h = 0.9;
      const pts = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([a, b]) => {
        const p = ctr.slice(); p[t[0]] += a; p[t[1]] += b; return proj(p);
      });
      const fill = !opts.mask || opts.mask(s) ? COLORS[s.color] : COLORS.X;
      polys.push({ pts, fill });
    }
    const xs = polys.flatMap(p => p.pts.map(q => q[0])), ys = polys.flatMap(p => p.pts.map(q => q[1]));
    const minX = Math.min(...xs) - 1.2, minY = Math.min(...ys) - 1.2, maxX = Math.max(...xs) + 1.2, maxY = Math.max(...ys) + 1.2;
    const k = S / 2;
    let body = `<polygon points="${hull(polys, minX, minY, k)}" fill="#1f2430"/>`;
    for (const p of polys) {
      body += `<polygon points="${p.pts.map(([x, y]) => `${((x - minX) * k).toFixed(2)},${((y - minY) * k).toFixed(2)}`).join(' ')}" fill="${p.fill}" stroke="#1f2430" stroke-width="0.6" stroke-linejoin="round"/>`;
    }
    return svgEl((maxX - minX) * k, (maxY - minY) * k, body, 'iso-svg');
  }

  function hull(polys, minX, minY, k) {
    // Convex hull of all sticker corners (the cube silhouette), expanded slightly.
    const pts = polys.flatMap(p => p.pts).map(([x, y]) => [(x - minX) * k, (y - minY) * k]);
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [], upper = [];
    for (const p of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
    for (const p of pts.slice().reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
    const h = lower.slice(0, -1).concat(upper.slice(0, -1));
    const cx = h.reduce((a, p) => a + p[0], 0) / h.length, cy = h.reduce((a, p) => a + p[1], 0) / h.length;
    return h.map(([x, y]) => { const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1; return `${(x + dx / d * 2.2).toFixed(2)},${(y + dy / d * 2.2).toFixed(2)}`; }).join(' ');
  }

  const api = { solved, clone, apply, applyMove, parseMove, tokenize, normalize, invert, faceGrid, centerColor, isSolved, llDiagram, isoDiagram, COLORS, SCHEME };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CubeSim = api;
})(typeof window !== 'undefined' ? window : this);
