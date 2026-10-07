/** Pure, seek-safe animation helpers. Times are seconds, never browser clocks. */
export const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
export const ease = (n: number) => 1 - Math.pow(1 - clamp(n), 3);
export const progress = (t: number, start: number, length: number) => ease((t - start) / Math.max(0.001, length));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const safeSpeed = (speed: number) => Number.isFinite(speed) ? clamp(speed, 0.5, 2) : 1;
export const seeded = (index: number, seed: number) => {
  const x = Math.sin((index + 1) * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export type Rect = {x: number; y: number; w: number; h: number};
export const layouts: Record<'full' | 'split' | 'triple' | 'horizontal', Rect[]> = {
  full: [{x: 0, y: 0, w: 1, h: 1}],
  split: [{x: 0, y: 0, w: 0.5, h: 1}, {x: 0.5, y: 0, w: 0.5, h: 1}],
  triple: [{x: 0, y: 0, w: 0.54, h: 1}, {x: 0.54, y: 0, w: 0.46, h: 0.5}, {x: 0.54, y: 0.5, w: 0.46, h: 0.5}],
  horizontal: [{x: 0, y: 0, w: 1, h: 0.5}, {x: 0, y: 0.5, w: 1, h: 0.5}],
};
export const durationFrames = (seconds: number, fps: number, speed: number) => Math.max(1, Math.round(seconds * fps / safeSpeed(speed)));
export const travelPhase = (t: number) => t < 2.2 ? 'title' : t < 3.1 ? 'split' : t < 4.2 ? 'triple' : t < 4.8 ? 'portal' : t < 5.3 ? 'full' : t < 6 ? 'horizontal' : t < 7.1 ? 'triple2' : t < 7.35 ? 'flash' : 'ending';
