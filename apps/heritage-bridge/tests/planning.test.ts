import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { GenerateContentResponse, type FunctionCall } from '@google/genai';
import { ActivityPlanner, fitsActivity, planRequestSchema } from '../server/planning';
import { publishedWorks } from '../shared/library';
import { cacheKey, requestSchema, signFavorite } from '../server/policy';
import { DiscoveryService } from '../server/discovery';
import { exampleFavorites } from '../shared/collections';
import type { DiscoveryRequest } from '../shared/types';
import type { Envelope } from '../server/qloo';

function response(call: FunctionCall) {
  const r = new GenerateContentResponse();
  r.candidates = [{ content: { role: 'model', parts: [{ functionCall: call }] } }];
  return r;
}
const signal = () => new AbortController().signal;
const films = { kind: 'movie' as const, maxMinutes: 110 };
const pool = publishedWorks.filter((w) => w.collection === 'mexican');
test('planner reads catalogue feedback before proposing a feasible time-bound plan', async () => {
  let turns = 0,
    charges = 0;
  const planner = new ActivityPlanner(async (input) => {
    if (++turns === 1) return response({ name: 'inspect_options', args: films });
    const contents = JSON.stringify(input.contents);
    assert.match(contents, /unknownRuntimeCount/);
    assert.match(contents, /Macario/);
    assert.doesNotMatch(contents, /Güeros/);
    return response({ name: 'propose_activity', args: { ...films, approach: 'film_time' } });
  });
  const result = await planner.plan(
    'A film within 110 minutes',
    'mexican',
    pool,
    () => charges++,
    signal(),
  );
  assert.equal(result.status, 'ready');
  assert.deepEqual(result.activity, films);
  assert.equal(result.eligibleCount, 7);
  assert.equal(charges, 2);
  assert.match(result.checks[0], /unknown runtimes excluded/);
});
test('planner can choose music or ask for input without a fixed sequence of ranking calls', async () => {
  let turns = 0;
  const music = { kind: 'artist', maxMinutes: null };
  const planner = new ActivityPlanner(async () =>
    response(
      ++turns === 1
        ? { name: 'inspect_options', args: music }
        : { name: 'propose_activity', args: { ...music, approach: 'listen_alongside' } },
    ),
  );
  const result = await planner.plan('Something while cooking', 'mexican', pool, () => {}, signal());
  assert.equal(result.activity?.kind, 'artist');
  assert.match(result.message, /carrying on/);
  for (const reason of ['unsupported', 'clarify', 'no_fit']) {
    const asking = new ActivityPlanner(async () =>
      response({ name: 'ask_question', args: { reason } }),
    );
    const answer = await asking.plan('A request', 'mexican', pool, () => {}, signal());
    assert.equal(answer.status, 'needs_input');
    assert.equal(answer.activity, undefined);
  }
});
test('uninspected, empty and altered proposals cannot become approved plans', async () => {
  for (const calls of [
    [{ name: 'propose_activity', args: { ...films, approach: 'film_time' } }],
    [
      { name: 'inspect_options', args: { kind: 'artist', maxMinutes: 1 } },
      {
        name: 'propose_activity',
        args: { kind: 'artist', maxMinutes: 1, approach: 'small_start' },
      },
    ],
    [
      { name: 'inspect_options', args: films },
      { name: 'propose_activity', args: { ...films, maxMinutes: 180, approach: 'film_time' } },
    ],
    [{ name: 'inspect_options', args: { ...films, subtitles: true } }],
    [{ name: 'qloo_rank', args: {} }],
  ]) {
    let i = 0;
    const planner = new ActivityPlanner(async () => response(calls[i++]));
    await assert.rejects(planner.plan('Film night', 'mexican', pool, () => {}, signal()));
  }
});
test('repeated tools, cancelled requests and exhausted budget stop model work', async () => {
  let calls = 0;
  const planner = new ActivityPlanner(async () => {
    calls++;
    return response({ name: 'inspect_options', args: films });
  });
  await assert.rejects(
    planner.plan('Film night', 'mexican', pool, () => {}, signal()),
    /ACTIVITY_TOOL_BUDGET/,
  );
  assert.equal(calls, 2);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(planner.plan('Film night', 'mexican', pool, () => {}, controller.signal));
  await assert.rejects(
    planner.plan(
      'Film night',
      'mexican',
      pool,
      () => {
        throw Error('LOCAL_BUDGET');
      },
      signal(),
    ),
    /LOCAL_BUDGET/,
  );
  assert.equal(calls, 2);
});
test('activity schema rejects hidden requirements and cache separates constraints', () => {
  const input: DiscoveryRequest = {
    collection: 'mexican',
    favorites: exampleFavorites.slice(0, 3),
    feedback: {},
    easier: false,
  };
  const key = cacheKey(input, 'live');
  assert.notEqual(key, cacheKey({ ...input, activity: films }, 'live'));
  assert.notEqual(
    cacheKey({ ...input, activity: films }, 'live'),
    cacheKey({ ...input, activity: { ...films, maxMinutes: 90 } }, 'live'),
  );
  assert.equal(
    requestSchema.safeParse({ ...input, activity: { ...films, age: 8 } }).success,
    false,
  );
  assert.equal(
    planRequestSchema.safeParse({
      collection: 'mexican',
      brief: 'Film night',
      excluded: [],
      notes: 'private',
    }).success,
    false,
  );
  assert.equal(pool.filter((w) => fitsActivity(w, { kind: 'artist', maxMinutes: 5 })).length, 4);
});
test('confirmed plan limits live identity lookups and Qloo ranking, preserves exclusions and rejects foreign results', async () => {
  const identified = pool.map((w) => ({ ...w, qlooId: randomUUID() }));
  const calls: { name: string; args: Record<string, unknown> }[] = [];
  const qloo = {
    call: async (name: string, args: Record<string, unknown>): Promise<Envelope> => {
      calls.push({ name, args });
      if (name === 'qloo_describe') {
        const w = identified.find((w) => w.name === args.entity)!;
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
        results: [
          ...identified
            .filter((w) => (args.options as string[]).includes(w.qlooId))
            .map((w) => ({
              entity_id: w.qlooId,
              name: w.name,
              type: `urn:entity:${w.kind}`,
              affinity: 0.5,
            })),
          { entity_id: randomUUID(), name: 'Invented', type: 'urn:entity:movie', affinity: 1 },
        ],
      };
    },
  };
  const favorites = exampleFavorites.slice(0, 3).map((f) => {
    const v = { ...f, id: randomUUID(), qlooId: randomUUID() };
    return { ...v, token: signFavorite(v) };
  });
  const input: DiscoveryRequest = {
    collection: 'mexican',
    favorites,
    feedback: {},
    easier: false,
    activity: films,
    tried: [pool.find((w) => w.name === 'Macario')!.id],
  };
  const service = new DiscoveryService(
    qloo,
    {
      rank: async () => {
        throw Error('Fixed model ranking loop should be skipped');
      },
    },
    () => 'live',
  );
  const result = await service.discover(input);
  assert.equal(result.status, 'ok');
  assert.equal(result.works.length, 2);
  assert.ok(result.works.every((w) => fitsActivity(w, films) && !input.tried!.includes(w.id)));
  const ranks = calls.filter((c) => c.name === 'qloo_rank');
  assert.equal(ranks.length, 1);
  assert.equal(ranks[0].args.option_type, 'movie');
  assert.ok(
    calls
      .filter((c) => c.name === 'qloo_describe')
      .every((c) =>
        fitsActivity(
          pool.find((w) => w.name === c.args.entity)!,
          films,
        ),
      ),
  );
  const count = calls.length;
  await service.discover(input);
  assert.equal(calls.length, count);
  const empty = await service.discover({ ...input, activity: { kind: 'artist', maxMinutes: 1 } });
  assert.equal(empty.status, 'empty');
  assert.equal(calls.length, count);
  const music = await service.discover({
    ...input,
    activity: { kind: 'artist', maxMinutes: 5 },
  });
  assert.equal(music.status, 'ok');
  assert.equal(music.works.length, 1);
  assert.equal(music.works[0].kind, 'artist');
  assert.ok(fitsActivity(music.works[0], { kind: 'artist', maxMinutes: 5 }));
  assert.ok(
    calls
      .filter((c) => c.name === 'qloo_rank' && c.args.option_type === 'artist')
      .every((c) =>
        (c.args.options as string[]).every((id) =>
          fitsActivity(
            identified.find((w) => w.qlooId === id)!,
            { kind: 'artist', maxMinutes: 5 },
          ),
        ),
      ),
  );
});

test('planner receives exact recording durations and can propose a short song', async () => {
  let turns = 0;
  const activity = { kind: 'artist' as const, maxMinutes: 5 };
  const planner = new ActivityPlanner(async (input) => {
    if (++turns === 1) return response({ name: 'inspect_options', args: activity });
    const contents = JSON.stringify(input.contents);
    assert.match(contents, /Primeras Canciones/);
    assert.match(contents, /startingSong/);
    assert.match(contents, /durationVerified/);
    assert.doesNotMatch(contents, /Café Tacvba/);
    return response({ name: 'propose_activity', args: { ...activity, approach: 'small_start' } });
  });
  const result = await planner.plan(
    'A song lasting at most five minutes',
    'mexican',
    pool,
    () => {},
    signal(),
  );
  assert.equal(result.status, 'ready');
  assert.equal(result.eligibleCount, 4);
  assert.deepEqual(result.activity, activity);
});
