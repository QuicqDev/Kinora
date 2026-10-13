import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { DiscoveryService } from '../server/discovery';
import { createApp } from '../server/app';
import { config } from '../server/config';
import { publishedWorks } from '../shared/library';
import { signFavorite, requestSchema } from '../server/policy';
import { ServiceError, type Envelope } from '../server/qloo';
import { exampleFavorites } from '../shared/collections';
import { readLocal, writeLocal } from '../src/storage';
import { execFileSync } from 'node:child_process';
import { PrivateState } from '../server/state';
import { IdentityResolver, identityKey } from '../server/identity';

function harness(failure?: string) {
  const pool = publishedWorks.map((w) => ({ ...w, qlooId: randomUUID() }));
  const ranks: Record<string, unknown>[] = [];
  let failed = false;
  const qloo = {
    call: async (name: string, args: Record<string, unknown>): Promise<Envelope> => {
      if (name === 'qloo_describe') {
        if (failure && !failed) {
          failed = true;
          throw new ServiceError(failure, true);
        }
        const work = pool.find((w) => w.name === args.entity)!;
        return {
          status: 'ok',
          results: [
            {
              entity_id: work.qlooId,
              name: work.name,
              type: `urn:entity:${work.kind}`,
              properties: { release_year: work.year },
            },
          ],
        };
      }
      ranks.push(args);
      return {
        status: 'ok',
        results: (args.options as string[]).map((id, i) => {
          const w = pool.find((w) => w.qlooId === id)!;
          return {
            entity_id: id,
            name: w.name,
            type: `urn:entity:${w.kind}`,
            affinity: 1 - i / 100,
          };
        }),
      };
    },
  };
  const agent = {
    rank: async (
      kinds: ('movie' | 'artist')[],
      rank: (kind: 'movie' | 'artist') => Promise<any[]>,
    ) => ({ works: (await Promise.all(kinds.map(rank))).flat(), explanation: 'Synthetic' }),
  };
  const favorites = [
    pool.find((w) => w.id === 'hindi-iqbal')!,
    ...pool.filter((w) => w.collection === 'mexican').slice(0, 2),
  ].map((w) => {
    const f = {
      id: w.qlooId,
      qlooId: w.qlooId,
      name: w.name,
      kind: w.kind,
      subtitle: String(w.year ?? ''),
    };
    return { ...f, token: signFavorite(f) };
  });
  return { pool, ranks, favorites, service: new DiscoveryService(qloo, agent, () => 'live') };
}

test('foreign likes cannot displace relevant signals; favorites, likes and tried works are not next discoveries', async () => {
  const { pool, ranks, favorites, service } = harness();
  const foreign = Object.fromEntries(
    pool
      .filter((w) => w.collection === 'mexican')
      .slice(0, 7)
      .map((w) => [w.id, { interest: 'more' as const }]),
  );
  const liked = pool.find((w) => w.id === 'hindi-udit')!;
  const result = await service.discover({
    collection: 'hindi',
    favorites,
    feedback: { ...foreign, [liked.id]: { interest: 'more' } },
    easier: false,
    tried: ['hindi-ddlj'],
  });
  assert.equal(result.works.length, 3);
  assert.ok(ranks.every((r) => (r.signals as string[]).includes(liked.qlooId)));
  assert.ok(ranks.every((r) => (r.options as string[]).length <= 10));
  assert.ok(result.works.every((w) => !['hindi-iqbal', 'hindi-ddlj', liked.id].includes(w.id)));
  assert.ok(ranks.every((r) => !(r.options as string[]).includes(favorites[0].qlooId)));
  assert.equal(
    requestSchema.safeParse({
      collection: 'hindi',
      favorites,
      feedback: {},
      easier: false,
      tried: ['hindi-iqbal'],
      notes: 'private',
    }).success,
    false,
  );
});

test('one transient identity failure yields partial real results, while auth failures stop discovery', async () => {
  for (const code of ['QLOO_TIMEOUT', 'QLOO_AUTH', 'QLOO_RATE_LIMIT', 'LOCAL_BUDGET']) {
    const h = harness(code);
    const result = await h.service.discover({
      collection: 'hindi',
      favorites: h.favorites,
      feedback: {},
      easier: false,
    });
    if (code === 'QLOO_TIMEOUT') {
      assert.equal(result.status, 'partial');
      assert.equal(result.works.length, 3);
      assert.match(result.message, /temporarily unavailable/);
      const retry = await h.service.discover({
        collection: 'hindi',
        favorites: h.favorites,
        feedback: {},
        easier: false,
      });
      assert.equal(retry.status, 'ok');
      assert.equal(h.ranks.length, 4, 'temporary failures must not cache the partial result');
    } else {
      assert.equal(result.status, 'error');
      assert.equal(h.ranks.length, 0);
    }
  }
});

const input = JSON.stringify({
  collection: 'hindi',
  favorites: exampleFavorites.slice(0, 3),
  feedback: {},
  easier: false,
});
async function localServer(service: DiscoveryService, settings = config) {
  const server = createApp(service, settings).listen(0, '127.0.0.1');
  await once(server, 'listening');
  return {
    url: `http://127.0.0.1:${(server.address() as { port: number }).port}`,
    close: async () => {
      server.closeAllConnections();
      await new Promise<void>((r) => server.close(() => r()));
    },
  };
}
test('disconnect and deadline retain the slot until backend work actually stops', async () => {
  const releases: (() => void)[] = [];
  let active = 0;
  const service = {
    discover: async () => {
      active++;
      await new Promise<void>((r) => releases.push(r));
      active--;
      return { works: [] };
    },
  } as unknown as DiscoveryService;
  const host = await localServer(service, {
    ...config,
    requestLimit: 30,
    clientDailyLimit: 3,
    requestTimeout: 120_000,
  });
  const pending: Promise<unknown>[] = [];
  const post = (signal?: AbortSignal) =>
    fetch(host.url + '/api/discover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: input,
      signal,
    });
  const waitActive = async (n: number) => {
    for (let i = 0; active !== n && i < 100; i++) await new Promise((r) => setTimeout(r, 5));
    assert.equal(active, n);
  };
  try {
    const controller = new AbortController();
    pending.push(post(controller.signal).catch(() => null));
    await waitActive(1);
    controller.abort();
    pending.push(post());
    await waitActive(2);
    assert.equal((await post()).status, 429);
    assert.equal(active, 2);
    releases.forEach((r) => r());
    await Promise.allSettled(pending);
    await waitActive(0);
    const accepted = post();
    pending.push(accepted);
    await waitActive(1);
    releases.at(-1)!();
    assert.equal((await accepted).status, 200, 'busy rejection must not consume daily quota');
  } finally {
    releases.forEach((r) => r());
    await Promise.allSettled(pending);
    await host.close();
  }
  let observed: AbortSignal | undefined;
  const timedService = {
    discover: async (_: unknown, signal: AbortSignal) => {
      observed = signal;
      await new Promise((r) => signal.addEventListener('abort', r, { once: true }));
      throw Error('aborted');
    },
  } as unknown as DiscoveryService;
  const timed = await localServer(timedService, { ...config, requestTimeout: 30 });
  try {
    assert.equal(
      (
        await fetch(timed.url + '/api/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: input,
        })
      ).status,
      504,
    );
    assert.ok(observed?.aborted);
  } finally {
    await timed.close();
  }
});

test('configured HTTPS origin works, foreign origins fail, and daily client limits preserve browsing', async () => {
  const host = await localServer(new DiscoveryService(undefined, undefined, () => 'fixture'), {
    ...config,
    publicOrigin: 'https://heritage.example',
    trustProxy: ['127.0.0.1/32'],
    clientDailyLimit: 1,
  });
  const post = (origin: string, address = '203.0.113.1') =>
    fetch(host.url + '/api/discover', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
        'X-Forwarded-For': address,
      },
      body: input,
    });
  try {
    assert.equal((await post('https://foreign.example')).status, 403);
    assert.equal((await post('https://heritage.example')).status, 200);
    assert.equal((await post('https://heritage.example')).status, 429);
    assert.equal((await post('https://heritage.example', '203.0.113.2')).status, 200);
    assert.equal((await fetch(host.url + '/api/library')).status, 200);
    assert.equal((await fetch(host.url + '/album')).status, 200);
  } finally {
    await host.close();
  }
});

test('public loopback startup requires explicit trusted proxy ranges', () => {
  const args = [
    '--import',
    'tsx',
    '--input-type=module',
    '-e',
    "import {config} from './server/config.ts'; console.log(config.trustProxy.length);",
  ];
  const env = {
    ...process.env,
    HERITAGE_MODE: 'fixture',
    HERITAGE_PUBLIC_ORIGIN: 'https://heritage.example',
    HERITAGE_HOST: '127.0.0.1',
    HERITAGE_TRUST_PROXY: '',
  };
  assert.throws(
    () => execFileSync(process.execPath, args, { env, encoding: 'utf8', stdio: 'pipe' }),
    /requires explicit trusted proxy/,
  );
  assert.equal(
    execFileSync(process.execPath, args, {
      env: { ...env, HERITAGE_TRUST_PROXY: '127.0.0.1/32' },
      encoding: 'utf8',
    }).trim(),
    '1',
  );
});

test('one damaged album record preserves other memories and archives the original before saving', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const original = JSON.stringify({
    notes: { hindi: 'Keep this' },
    saved: [
      { id: 'hindi-iqbal', mode: 'live', at: '2026-10-07', note: 'A memory' },
      { id: 'broken', mode: 'unknown' },
    ],
    feedback: {},
  });
  const entries = new Map([['heritage-bridge.v1', original]]);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => entries.get(key),
      setItem: (key: string, value: string) => entries.set(key, value),
    },
  });
  try {
    const data = readLocal();
    assert.equal(data.saved.length, 1);
    assert.equal(data.notes.hindi, 'Keep this');
    assert.ok(writeLocal(data));
    assert.equal(entries.get('heritage-bridge.v1.recovery'), original);
    assert.equal(readLocal().saved[0].note, 'A memory');
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

test('reading a persisted identity cannot silently renew its expiry', async () => {
  const work = publishedWorks[0],
    id = randomUUID();
  const reply: Envelope = {
    status: 'ok',
    results: [
      {
        entity_id: id,
        name: work.name,
        type: 'urn:entity:' + work.kind,
        properties: { release_year: work.year },
      },
    ],
  };
  const state = new PrivateState(':memory:');
  let calls = 0;
  const resolver = new IdentityResolver(
    {
      call: async () => {
        calls++;
        return reply;
      },
    },
    () => {},
    state,
  );
  try {
    state.set(identityKey(work), { reply }, 60_000);
    assert.equal((await resolver.resolve(work))?.qlooId, id);
    state.set(identityKey(work), { reply }, -1);
    assert.equal((await resolver.resolve(work))?.qlooId, id);
    assert.equal(calls, 1);
  } finally {
    state.close();
  }
});

test('configured confirmation signing survives separate server processes', () => {
  const favorite = {
    id: randomUUID(),
    name: 'Synthetic favorite',
    kind: 'artist',
    subtitle: '',
    qlooId: randomUUID(),
  };
  const env = {
    ...process.env,
    HERITAGE_SIGNING_SECRET: 'synthetic-test-secret-at-least-32-characters',
    HERITAGE_MODE: 'fixture',
  };
  const token = execFileSync(
    process.execPath,
    [
      '--import',
      'tsx',
      '--input-type=module',
      '-e',
      "import {signFavorite} from './server/policy.ts'; console.log(signFavorite(JSON.parse(process.argv[1])));",
      JSON.stringify(favorite),
    ],
    { env, encoding: 'utf8' },
  ).trim();
  const valid = execFileSync(
    process.execPath,
    [
      '--import',
      'tsx',
      '--input-type=module',
      '-e',
      "import {verifyFavorite} from './server/policy.ts'; console.log(verifyFavorite(JSON.parse(process.argv[1])));",
      JSON.stringify({ ...favorite, token }),
    ],
    { env, encoding: 'utf8' },
  ).trim();
  assert.equal(valid, 'true');
});
