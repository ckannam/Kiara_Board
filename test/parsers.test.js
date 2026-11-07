'use strict';
/* Plain-node assertion tests (same style as the Second Brain repo: assert + exit 1).
   Run: node test/parsers.test.js */
const assert = require('assert');
const { parseScore } = require('../parsers');

let passed = 0;
function ok(name, fn) { fn(); passed++; console.log('  ✓ ' + name); }

// ── Real share blobs, exactly as the games emit them ──────────────────────────

const KRILLION = `Krillion #110 🦐
225

🫧🦑🏮⬛🫧⬛🦑`;

const GNARLYQ = `GnarlyQ #111 🕹️

🍛 🟦🟦🛡️🟦🟦🟦
💻 🟦🟦🟦🟦🟦
🎬 🟦🛡️🟦🛡️⬛⬛⬛
🌍 🟦🟦🟦⚡⬛
🐔 ⚡⬛⬛⬛⬛
45 PTS · 🔥2

45. Your move.`;

const FARFLUNG = `Farflung #29 · 155/500 km*
Miss · Elusive · Miss · Rare · Miss
https://farflung.game/s/zkghfx?e=29&w=4`;

console.log('parsers');

ok('Krillion → game/day/score', () => {
  const r = parseScore(KRILLION);
  assert.strictEqual(r.game, 'krillion');
  assert.strictEqual(r.day, '110');
  assert.strictEqual(r.score, 225);
});

ok('GnarlyQ → score from "45 PTS", streak ignored', () => {
  const r = parseScore(GNARLYQ);
  assert.strictEqual(r.game, 'gnarlyq');
  assert.strictEqual(r.day, '111');
  assert.strictEqual(r.score, 45);
});

ok('Eraly → stub, no auto-detect yet (awaiting real share format)', () => {
  // Placeholder until we have a sample paste; detector must not false-match.
  assert.strictEqual(parseScore('Eraly moment 3 — the closer your guess…'), null);
});

ok('Farflung → number before /500', () => {
  const r = parseScore(FARFLUNG);
  assert.strictEqual(r.game, 'farflung');
  assert.strictEqual(r.day, '29');
  assert.strictEqual(r.score, 155);
});

ok('leading/trailing whitespace tolerated', () => {
  const r = parseScore('\n\n  ' + KRILLION + '  \n');
  assert.strictEqual(r.score, 225);
});

ok('unknown blob → null', () => {
  assert.strictEqual(parseScore('just some random text 42'), null);
  assert.strictEqual(parseScore(''), null);
  assert.strictEqual(parseScore(null), null);
});

ok('Krillion spelled with an a still parses', () => {
  const r = parseScore('Krillian #7 🦐\n300');
  assert.strictEqual(r.game, 'krillion');
  assert.strictEqual(r.score, 300);
});

console.log(`\n${passed} passed`);
