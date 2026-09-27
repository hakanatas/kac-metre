/* SAHNE 1 — KAÇ KARIŞ? (0–10 s)  Two children measure the same desk.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Masa kaç karış?'],
      [10.4, 19.8, 'Herkes aynı ölçüyü kullansın: metre'],
      [20.0, 27.8, 'Her basamak sağındakinin 10 katı', true],
      [28.4, 45.8, 'Ölçelim: metre ve santimetre cetveliyle'],
      [46.4, 55.6, 'Hangisi daha uzun: 1,5 m mi, 145 cm mi?'],
      [55.8, 65.8, 'Karşılaştırmak için aynı birime çevir', true],
      [66.4, 79.8, 'Hangi birim uygun?'],
    ]);
  }

  /* ── 0–10 s: hand spans disagree ── */
  function spans(ctx, env, t) {
    const L = KD.L(env), H = L.HAND, f = F(), a = win(t, 4.4, 10.3), W = H.x1 - H.x0;
    [[7, 'Ali: 7 karış', 5.2, 0.3, true], [9, 'Ayşe: 9 karış', 6.6, 0.25, false]].forEach(([n, lab, t0, dt, amb], row) => {
      const y = H.y[row];
      f.slab(ctx, H.x0, y, W, H.h, seg(t, 4.6 + row * 0.4, 5.2 + row * 0.4), a, `rgba(${LI.INK_RGB},${0.08 * a})`, 810 + row);
      for (let i = 0; i < n; i++) {
        const p = seg(t, t0 + i * dt, t0 + i * dt + 0.3); if (p <= 0) continue;
        const u = W / n; A.arc(ctx, [H.x0 + (i + 0.5) * u, y - H.h / 2], u / 2, 0, 180, { p, alpha: a, w: 3.5, seed: 830 + i + row * 10 });
      }
      const la = seg(t, t0 + n * dt, t0 + n * dt + 0.4) * a; if (la > 0) f.T(ctx, lab, H.x0 + W / 2, y + H.h / 2 + 34, Object.assign({ size: H.s, alpha: la }, amb ? f.AMB : {}));
    });
    exprs(ctx, t, at(L.W, 2), [[8.0, 10.2, 'Aynı masa, farklı sonuç: herkesin karışı farklı']]);
  }

  /* ── 10–28 s: the ladder of units ── */
  function units(ctx, env, t) {
    const L = KD.L(env), f = F(), a = win(t, 10.4, 27.9);
    const hot = (i) => Math.max(i === 0 ? win(t, 14.0, 15.6) : 0, i >= 3 ? win(t, 15.6, 17.2) : 0, i >= 5 ? win(t, 17.2, 19.8) : 0);
    f.ladder(ctx, L.LAD, seg(t, 10.6, 13.6), a, hot);
    exprs(ctx, t, at(L.W, 0), [[14.0, 27.8, '1 km = 1000 m']]);
    exprs(ctx, t, at(L.W, 1), [[15.6, 27.8, '1 m = 10 dm = 100 cm = 1000 mm']]);
    exprs(ctx, t, at(L.W, 2), [[17.2, 27.8, '1 cm = 10 mm']]);
    exprs(ctx, t, at(L.W, 3), [[22.0, 27.8, 'Küçük birime geçerken 10 ile çarp, büyüğe geçerken 10’a böl', true]]);
  }

  /* ── 28–46 s: measuring a desk and a pencil ── */
  function measure(ctx, env, t) {
    const L = KD.L(env), D = L.DESK, P = L.PEN, f = F(), a = win(t, 28.4, 45.9);
    if (a > 0) {
      f.slab(ctx, D.x0, D.y, 1.2 * D.px, D.h, seg(t, 28.6, 29.6), a, `rgba(${LI.INK_RGB},${0.1 * a})`, 860);
      const ta = seg(t, 29.2, 29.6) * a; if (ta > 0) f.T(ctx, 'masa', D.x0 + 0.6 * D.px, D.y, { size: D.s, alpha: ta });
      const u = D.px / 10, ry = D.y + D.h / 2 + 8;
      f.ruler(ctx, D.x0, ry, 10, u, 10, seg(t, 29.8, 31.2), a, (i) => String(i * 10), D.s * 0.8, 870);
      f.ruler(ctx, D.x0 + D.px + 4, ry, 2, u, 10, seg(t, 32.2, 32.8), a, (i) => (i ? String(100 + i * 10) : ''), D.s * 0.8, 880);
      const b1 = seg(t, 31.4, 31.8) * a; if (b1 > 0) f.T(ctx, '1 m', D.x0 + D.px / 2, ry + 86, Object.assign({ size: D.s * 1.2, alpha: b1 }, f.AMB));
      const b2 = seg(t, 32.8, 33.2) * a; if (b2 > 0) f.T(ctx, '20 cm', D.x0 + D.px + u, ry + 86, Object.assign({ size: D.s * 1.2, alpha: b2 }, f.AMB));
      // pencil and a 15 cm ruler with millimetres
      f.slab(ctx, P.x0, P.y - P.h / 2 - 6, 14 * P.px, P.h, seg(t, 36.6, 37.4), a, `rgba(${LI.AMBER_RGB},${0.3 * a})`, 890);
      const pa = seg(t, 37.0, 37.4) * a; if (pa > 0) f.T(ctx, 'kalem', P.x0 + 7 * P.px, P.y - P.h / 2 - 6, { size: P.s, alpha: pa });
      f.ruler(ctx, P.x0, P.y, 15, P.px, 10, seg(t, 37.4, 38.6), a, (i) => String(i), P.s * 0.8, 895);
    }
    exprs(ctx, t, at(L.W, 2, env.V ? -190 : 130), [[33.4, 45.8, '1 m + 20 cm = 120 cm = 1,2 m', true]]);
    exprs(ctx, t, at(L.W, 3, env.V ? -110 : 210), [[39.0, 45.8, 'Kalem: 14 cm = 140 mm = 0,14 m', true]]);
  }

  /* ── 46–66 s: comparing in the same unit ── */
  function compare(ctx, env, t) {
    const L = KD.L(env), R = L.RIB, f = F(), a = win(t, 46.8, 65.9);
    if (a > 0) {
      f.slab(ctx, R.x0, R.y[0], 150 * R.px, R.h, seg(t, 47.4, 48.4), a, `rgba(${LI.INK_RGB},${0.1 * a})`, 940);
      f.slab(ctx, R.x0, R.y[1], 145 * R.px, R.h, seg(t, 48.0, 49.0), a, `rgba(${LI.INK_RGB},${0.1 * a})`, 941);
      const m = seg(t, 52.0, 52.6);
      f.T(ctx, '1,5 m', R.x0 - 20, R.y[0], { size: R.s, alpha: a * (1 - m) * seg(t, 47.6, 48.0), align: 'right' });
      if (m > 0) f.T(ctx, '150 cm', R.x0 - 20, R.y[0], Object.assign({ size: R.s, alpha: a * m, align: 'right' }, f.AMB));
      f.T(ctx, '145 cm', R.x0 - 20, R.y[1], { size: R.s, alpha: a * seg(t, 48.2, 48.6), align: 'right' });
      const d = seg(t, 53.6, 54.2) * a;
      if (d > 0) { ctx.fillStyle = `rgba(${LI.AMBER_RGB},${0.6 * d})`; ctx.fillRect(R.x0 + 145 * R.px, R.y[0] - R.h / 2, 5 * R.px, R.h);
        f.T(ctx, '5 cm', R.x0 + 147.5 * R.px, R.y[0] - R.h / 2 - 28, Object.assign({ size: R.s * 0.9, alpha: d }, f.AMB)); }
    }
    exprs(ctx, t, at(L.W, 0), [[52.0, 65.8, '1,5 m = 150 cm']]);
    exprs(ctx, t, at(L.W, 1), [[54.4, 65.8, '150 cm, 145 cm’den 5 cm daha uzun', true]]);
    exprs(ctx, t, at(L.W, 2), [[58.0, 65.8, 'Okul 1,2 km, park 950 m uzakta']]);
    exprs(ctx, t, at(L.W, 3), [[60.0, 65.8, '1,2 km = 1200 m: okul 250 m daha uzak', true]]);
  }

  /* ── 66–80 s: choosing a sensible unit ── */
  function choose(ctx, env, t) {
    const W = KD.L(env).W, Y = env.V ? [-620, -510, -400, -270] : [-290, -180, -70, 60];
    exprs(ctx, t, at(W, 0, Y[0]), [[67.0, 79.8, 'Kalem: 14 cm   (0,00014 km demeyiz)']]);
    exprs(ctx, t, at(W, 1, Y[1]), [[69.0, 79.8, 'Sınıf kapısının yüksekliği: 2 m']]);
    exprs(ctx, t, at(W, 2, Y[2]), [[71.0, 79.8, 'İki şehir arası: 450 km   (45 000 000 cm demeyiz)']]);
    exprs(ctx, t, at(W, 3, Y[3]), [[74.0, 79.8, 'Uygun birim, sayıyı kolay okunur yapar', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Ölçüt birim: metre', 80.6], ['1 km = 1000 m · 1 m = 100 cm · 1 cm = 10 mm', 81.6], ['Karşılaştırmadan önce aynı birime çevir', 82.6], ['Duruma uygun birimi seç', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.2 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); spans(ctx, env, t); units(ctx, env, t); measure(ctx, env, t); compare(ctx, env, t); choose(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'How many spans?', nameTr: 'Kaç karış?', concept: 'Hand spans disagree', conceptTr: 'Karışlar farklı', render });
})(window.LI = window.LI || {});
