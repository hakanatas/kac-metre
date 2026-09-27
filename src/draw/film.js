/* ─────────────────────────────────────────────────────────────
   The film's continuous state as pure functions of time.
   Hand spans disagree, so we need a standard: the metre. A ladder of
   units (× 10 each step), measuring a desk and a pencil, comparing
   lengths in the same unit, and choosing a sensible unit.
   ───────────────────────────────────────────────────────────── */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, outBack, outCubic, inOut, hump } = LI.E;
  const A = LI.Ang, KD = LI.KD, Ink = LI.Ink;

  const T = (ctx, s, x, y, o = {}) => A.text(ctx, s, x, y, Object.assign({ size: 48 }, o));
  const AMB = { color: A.amber };
  /** text width in the brush font */
  function width(ctx, s, size) { ctx.save(); ctx.font = `${size}px "LI Brush", "Comic Sans MS", cursive`; const w = ctx.measureText(s).width; ctx.restore(); return w; }
  /** write text, shrinking it to fit width w */
  function fit(ctx, s, x, y, size, w, o = {}) { const m = width(ctx, s, size); T(ctx, s, x, y, Object.assign({ size: m > w ? size * w / m : size }, o)); }
  /** a hand-drawn check mark at (x, y) */
  function tick(ctx, x, y, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x, y], [x + 12, y + 14], [x + 38, y - 20]], { w: 7, p, alpha: a, color: LI.AMBER_RGB, seed: 401, taper: [0.05, 0.3] });
  }
  /** a hand-drawn cross over (x, y) */
  function cross(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, color: LI.AMBER_RGB, seed: 411, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, color: LI.AMBER_RGB, seed: 412, taper: [0.1, 0.3] });
  }

  /** text whose last k characters can glow amber (h: 0..1) */
  function hotTail(ctx, s, x, y, size, k, h, o = {}) {
    const w = width(ctx, s, size), head = s.slice(0, s.length - k), tail = s.slice(s.length - k), wh = width(ctx, head, size);
    const a = o.alpha ?? 1, base = Object.assign({}, o, { size, align: 'left' });
    if (head) T(ctx, head, x - w / 2, y, base);
    if (h < 1) T(ctx, tail, x - w / 2 + wh, y, Object.assign({}, base, { alpha: a * (1 - h) }));
    if (h > 0) T(ctx, tail, x - w / 2 + wh, y, Object.assign({}, base, AMB, { alpha: a * h }));
  }
  /** the big number, digit by digit; hot(i) → 0..1 amber for digit i (spaces skipped) */
  const NUMBER = '2,375';
  function bigNum(ctx, NUM, a, p, hot) {
    if (a <= 0) return;
    const w = width(ctx, NUMBER, NUM.s); let x = NUM.x - w / 2, di = 0;
    [...NUMBER].forEach((ch, j) => {
      const cw = width(ctx, ch, NUM.s);
      if (/[0-9]/.test(ch)) {
        const k = seg(p, j / NUMBER.length * 0.8, j / NUMBER.length * 0.8 + 0.2), h = hot(di++);
        if (k > 0) {
          const y = NUM.y - 20 * (1 - outBack(k)) - 10 * h;
          if (h < 1) T(ctx, ch, x + cw / 2, y, { size: NUM.s, alpha: a * k * (1 - h) });
          if (h > 0) T(ctx, ch, x + cw / 2, y, Object.assign({ size: NUM.s * (1 + 0.08 * h), alpha: a * k * h }, AMB));
        }
      }
      else if (ch !== ' ') { const k = seg(p, j / NUMBER.length * 0.8, j / NUMBER.length * 0.8 + 0.2); if (k > 0) T(ctx, ch, x + cw / 2, NUM.y, { size: NUM.s, alpha: a * k }); }
      x += cw;
    });
  }
  /* ── fractions and expressions ──────────────────────────── */
  /** width of one expression item (a string, or {n, d} for a fraction) */
  function itemW(ctx, it, s) { return typeof it === 'string' ? width(ctx, it, s) : Math.max(width(ctx, String(it.n), s * 0.72), width(ctx, String(it.d), s * 0.72)) + s * 0.25; }
  /** a row of text and stacked fractions, centred at x */
  function expr(ctx, items, x, y, s, o = {}) {
    const a = o.alpha ?? 1, col = o.color ? { color: o.color } : {};
    let w = items.reduce((u, it) => u + itemW(ctx, it, s), 0);
    const sc = o.w && w > o.w ? o.w / w : 1; s *= sc; w *= sc;
    let cx = x - w / 2;
    items.forEach((it) => {
      const iw = itemW(ctx, it, s);
      if (typeof it === 'string') T(ctx, it, cx, y, Object.assign({ size: s, alpha: a, align: 'left', halo: o.halo }, col));
      else {
        const fc = it.hot ? AMB : col, m = cx + iw / 2;
        T(ctx, String(it.n), m, y - s * 0.42, Object.assign({ size: s * 0.72, alpha: a }, fc));
        ctx.strokeStyle = it.hot ? `rgba(${LI.AMBER_RGB},${a})` : `rgba(${LI.INK_RGB},${0.85 * a})`; ctx.lineWidth = Math.max(2.5, s * 0.055);
        ctx.beginPath(); ctx.moveTo(cx + s * 0.1, y + 2); ctx.lineTo(cx + iw - s * 0.1, y + 2); ctx.stroke();
        T(ctx, String(it.d), m, y + s * 0.46, Object.assign({ size: s * 0.72, alpha: a }, fc));
      }
      cx += iw;
    });
  }
  const fr = (n, d, hot) => ({ n, d, hot });

  /* ── lengths: plain bars, rulers, a ladder of units ─────── */
  /** an outlined bar from x0, length w (drawn to k), optionally filled */
  function slab(ctx, x0, y, w, h, k, a, fill, seed = 800) {
    if (a <= 0 || k <= 0) return;
    const ww = w * LI.E.outCubic(clamp(k));
    if (fill) { ctx.fillStyle = fill; ctx.fillRect(x0, y - h / 2, ww, h); }
    Ink.path(ctx, [[x0, y - h / 2], [x0 + ww, y - h / 2], [x0 + ww, y + h / 2], [x0, y + h / 2], [x0, y - h / 2]], { w: 4, alpha: a, seed, taper: [0, 0], wob: 0.1 });
  }
  /** a ruler: n big units of px pixels each, sub ticks per unit, labels every unit */
  function ruler(ctx, x0, y, n, px, sub, k, a, lab, size, seed = 850) {
    if (a <= 0 || k <= 0) return;
    const W = n * px, ww = W * LI.E.outCubic(clamp(k));
    ctx.fillStyle = `rgba(${LI.AMBER_RGB},${0.16 * a})`; ctx.fillRect(x0, y, ww, 46);
    Ink.path(ctx, [[x0, y], [x0 + ww, y], [x0 + ww, y + 46], [x0, y + 46], [x0, y]], { w: 3.5, alpha: a, seed, taper: [0, 0], wob: 0.08 });
    for (let i = 0; i <= n * sub; i++) {
      const x = x0 + i * px / sub; if (x > x0 + ww + 0.5) break;
      const big = i % sub === 0, mid = sub === 10 && i % 5 === 0;
      ctx.strokeStyle = `rgba(${LI.INK_RGB},${0.8 * a})`; ctx.lineWidth = big ? 2.5 : 1.5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + (big ? 22 : mid ? 15 : 9)); ctx.stroke();
      if (big && lab && lab(i / sub)) T(ctx, lab(i / sub), x, y + 34, { size, alpha: a });
    }
  }
  /** the ladder of units, km … mm; hot = index glowing; k = draw-on */
  const UNITS = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
  function ladder(ctx, L, k, a, hot) {
    if (a <= 0) return;
    const n = UNITS.length, gap = (L.x1 - L.x0) / (n - 1);
    UNITS.forEach((u, i) => {
      const g = seg(k, i / n * 0.8, i / n * 0.8 + 0.2); if (g <= 0) return;
      const x = L.x0 + i * gap, h = hot(i), b = L.box * 0.62;
      ctx.fillStyle = `rgba(${LI.AMBER_RGB},${(i === 3 ? 0.35 : 0.08 + 0.3 * h) * a * g})`; ctx.fillRect(x - b, L.y - b * 0.6, 2 * b, 1.2 * b);
      Ink.path(ctx, [[x - b, L.y - b * 0.6], [x + b, L.y - b * 0.6], [x + b, L.y + b * 0.6], [x - b, L.y + b * 0.6], [x - b, L.y - b * 0.6]], { w: 3.5, alpha: a * g, seed: 900 + i, taper: [0, 0], wob: 0.1 });
      T(ctx, u, x, L.y + 2, Object.assign({ size: L.s * (i === 3 ? 1.25 : 1), alpha: a * g }, i === 3 ? AMB : {}));
      if (i < n - 1) { const p = seg(k, (i + 0.6) / n * 0.8, (i + 0.6) / n * 0.8 + 0.2); if (p > 0) {
        A.arc(ctx, [x + gap / 2, L.y + b * 0.6 + 6], gap * 0.3, 200, 340, { p, alpha: a, w: 3.5, seed: 920 + i });
        T(ctx, '× 10', x + gap / 2, L.y + b * 0.6 + gap * 0.3 + 28, Object.assign({ size: L.s * 0.78, alpha: a * p }, AMB)); } }
    });
  }

  /** an ink (not amber) cross for "not divisible" */
  function crossInk(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, seed: 421, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, seed: 422, taper: [0.1, 0.3] });
  }

  /** Nokta, as a function of time */
  function nokta(t, env) {
    const L = KD.L(env);
    const p = { x: L.nx, y: L.gy, s: L.s, mouth: 0.4, brow: 0.1 };
    const g = outCubic(seg(t, 1.3, 2.3));
    p.born = { body: lerp(0.3, 1, g), legs: outCubic(seg(t, 2.0, 2.6)), arms: outCubic(seg(t, 2.3, 2.8)), tuft: outBack(seg(t, 2.5, 2.9)) };
    if (t < 3.0) { p.sq = lerp(0.4, 1, clamp(LI.E.spring(seg(t, 1.3, 3.0) * 2, 8, 3.4), 0, 1.3)); p.drop = 1 - g; p.wobble = 1 - seg(t, 1.3, 2.8); }
    p.eyeOpen = outCubic(seg(t, 2.8, 3.1));
    KD.look(p, [L.HAND.x0 + 400, L.HAND.y[0]]);
    if (t > 10 && t < 28) KD.look(p, [(L.LAD.x0 + L.LAD.x1) / 2, L.LAD.y]);
    if (t > 28 && t < 46) KD.look(p, [L.DESK.x0 + 500, L.DESK.y]);
    if (t > 46 && t < 66) KD.look(p, [L.RIB.x0 + 450, L.RIB.y[1]]);
    if (t > 66 && t < 80) KD.look(p, [L.W.x, L.W.y[1]]);
    if (t > 80 && t < 84) KD.look(p, [L.SUM.x, L.SUM.y[1]]);
    if (t > 2.9 && t < 5.6) { p.hold = 'brush'; p.brushAng = -0.8 + 0.3 * Math.sin(t * 9); p.hands = { R: [1.35, -0.2 + 0.15 * Math.sin(t * 9)] }; }
    const pointing = (a, b) => { if (t > a && t < b) { p.point = 'R'; p.hands = { L: [-1.2, 0.55], R: [1.5, -0.35] }; } };
    pointing(12.0, 13.6); pointing(20.4, 22.0); pointing(33.0, 34.6); pointing(41.0, 42.6); pointing(51.4, 53.0); pointing(59.6, 61.2); pointing(80.6, 82.4);
    const think = seg(t, 7.6, 8.0) * (1 - seg(t, 9.6, 9.9)) + seg(t, 47.0, 47.4) * (1 - seg(t, 49.2, 49.5));
    if (think > 0) { p.hands = { L: [-1.2, 0.55], R: [0.75, -1.05 + 0.08 * Math.sin(t * 14)] }; p.brow = -0.5 * think; p.mouth = 0; p.lookY -= 0.3; }
    if (t > 69.4 && t < 70.6) { p.mouthOpen = 0.55; p.eyeScale = 1.1; }
    const joy = (a, b) => { if (t > a && t < b) { p.squint = 1; p.mouth = 1; p.sq = 1 + 0.1 * hump(t, a, a + 0.6); p.y -= 26 * hump(t, a, a + 0.6); p.hands = { L: [-1.3, -0.35], R: [1.3, -0.35] }; } };
    joy(25.0, 26.6); joy(43.6, 45.2); joy(62.6, 64.2); joy(77.0, 78.6);
    if (t > 84.0) {
      const j = (t - 84.0) % 1.4;
      p.squint = 1; p.mouth = 1; p.turn = 0.15; p.lookX = 0.3; p.lookY = 0;
      p.sq = 1 + 0.1 * Math.sin(Math.PI * clamp(j / 0.6)); p.y -= 40 * Math.sin(Math.PI * clamp(j / 0.6));
      p.hands = { L: [-1.35, -0.6 - 0.2 * Math.sin(t * 6)], R: [1.35, -0.6 + 0.2 * Math.sin(t * 6)] };
      if (t > 89.2) { p.squint = 0; p.lookX = 0; p.lookY = 0.2; p.turn = 0; p.y = L.gy; p.sq = 1; p.hands = { L: [-1.2, 0.55], R: [1.2, -1.0 + 0.25 * Math.sin(t * 10)] }; }
    }
    p.blink = Math.max(hump(t, 5.8, 5.95), hump(t, 18.0, 18.15), hump(t, 33.0, 33.15), hump(t, 50.0, 50.15), hump(t, 70.0, 70.15), hump(t, 81.0, 81.15));
    return p;
  }

  function base(ctx, env, t, cam, drawBefore) {
    const L = KD.L(env);
    LI.Ambient.specks(ctx, env, cam, t, { alpha: 0.22, n: 18, depth: 0.4, seed: 21 });
    LI.Camera.apply(ctx, env, cam);
    KD.ground(ctx, env, L.nx, L.gy);
    if (drawBefore) drawBefore();
    LI.Nokta.draw(ctx, LI.Nokta.follow((tt) => nokta(tt, env), t), t);
    if (t < 1.35 && t > 0.3) { const f = seg(t, 0.3, 1.3); Ink.dot(ctx, L.nx, lerp(-700, L.gy - 14, f * f), 15, { seed: 2, bleed: 0 }); }
    if (t > 1.3) Ink.drops(ctx, L.nx, L.gy - 4, t - 1.3, { n: 9, seed: 5, ground: L.gy + 4, scale: 0.8, alpha: 1 - seg(t, 4, 8) * 0.6 });
    return L;
  }

  LI.Film = { T, AMB, width, fit, tick, cross, crossInk, expr, fr, slab, ruler, UNITS, ladder, nokta, base };
})(window.LI = window.LI || {});
