import test from 'node:test';
import assert from 'node:assert/strict';

function mapIntentToDuration(intent = '') {
  const normalized = intent.toLowerCase().trim();
  if (normalized === 'quick errand') return 30;
  if (normalized === 'coffee') return 60;
  if (normalized === 'dinner date') return 150;
  if (normalized === 'movie') return 180;
  return 120;
}

test('maps intents deterministically', () => {
  assert.equal(mapIntentToDuration('coffee'), 60);
  assert.equal(mapIntentToDuration('movie'), 180);
  assert.equal(mapIntentToDuration('unknown'), 120);
});
