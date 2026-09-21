// formations/util.js — shared helpers for every formation sampler.
// Positions live in world units within ~[-WORLD*aspect, WORLD*aspect] x / [-WORLD, WORLD] y.

export const WORLD = 5;

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
