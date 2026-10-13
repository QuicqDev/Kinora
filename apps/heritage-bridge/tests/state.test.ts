import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { PrivateState } from '../server/state';
import { IdentityResolver, catalogueMatch } from '../server/identity';
import { Budget } from '../server/policy';
import { albumWorks } from '../shared/library';
import { recordExperience, emptyLocal } from '../src/storage';

test('private state retains cache and enforces one daily budget across instances and restarts', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'heritage-state-'));
  const file = path.join(directory, 'state.sqlite');
  const a = new PrivateState(file),
    b = new PrivateState(file);
  try {
    const first = new Budget(2, a),
      second = new Budget(2, b);
    first.take();
    second.take();
    assert.equal(first.count, 2);
    assert.throws(() => first.take(), /LOCAL_BUDGET/);
    a.set('identity', { id: 'private-data' }, 60_000);
    assert.deepEqual(b.get('identity'), { id: 'private-data' });
    a.set('expired', { id: 'gone' }, -1);
    assert.equal(b.get('expired'), undefined);
  } finally {
    a.close();
    b.close();
  }
  const restarted = new PrivateState(file);
  try {
    assert.equal(restarted.count(), 2);
    assert.equal(restarted.charge(2), undefined);
  } finally {
    restarted.close();
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(tmpdir()));
    assert.ok(path.basename(directory).startsWith('heritage-state-'));
    rmSync(directory, { recursive: true, force: true });
  }
});

test('catalogue ambiguity resolves only a unique sourced title and year, and identities persist privately', async () => {
  const work = albumWorks.find((w) => w.id === 'hindi-iqbal')!;
  const id = randomUUID();
  const reply = {
    status: 'needs_input' as const,
    results: [],
    resolution: {
      issues: [
        {
          candidates: [
            { id, name: 'Iqbal', type: 'urn:entity:movie', release_year: 2005 },
            { id: randomUUID(), name: 'Iqbal', type: 'urn:entity:movie', release_year: 1998 },
          ],
        },
      ],
    },
  };
  assert.equal(catalogueMatch(reply, work)?.qlooId, id);
  assert.equal(catalogueMatch(reply, { ...work, year: 2006 }), undefined);
  const tied = structuredClone(reply);
  tied.resolution.issues[0].candidates[1].release_year = 2005;
  assert.equal(catalogueMatch(tied, work), undefined);
  let calls = 0,
    charged = 0;
  const provider = {
    call: async () => {
      calls++;
      return reply;
    },
  };
  const state = new PrivateState(':memory:');
  try {
    const resolver = new IdentityResolver(provider, () => charged++, state);
    const results = await Promise.all([resolver.resolve(work), resolver.resolve(work)]);
    assert.equal(results[0]?.qlooId, id);
    assert.equal(calls, 1);
    assert.equal(charged, 1);
    assert.equal(
      (await new IdentityResolver(provider, () => charged++, state).resolve(work))?.qlooId,
      id,
    );
    assert.equal(calls, 1);
    await resolver.resolve({ ...work, year: 2006 });
    assert.equal(calls, 2);
  } finally {
    state.close();
  }
});

test('experience recording never infers an encounter or a positive preference and preserves existing memories', () => {
  const work = albumWorks[0];
  const original = {
    ...emptyLocal,
    notes: { [work.id]: 'Our note' },
    saved: [{ id: work.id, at: '2026-10-04', mode: 'editorial' as const, note: 'Our note' }],
  };
  const tried = recordExperience(original, work, 'live', 'tried', '2026-10-06T10:00:00.000Z');
  assert.equal(tried.saved[0].at, original.saved[0].at);
  assert.equal(tried.saved[0].mode, 'editorial');
  assert.equal(tried.saved[0].note, 'Our note');
  assert.equal(tried.saved[0].triedAt, '2026-10-06T10:00:00.000Z');
  assert.deepEqual(tried.feedback, {});
  const repeat = recordExperience(tried, work, 'live', 'tried', '2026-10-07T10:00:00.000Z');
  assert.equal(repeat.saved[0].triedAt, tried.saved[0].triedAt);
  const want = recordExperience(repeat, work, 'live', 'want');
  assert.equal(want.saved[0].triedAt, undefined);
  assert.equal(want.saved[0].note, 'Our note');
  assert.equal(original.saved.length, 1);
  assert.equal(recordExperience(emptyLocal, work, 'live', 'want').saved[0].triedAt, undefined);
});
