/* Shared layout + Nokta helpers for "Kaç Metre?". */
(function (LI) {
  'use strict';
  const { clamp } = LI.E;
  LI.KD = {
    /** positions for 16:9 and 9:16 */
    L(env) {
      return env.V
        ? {
          CX: { x: 0, y: -780, s: 42, w: 980 },
          HAND: { x0: -420, x1: 420, y: [-620, -420], h: 50, s: 38 },
          LAD: { x0: -450, x1: 450, y: -560, box: 100, s: 40 },
          W: { x: 0, y: [-380, -290, -200, -110], s: 42, w: 980 },
          DESK: { x0: -440, px: 720, y: -600, h: 50, s: 30 },
          PEN: { x0: -440, px: 58, y: -300, h: 34, s: 28 },
          RIB: { x0: -380, px: 5.4, y: [-600, -470], h: 46, s: 38 },
          SUM: { x: 0, y: [-560, -460, -360, -250], s: 46, w: 980 },
          nx: -360, gy: 560, s: 1.15 }
        : {
          CX: { x: 60, y: -445, s: 48, w: 1300 },
          HAND: { x0: -360, x1: 560, y: [-300, -115], h: 56, s: 42 },
          LAD: { x0: -430, x1: 700, y: -260, box: 116, s: 46 },
          W: { x: 110, y: [-60, 30, 120, 210], s: 50, w: 1250 },
          DESK: { x0: -400, px: 800, y: -300, h: 56, s: 34 },
          PEN: { x0: -400, px: 62, y: -20, h: 40, s: 30 },
          RIB: { x0: -300, px: 6.4, y: [-280, -150], h: 54, s: 44 },
          SUM: { x: 100, y: [-240, -140, -40, 80], s: 54, w: 1250 },
          nx: -800, gy: 262, s: 1.15 };
    },
    cam(env, o = {}) { return Object.assign({ x: env.V ? 0 : -60, y: env.V ? 60 : 0, zoom: 1, rot: 0, tilt: 1 }, o); },
    /** pupils + face toward a world point */
    look(p, target) {
      const e = LI.Nokta.eyes(p)[0];
      const dx = target[0] - e[0], dy = target[1] - e[1], d = Math.hypot(dx, dy) || 1;
      p.lookX = clamp(dx / d * 1.1, -1, 1); p.lookY = clamp(dy / d * 1.1, -1, 1);
      p.turn = clamp(dx / 900, -0.5, 0.5);
      return p;
    },
    /** a short ground stroke under Nokta */
    ground(ctx, env, x, gy) { LI.Ambient.ground(ctx, x - 360, x + 360, gy + 6, { alpha: 0.32 }); },
  };
})(window.LI = window.LI || {});
