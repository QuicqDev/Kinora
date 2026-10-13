import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { DiscoveryService } from '../server/discovery';
import { eligibleCatalog, coverage } from '../server/catalog';
import { exampleFavorites } from '../shared/collections';
import {
  Budget,
  cacheKey,
  candidates,
  requestSchema,
  signFavorite,
  validateRanking,
  verifyFavorite,
} from '../server/policy';
import { decodeEnvelope, type Envelope } from '../server/qloo';
import type { DiscoveryRequest, Favorite } from '../shared/types';
import type { DiscoveryAgent } from '../server/gemini';
const base: DiscoveryRequest = {
  collection: 'hindi',
  favorites: exampleFavorites.slice(0, 3),
  feedback: {},
  easier: false,
};
const unused = {
  call: async () => {
    throw new Error('Fixture must never call Qloo');
  },
};
const agent: DiscoveryAgent = {
  rank: async (kinds, rank) => ({
    works: (await Promise.all(kinds.map(rank))).flat(),
    explanation: 'Mock orchestration; not model evidence.',
  }),
};
const service = () => new DiscoveryService(unused, agent, () => 'fixture');
test('all three collections have 12 film and 8 artist candidates, with independent reviewed entry points', () => {
  for (const c of coverage()) {
    assert.equal(c.candidates, 20);
    assert.equal(c.films, 12);
    assert.equal(c.artists, 8);
    assert.equal(c.resolved, null);
    assert.ok(c.reviewed >= 3);
  }
});
test('all collections complete fixture flow without provider calls or fabricated Qloo IDs', async () => {
  for (const collection of ['hindi', 'tamil', 'mexican'] as const) {
    const r = await service().discover({ ...base, collection });
    assert.equal(r.mode, 'fixture');
    assert.equal(r.works.length, 3);
    assert.ok(
      r.works.every((w) => w.collection === collection && !w.qlooId && w.source && w.destination),
    );
    assert.match(r.message, /not personalized/);
  }
});
test('dislike removes only its item; difficulty and likes remain independent', async () => {
  const s = service();
  const difficulty = await s.discover({
    ...base,
    feedback: { 'hindi-iqbal': { interest: 'more', difficulty: 'difficult' } },
  });
  assert.ok(difficulty.works.every((w) => w.id !== 'hindi-iqbal'));
  const difficultyOnly = await s.discover({
    ...base,
    feedback: { 'hindi-iqbal': { difficulty: 'difficult' } },
  });
  assert.ok(difficultyOnly.works.some((w) => w.id === 'hindi-iqbal'));
  const disliked = await s.discover({ ...base, feedback: { 'hindi-iqbal': { interest: 'no' } } });
  assert.equal(disliked.works.length, 3);
  assert.ok(disliked.works.every((w) => w.id !== 'hindi-iqbal'));
  const unknown = await s.discover({ ...base, easier: true });
  assert.equal(unknown.status, 'empty');
  assert.equal(unknown.works.length, 0);
});
test('all exclusions give honest empty result', async () => {
  const feedback = Object.fromEntries(
    eligibleCatalog('hindi').map((w) => [w.id, { interest: 'no' as const }]),
  );
  assert.equal((await service().discover({ ...base, feedback })).status, 'empty');
});
test('cache isolates collections, mode, favorites, difficulty and feedback', () => {
  const key = cacheKey(base, 'live');
  for (const input of [
    { ...base, collection: 'tamil' as const },
    { ...base, easier: true },
    { ...base, feedback: { 'hindi-iqbal': { interest: 'no' as const } } },
    { ...base, favorites: exampleFavorites.slice(1, 4) },
  ])
    assert.notEqual(key, cacheKey(input, 'live'));
  assert.notEqual(key, cacheKey(base, 'fixture'));
  assert.equal(key, cacheKey({ ...base, favorites: [...base.favorites].reverse() }, 'live'));
  assert.equal(
    cacheKey({ ...base, feedback: { a: { interest: 'more', difficulty: 'help' } } }, 'live'),
    cacheKey({ ...base, feedback: { a: { difficulty: 'help', interest: 'more' } } }, 'live'),
  );
  const reordered = base.favorites.map((f) => ({
    subtitle: f.subtitle,
    kind: f.kind,
    name: f.name,
    id: f.id,
    qlooId: f.qlooId,
  }));
  assert.equal(
    key,
    cacheKey(
      {
        easier: base.easier,
        feedback: base.feedback,
        favorites: reordered,
        collection: base.collection,
      },
      'live',
    ),
  );
});
test('request rejects duplicate favorites and parent notes in provider payload', () => {
  assert.equal(requestSchema.safeParse({ ...base, note: 'private' }).success, false);
  assert.equal(
    requestSchema.safeParse({
      ...base,
      favorites: [base.favorites[0], base.favorites[0], base.favorites[1]],
    }).success,
    false,
  );
});
test('server confirmation signatures cannot be forged or edited', () => {
  const f: Favorite = { ...base.favorites[0], id: randomUUID(), qlooId: randomUUID() };
  f.token = signFavorite(f);
  assert.ok(verifyFavorite(f));
  assert.equal(verifyFavorite({ ...f, name: 'changed' }), false);
  assert.equal(verifyFavorite({ ...f, token: 'fake' }), false);
});
test('ambiguity returns choices, not an automatically selected signal', () => {
  const id = randomUUID();
  const choices = candidates(
    {
      status: 'needs_input',
      results: [],
      resolution: {
        issues: [
          {
            candidates: [
              { id, name: 'AURORA', type: 'urn:entity:artist', description: 'A Norwegian singer' },
            ],
          },
        ],
      },
    },
    'artist',
  );
  assert.equal(choices.length, 1);
  assert.equal(choices[0].qlooId, id);
  assert.equal(choices[0].subtitle, 'A Norwegian singer');
  assert.ok(verifyFavorite(choices[0]));
  assert.equal(
    candidates(
      { status: 'ok', results: [{ entity_id: id, name: 'AURORA', type: 'urn:entity:movie' }] },
      'artist',
    ).length,
    0,
  );
});
test('rank validation excludes foreign IDs, wrong domains, missing affinities, duplicates and malformed entities', () => {
  const w = { ...eligibleCatalog('hindi')[0], qlooId: randomUUID() };
  const item = { entity_id: w.qlooId, name: w.name, type: 'urn:entity:movie', affinity: 0.4 };
  const result: Envelope = {
    status: 'ok',
    results: [
      item,
      item,
      { ...item, entity_id: randomUUID() },
      { ...item, type: 'urn:entity:artist' },
      { ...item, affinity: undefined },
      null,
    ],
  };
  assert.deepEqual(validateRanking(result, [w]), [w]);
  assert.equal(validateRanking({ ...result, status: 'error' }, [w]).length, 0);
});
test('bad envelopes fail closed', () => {
  assert.throws(() => decodeEnvelope({ content: [{ type: 'text', text: '{"status":"great"}' }] }));
  assert.equal(
    decodeEnvelope({ structuredContent: { status: 'empty', results: [] } }).status,
    'empty',
  );
});

test('missing detail types use matching resolved evidence and cannot retype foreign or conflicting entities', () => {
  const id = randomUUID();
  const foreign = randomUUID();
  const raw = { entity_id: id, name: 'Example Artist', properties: { description: 'Source fact' } };
  const resolved = { entityId: id, name: raw.name, type: 'urn:entity:artist' };
  const describe = decodeEnvelope({
    structuredContent: {
      status: 'ok',
      results: [raw],
      interpretation: { entity: resolved },
    },
  });
  assert.equal(candidates(describe, 'artist').length, 1);
  const ranked = decodeEnvelope({
    structuredContent: {
      status: 'ok',
      results: [
        raw,
        { ...raw, entity_id: foreign },
        { ...raw, name: 'Other Artist' },
        { ...raw, type: 'urn:entity:movie' },
      ],
      interpretation: { options: [resolved] },
    },
  });
  assert.equal((ranked.results[0] as { type?: string }).type, 'urn:entity:artist');
  assert.equal((ranked.results[1] as { type?: string }).type, undefined);
  assert.equal((ranked.results[2] as { type?: string }).type, undefined);
  assert.equal((ranked.results[3] as { type?: string }).type, 'urn:entity:movie');
  const conflict = decodeEnvelope({
    structuredContent: {
      status: 'ok',
      results: [raw],
      interpretation: { options: [resolved, { ...resolved, type: 'urn:entity:movie' }] },
    },
  });
  assert.equal(candidates(conflict, 'artist').length, 0);
  const generic = decodeEnvelope({
    structuredContent: {
      status: 'ok',
      results: [
        { ...raw, type: 'urn:entity', subtype: 'urn:entity:artist', affinity: 0.5 },
        { ...raw, type: 'urn:entity', subtype: 'urn:entity:movie', affinity: 0.6 },
      ],
      interpretation: { options: [resolved] },
    },
  });
  assert.equal((generic.results[0] as { type: string }).type, 'urn:entity:artist');
  assert.equal((generic.results[1] as { type: string }).type, 'urn:entity');
});
test('unavailable and unconfirmed live inputs never yield fixtures', async () => {
  const offline = new DiscoveryService(unused, agent, () => 'unavailable');
  const r = await offline.discover(base);
  assert.equal(r.status, 'error');
  assert.equal(r.works.length, 0);
  const live = new DiscoveryService(unused, agent, () => 'live');
  const q = await live.discover(base);
  assert.equal(q.status, 'needs_input');
  assert.equal(q.works.length, 0);
});
test('live mocked chain validates returned identities and uses distinct bounded domain rankings', async () => {
  const calls: { name: string; args: Record<string, unknown> }[] = [];
  const pool = eligibleCatalog('hindi').map((w) => ({ ...w, qlooId: randomUUID() }));
  const qloo = {
    call: async (name: string, args: Record<string, unknown>): Promise<Envelope> => {
      calls.push({ name, args });
      if (name === 'qloo_describe') {
        const w = pool.find((x) => x.name === args.entity)!;
        return {
          status: 'ok',
          results: [
            {
              entity_id: w.qlooId,
              name: w.name,
              type: `urn:entity:${w.kind}`,
              properties: { release_year: w.year },
            },
          ],
        };
      }
      return {
        status: 'ok',
        results: (args.options as string[]).map((id) => {
          const w = pool.find((w) => w.qlooId === id)!;
          return { entity_id: id, name: w.name, type: `urn:entity:${w.kind}`, affinity: 0.5 };
        }),
      };
    },
  };
  const favorites = base.favorites.map((f) => {
    const v = { ...f, id: randomUUID(), qlooId: randomUUID() };
    return { ...v, token: signFavorite(v) };
  });
  const live = new DiscoveryService(qloo, agent, () => 'live');
  const input = { ...base, favorites };
  const r = await live.discover(input);
  assert.equal(r.mode, 'live');
  assert.equal(r.works.length, 3);
  assert.equal(r.status, 'ok');
  const ranking = calls.filter((c) => c.name === 'qloo_rank');
  assert.deepEqual(ranking.map((c) => c.args.option_type).sort(), ['artist', 'movie']);
  assert.ok(ranking.every((c) => (c.args.options as string[]).length <= 10));
  const count = calls.length;
  await live.discover(input);
  assert.equal(calls.length, count);
  const liked = await live.discover({
    ...input,
    feedback: { 'hindi-iqbal': { interest: 'more', difficulty: 'help' } },
  });
  assert.equal(liked.works.length, 3);
  assert.ok(calls.at(-1)?.args.signals instanceof Array);
  assert.equal((calls.at(-1)?.args.signals as string[]).length, 4);
});
test('provider failures produce errors rather than synthetic recommendations', async () => {
  const favorites = base.favorites.map((f) => {
    const v = { ...f, id: randomUUID(), qlooId: randomUUID() };
    return { ...v, token: signFavorite(v) };
  });
  const r = await new DiscoveryService(unused, agent, () => 'live').discover({
    ...base,
    favorites,
  });
  assert.equal(r.status, 'error');
  assert.equal(r.works.length, 0);
});
test('daily provider-call budget is a hard ceiling', () => {
  const b = new Budget(2);
  b.take();
  b.take();
  assert.throws(() => b.take(), /LOCAL_BUDGET/);
});
