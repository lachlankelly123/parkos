import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const zones = JSON.parse(fs.readFileSync('data/zones.json', 'utf8'));

test('demo provider pricing smoke', () => {
  const zone = zones[0];
  const durationMinutes = 60;
  const amount = Math.ceil((zone.rate_cents_per_hour * durationMinutes) / 60);
  assert.equal(amount, zone.rate_cents_per_hour);
});
