import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { Qloo } from '../server/qloo';
test('verified ranking uses one official Insights request and requires response subtype evidence', async () => {
  const id = randomUUID(),
    signal = randomUUID();
  let calls = 0;
  const provider = new Qloo((async (url, init) => {
    calls++;
    const u = new URL(String(url));
    assert.equal(u.pathname, '/v2/insights');
    assert.equal(u.searchParams.get('filter.results.entities'), id);
    assert.equal(u.searchParams.get('signal.interests.entities'), signal);
    assert.equal(u.searchParams.get('filter.type'), 'urn:entity:movie');
    assert.equal(init?.redirect, 'error');
    return Response.json({
      results: {
        entities: [
          {
            entity_id: id,
            name: 'Film',
            type: 'urn:entity',
            subtype: 'urn:entity:movie',
            query: { affinity: 0.7 },
          },
          {
            entity_id: randomUUID(),
            name: 'Wrong',
            type: 'urn:entity',
            subtype: 'urn:entity:artist',
            affinity: 0.8,
          },
        ],
      },
    });
  }) as typeof fetch);
  const r = await provider.call('qloo_rank', {
    option_type: 'movie',
    options: [id],
    signals: [signal],
  });
  assert.equal(calls, 1);
  assert.equal((r.results[0] as any).type, 'urn:entity:movie');
  assert.equal((r.results[0] as any).affinity, 0.7);
  assert.equal((r.results[1] as any).type, 'unverified');
  await assert.rejects(
    provider.call('qloo_rank', {
      option_type: 'movie',
      options: ['unverified-name'],
      signals: [signal],
    }),
    /QLOO_RANK_INPUT/,
  );
  assert.equal(calls, 1);
});
test('official ranking rate limits, malformed responses and missing affinity cannot become valid ranks', async () => {
  for (const [response, code] of [
    [new Response('', { status: 429 }), 'QLOO_RATE_LIMIT'],
    [Response.json({ results: [] }), 'QLOO_SCHEMA'],
  ] as const) {
    const provider = new Qloo((async () => response) as typeof fetch);
    await assert.rejects(
      provider.call('qloo_rank', {
        option_type: 'artist',
        options: [randomUUID()],
        signals: [randomUUID()],
      }),
      new RegExp(code),
    );
  }
});
