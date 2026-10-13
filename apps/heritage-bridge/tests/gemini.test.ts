import test from 'node:test';
import assert from 'node:assert/strict';
import { GenerateContentResponse, type FunctionCall } from '@google/genai';
import { GeminiAgent } from '../server/gemini';
import { eligibleCatalog } from '../server/catalog';
function response(calls: FunctionCall[]) {
  const r = new GenerateContentResponse();
  r.candidates = [
    { content: { role: 'model', parts: calls.map((functionCall) => ({ functionCall })) } },
  ];
  return r;
}
test('Gemini loop executes only scoped formats, preserves tool responses, and constrains explanation', async () => {
  let turns = 0;
  let charges = 0;
  const pool = eligibleCatalog('hindi');
  const agent = new GeminiAgent(async (input) => {
    turns++;
    if (turns === 1)
      return response([
        { id: 'a', name: 'rank_collection', args: { kind: 'movie' } },
        { id: 'b', name: 'rank_collection', args: { kind: 'artist' } },
      ]);
    assert.match(JSON.stringify(input.contents), /functionResponse/);
    return response([{ name: 'explain_choices', args: { framing: 'evidence' } }]);
  });
  const result = await agent.rank(
    ['movie', 'artist'],
    async (kind) => pool.filter((w) => w.kind === kind).slice(0, kind === 'movie' ? 2 : 1),
    () => {
      charges++;
    },
    { collection: 'Hindi', favorites: ['AURORA'] },
  );
  assert.equal(result.works.length, 3);
  assert.equal(charges, 2);
  assert.match(result.explanation, /returned rankings/);
});
test('Gemini cannot add an arbitrary Qloo tool or alter the signals', async () => {
  for (const call of [
    { name: 'qloo_recommend', args: { kind: 'movie' } },
    { name: 'rank_collection', args: { kind: 'movie', signals: ['invented'] } },
    { name: 'rank_collection', args: { kind: 'book' } },
  ]) {
    let rankCalls = 0;
    const agent = new GeminiAgent(async () => response([call]));
    await assert.rejects(
      agent.rank(
        ['movie'],
        async () => {
          rankCalls++;
          return [];
        },
        () => {},
      ),
      /GEMINI_TOOL_SCOPE/,
    );
    assert.equal(rankCalls, 0);
  }
});
test('duplicate model calls cannot exhaust the provider budget', async () => {
  let calls = 0;
  const agent = new GeminiAgent(async () =>
    response([
      { name: 'rank_collection', args: { kind: 'movie' } },
      { name: 'rank_collection', args: { kind: 'movie' } },
    ]),
  );
  await assert.rejects(
    agent.rank(
      ['movie', 'artist'],
      async () => {
        calls++;
        return [];
      },
      () => {},
    ),
    /GEMINI_TOOL_SCOPE/,
  );
  assert.equal(calls, 1);
});
test('free-form invented explanation is rejected', async () => {
  let turn = 0;
  const agent = new GeminiAgent(async () =>
    ++turn === 1
      ? response([{ name: 'rank_collection', args: { kind: 'movie' } }])
      : response([
          { name: 'explain_choices', args: { framing: '95% chance your child will love it' } },
        ]),
  );
  await assert.rejects(
    agent.rank(
      ['movie'],
      async () => [],
      () => {},
    ),
    /GEMINI_RESPONSE/,
  );
});
