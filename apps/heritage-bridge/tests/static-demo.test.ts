import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleDiscovery, samplePlan, samplePop, sampleRequest } from '../src/sample-api';
import { shortMoment, fitsActivity, activityExamples } from '../shared/activity';
import { demoWorks as publishedWorks, demoLibrary } from '../shared/demo-catalogue';
import { collectionIds } from '../shared/types';

test('static demo checks exact reviewed durations in all nine collections', () => {
  for (const collection of collectionIds) {
    for (const brief of activityExamples(collection, publishedWorks)) {
      const plan = samplePlan(collection, brief);
      assert.equal(plan.status, 'ready');
      const result = sampleDiscovery({
        collection,
        favorites: samplePop,
        feedback: {},
        easier: false,
        activity: plan.activity,
      });
      assert.ok(result.works.length);
      assert.ok(
        result.works.every((w) => w.collection === collection && fitsActivity(w, plan.activity!)),
      );
      assert.equal(result.mode, 'fixture');
      assert.match(result.message, /No Qloo or Gemini request/);
    }
  }
});
test('static demo rejects unsupported briefs and identities, preserves limits and exclusions', () => {
  assert.equal(
    samplePlan('mexican', 'Make a personalized plan for my child').status,
    'needs_input',
  );
  const input = {
    collection: 'mexican' as const,
    favorites: samplePop,
    feedback: {},
    easier: false,
    activity: samplePlan('mexican', shortMoment).activity,
  };
  const first = sampleDiscovery(input);
  const excluded = sampleDiscovery({ ...input, tried: first.works.map((w) => w.id) });
  assert.ok(excluded.works.every((w) => !first.works.some((f) => f.id === w.id)));
  assert.ok(excluded.works.every((w) => fitsActivity(w, input.activity!)));
  assert.equal(
    sampleDiscovery({
      ...input,
      favorites: [{ ...samplePop[0], id: 'custom' }, ...samplePop.slice(1)],
    }).status,
    'needs_input',
  );
  assert.equal(
    sampleDiscovery({ ...input, activity: { kind: 'movie', maxMinutes: 1 } }).status,
    'empty',
  );
});
test('sample transport never calls fetch, including unsupported actions and unknown search', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => {
    throw Error('Network forbidden');
  };
  try {
    assert.deepEqual(await (await sampleRequest('/api/status')).json(), { mode: 'fixture' });
    assert.deepEqual(await (await sampleRequest('/api/search?q=unknown&kind=artist')).json(), {
      matches: [],
    });
    assert.equal((await sampleRequest('https://provider.invalid/unknown')).status, 400);
    assert.equal(
      (
        await (
          await sampleRequest('/api/plan', {
            body: JSON.stringify({ collection: 'mexican', brief: shortMoment }),
          })
        ).json()
      ).status,
      'ready',
    );
    assert.equal(
      (
        await (
          await sampleRequest('/api/discover', {
            body: JSON.stringify({
              collection: 'mexican',
              favorites: samplePop,
              feedback: {},
              easier: false,
            }),
          })
        ).json()
      ).mode,
      'fixture',
    );
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(sampleRequest('/api/status', { signal: controller.signal }));
  } finally {
    globalThis.fetch = original;
  }
});

test('expanded sample shelves have unique source-reviewed works with exact recording provenance', () => {
  assert.equal(demoLibrary.length, 9);
  assert.equal(publishedWorks.length, 90);
  assert.equal(new Set(publishedWorks.map((w) => w.id)).size, 90);
  for (const collection of demoLibrary.slice(3)) {
    const works = publishedWorks.filter((w) => w.collection === collection.id);
    assert.equal(works.filter((w) => w.kind === 'movie').length, 2);
    assert.equal(works.filter((w) => w.kind === 'artist').length, 3);
    assert.deepEqual(collection.workIds.slice().sort(), works.map((w) => w.id).sort());
    for (const work of works) {
      assert.equal(work.metadataStatus, 'reviewed');
      assert.equal(new URL(work.source!).protocol, 'https:');
      assert.equal(new URL(work.destination!).protocol, 'https:');
      assert.ok(work.checked && work.language && work.description && work.conversation);
      if (work.kind === 'artist') {
        assert.ok(Number.isInteger(work.songDuration?.durationMs));
        assert.ok(work.songDuration!.durationMs > 0);
        assert.equal(work.songDuration!.destination, work.destination);
        assert.equal(work.songDuration!.title, work.entry);
        assert.match(
          work.songDuration!.source,
          /^https:\/\/itunes.apple.com\/lookup\?country=us&id=\d+$/,
        );
      }
    }
  }
});
