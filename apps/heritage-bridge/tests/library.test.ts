import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import {
  library,
  libraryVersion,
  publishedWorks,
  albumWorks,
  validateLibrary,
} from '../shared/library';
import { connectionSchema } from '../server/policy';
import { DiscoveryService } from '../server/discovery';
import { createApp } from '../server/app';
import type { DiscoveryAgent } from '../server/gemini';
import type { Envelope } from '../server/qloo';
import { readLocal, writeLocal } from '../src/storage';
const input = {
  seedId: 'hindi-iqbal',
  liked: true as const,
  collection: 'tamil' as const,
  kind: 'artist' as const,
  excluded: [] as string[],
};
const unused = {
  call: async () => {
    throw Error('No provider call permitted');
  },
};
const agent: DiscoveryAgent = {
  rank: async (kinds, rank) => ({
    works: (await Promise.all(kinds.map(rank))).flat(),
    explanation: 'Mock evidence only',
  }),
};
test('published library has three reviewed collections and no duplicate song destinations', () => {
  assert.deepEqual(validateLibrary(), []);
  assert.equal(library.length, 3);
  assert.equal(publishedWorks.length, 60);
  assert.ok(library.every((c) => c.version === libraryVersion && c.workIds.length >= 5));
  assert.equal(albumWorks.length, 60);
  const bad = { ...library[0], workIds: ['hindi-iqbal', 'hindi-iqbal', 'missing'] };
  assert.equal(validateLibrary([bad]).length, 3);
  assert.ok(validateLibrary([{ ...library[0], workIds: ['tamil-meiyazhagan'] }]).length);
});
test('connection requires explicit like and rejects private notes and unbounded exclusions', () => {
  assert.ok(connectionSchema.safeParse(input).success);
  for (const v of [
    { ...input, liked: false },
    { ...input, liked: undefined },
    { ...input, note: 'private' },
    { ...input, excluded: Array(61).fill('x') },
  ])
    assert.equal(connectionSchema.safeParse(v).success, false);
});
test('fixture connections stay in requested collection and domain without claiming affinity', async () => {
  const s = new DiscoveryService(unused, agent, () => 'fixture');
  const r = await s.connect(input);
  assert.equal(r.works.length, 2);
  assert.ok(r.works.every((w) => w.collection === 'tamil' && w.kind === 'artist'));
  assert.match(r.message, /not verified taste connections/);
  assert.equal((await s.connect({ ...input, seedId: 'missing' })).status, 'needs_input');
  const empty = await s.connect({ ...input, excluded: publishedWorks.map((w) => w.id) });
  assert.equal(empty.status, 'empty');
});
test('live connection resolves the explicit seed, ranks one domain and rejects foreign IDs; repeat is cached', async () => {
  const pool = publishedWorks.map((w) => ({ ...w, qlooId: randomUUID() }));
  const calls: { name: string; args: Record<string, unknown> }[] = [];
  const qloo = {
    call: async (name: string, args: Record<string, unknown>): Promise<Envelope> => {
      calls.push({ name, args });
      if (name === 'qloo_describe') {
        const w = pool.find((w) => w.name === args.entity)!;
        return {
          status: 'ok',
          results: [
            {
              entity_id: w.qlooId,
              name: w.name,
              type: 'urn:entity:' + w.kind,
              properties: { release_year: w.year },
            },
          ],
        };
      }
      return {
        status: 'ok',
        results: [
          { entity_id: randomUUID(), name: 'Unapproved', type: 'urn:entity:artist', affinity: 1 },
          ...(args.options as string[]).map((id) => {
            const w = pool.find((w) => w.qlooId === id)!;
            return { entity_id: id, name: w.name, type: 'urn:entity:' + w.kind, affinity: 0.6 };
          }),
        ],
      };
    },
  };
  const service = new DiscoveryService(qloo, agent, () => 'live');
  const r = await service.connect({ ...input, excluded: ['tamil-harris'] });
  assert.equal(r.status, 'ok');
  assert.equal(r.works.length, 2);
  assert.ok(
    r.works.every(
      (w) => w.collection === 'tamil' && w.kind === 'artist' && w.id !== 'tamil-harris',
    ),
  );
  const ranks = calls.filter((c) => c.name === 'qloo_rank');
  assert.equal(ranks.length, 1);
  assert.equal(ranks[0].args.option_type, 'artist');
  assert.deepEqual(ranks[0].args.signals, [pool.find((w) => w.id === input.seedId)!.qlooId]);
  assert.ok(calls.length <= 12);
  const count = calls.length;
  await service.connect({ ...input, excluded: ['tamil-harris'] });
  assert.equal(calls.length, count);
});
test('failed or unavailable live connections cannot become fixtures', async () => {
  for (const mode of ['live', 'unavailable'] as const) {
    const r = await new DiscoveryService(unused, agent, () => mode).connect(input);
    assert.equal(r.status, 'error');
    assert.equal(r.works.length, 0);
    assert.equal(r.mode, mode);
  }
});
test('library and direct routes remain available when personalization is unavailable', async () => {
  const server = createApp(new DiscoveryService(unused, agent, () => 'unavailable')).listen(
    0,
    '127.0.0.1',
  );
  await once(server, 'listening');
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  try {
    const libraryResponse = await fetch(base + '/api/library');
    const body = await libraryResponse.json();
    assert.equal(body.works.length, 60);
    assert.equal(body.source, 'editorial');
    for (const route of [
      '/explore',
      '/album',
      '/collections/' + library[0].slug,
      '/works/hindi-iqbal',
    ]) {
      const r = await fetch(base + route);
      assert.equal(r.status, 200);
      assert.match(await r.text(), /id="root"/);
    }
    assert.equal((await fetch(base + '/api/missing')).status, 404);
    assert.equal((await fetch(base + '/.env')).status, 404);
    const r = await fetch(base + '/api/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    assert.equal((await r.json()).works.length, 0);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
test('existing album records survive the editorial origin extension', () => {
  const old = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  let value = JSON.stringify({
    notes: { hindi: 'A memory' },
    saved: [{ id: 'hindi-iqbal', mode: 'fixture', at: '2026-10-04', note: 'Kept' }],
    feedback: { 'hindi-iqbal': { interest: 'more', difficulty: 'difficult' } },
  });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: () => value,
      setItem: (_key: string, next: string) => {
        value = next;
      },
    },
  });
  try {
    const data = readLocal();
    assert.equal(data.saved[0].note, 'Kept');
    data.saved.push({ id: 'tamil-harris', mode: 'editorial', at: '2026-10-04', note: '' });
    assert.ok(writeLocal(data));
    assert.equal(readLocal().saved.length, 2);
    assert.equal(readLocal().feedback['hindi-iqbal'].difficulty, 'difficult');
  } finally {
    if (old) Object.defineProperty(globalThis, 'localStorage', old);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
