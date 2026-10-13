import test from 'node:test';
import assert from 'node:assert/strict';
import { exampleListeners, resolveExample } from '../src/example-listeners';

test('example resolution preserves server identities and confirmation tokens in input order', async () => {
  const controller = new AbortController();
  const names: string[] = [];
  const request: typeof fetch = async (url, options) => {
    assert.equal(options?.signal, controller.signal);
    const name = new URL(String(url), 'http://localhost').searchParams.get('q')!;
    names.push(name);
    return Response.json({
      matches: [
        {
          id: name,
          name,
          kind: 'artist',
          token: 'signed-' + name,
          qlooId: 'qloo-' + name,
          subtitle: 'Artist',
        },
      ],
    });
  };
  const result = await resolveExample('pop', controller.signal, request);
  assert.deepEqual(names, [...exampleListeners[0].names]);
  assert.deepEqual(
    result.map((f) => f.token),
    names.map((name) => 'signed-' + name),
  );
});

test('an ambiguous, wrong-domain, missing or unavailable example fails before further searches', async () => {
  const match = { id: '1', name: 'Taylor Swift', kind: 'artist' };
  for (const response of [
    Response.json({ matches: [match, { ...match, id: '2' }] }),
    Response.json({ matches: [{ ...match, kind: 'movie' }] }),
    Response.json({ matches: [] }),
    Response.json({ error: 'budget' }, { status: 429 }),
  ]) {
    let calls = 0;
    await assert.rejects(
      resolveExample('pop', new AbortController().signal, async () => {
        calls++;
        return response;
      }),
    );
    assert.equal(calls, 1);
  }
});

test('cancelling an example never starts the next search or returns partial favorites', async () => {
  const controller = new AbortController();
  let calls = 0;
  await assert.rejects(
    resolveExample('pop', controller.signal, async () => {
      calls++;
      controller.abort();
      return Response.json({ matches: [{ id: '1', name: 'Taylor Swift', kind: 'artist' }] });
    }),
    { name: 'AbortError' },
  );
  assert.equal(calls, 1);
});
