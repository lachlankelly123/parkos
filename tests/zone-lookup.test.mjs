import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const zones = JSON.parse(fs.readFileSync('data/zones.json', 'utf8'));

function findZone(lat, lng) {
  return zones.find((z) => {
    const [minLng, minLat, maxLng, maxLat] = z.bbox;
    return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
  });
}

test('finds supported zone from bbox', () => {
  const zone = findZone(37.776, -122.42);
  assert.equal(zone?.id, 'downtown-1');
});
