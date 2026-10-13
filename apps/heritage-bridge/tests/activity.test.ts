import test from 'node:test';
import assert from 'node:assert/strict';
import { activityExamples, durationMs, fitsActivity, formatSongDuration } from '../shared/activity';
import { library, publishedWorks } from '../shared/library';
import { startDraft, type BridgeDraft } from '../src/bridge-draft';

test('song constraints use exact recording milliseconds, without rounding down at the boundary', () => {
  const song = publishedWorks.find((w) => w.songDuration?.durationMs === 240013)!;
  assert.ok(song);
  assert.equal(fitsActivity(song, { kind: 'artist', maxMinutes: 4 }), false);
  assert.equal(fitsActivity(song, { kind: 'artist', maxMinutes: 5 }), true);
  assert.equal(formatSongDuration(240013), '4:01');
  assert.equal(
    durationMs({ ...song, destination: 'https://example.com/another-recording' }),
    undefined,
  );
  assert.equal(
    fitsActivity({ ...song, songDuration: undefined }, { kind: 'artist', maxMinutes: 5 }),
    false,
  );
  assert.equal(
    fitsActivity({ ...song, songDuration: undefined }, { kind: 'artist', maxMinutes: null }),
    true,
  );
});

test('each collection offers feasible default examples backed by reviewed durations', () => {
  assert.equal(publishedWorks.filter((w) => w.songDuration).length, 12);
  for (const collection of library) {
    const pool = publishedWorks.filter((w) => w.collection === collection.id);
    const examples = activityExamples(collection.id, publishedWorks);
    assert.equal(examples.length, 2);
    for (const example of examples) {
      const maxMinutes = Number(example.match(/(\d+) minutes/)![1]);
      const kind = example.includes('film') ? 'movie' : 'artist';
      assert.ok(
        pool.some((w) => fitsActivity(w, { kind, maxMinutes })),
        example,
      );
    }
  }
});

test('same-collection return preserves the draft, while new examples or collection changes reset it', () => {
  const draft: BridgeDraft = {
    collection: 'hindi',
    brief: 'A song within five minutes',
    plan: {
      status: 'ready',
      activity: { kind: 'artist', maxMinutes: 5 },
      eligibleCount: 1,
      message: 'Ready',
      checks: ['One option'],
    },
  };
  assert.equal(startDraft(draft, 'hindi'), draft);
  assert.deepEqual(startDraft(draft, 'tamil'), { collection: 'tamil', brief: '' });
  assert.deepEqual(startDraft(draft, 'hindi', true), { collection: 'hindi', brief: '' });
});
