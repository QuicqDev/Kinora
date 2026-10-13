import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../server/app';
import { DiscoveryService } from '../server/discovery';
import { exampleFavorites } from '../shared/collections';

test('planning HTTP boundary validates the brief and shares request admission without passing album notes', async () => {
  const service = new DiscoveryService(undefined, undefined, () => 'fixture');
  let seen: unknown;
  service.plan = async (input) => {
    seen = input;
    return { status: 'needs_input', message: 'Revise the request.', checks: [] };
  };
  const server = createApp(service).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const valid = { collection: 'mexican', brief: 'A film within 90 minutes', excluded: [] };
  const post = (body: unknown) =>
    fetch(base + '/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  try {
    for (const body of [{}, { ...valid, notes: 'private' }, { ...valid, brief: 'a'.repeat(501) }])
      assert.equal((await post(body)).status, 400);
    assert.equal(seen, undefined);
    const reply = await post(valid);
    assert.equal(reply.status, 200);
    assert.equal((await reply.json()).status, 'needs_input');
    assert.deepEqual(seen, valid);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
test('HTTP boundary validates input, rejects foreign origins and never serves root secrets', async () => {
  const service = new DiscoveryService(undefined, undefined, () => 'fixture');
  const server = createApp(service).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  try {
    const status = await fetch(base + '/api/status');
    const data = await status.json();
    assert.equal(data.collections.length, 3);
    assert.equal(data.coverage.length, 3);
    assert.ok(!JSON.stringify(data).includes('API_KEY'));
    assert.equal((await fetch(base + '/.env')).status, 404);
    assert.equal(
      (
        await fetch(base + '/api/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await fetch(base + '/api/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Origin: 'https://foreign.example' },
          body: '{}',
        })
      ).status,
      403,
    );
    const valid = await fetch(base + '/api/discover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collection: 'tamil',
        favorites: exampleFavorites.slice(0, 3),
        feedback: {},
        easier: false,
      }),
    });
    assert.equal(valid.status, 200);
    const result = await valid.json();
    assert.ok(result.works.every((w: { collection: string }) => w.collection === 'tamil'));
    for (let i = 0; i < 15; i++) {
      const r = await fetch(base + '/api/search?q=aurora&kind=artist');
      if (i === 14) {
        assert.equal(r.status, 429);
        assert.ok(r.headers.get('Retry-After'));
      }
    }
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
