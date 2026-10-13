import test from 'node:test';
import assert from 'node:assert/strict';
import {
  inspectCollection,
  inspectCollectionSchema,
  modelContextFor,
  prepareBridgeSchema,
  registerPageTools,
  type ModelContext,
  type PageTool,
} from '../src/webmcp';

test('WebMCP catalogue inspection enforces duration and emits only public work data', () => {
  const result = inspectCollection({ collection: 'mexican', kind: 'artist', maxMinutes: 5 });
  assert.equal(result.works.length, 4);
  assert.ok(result.works.every((w) => w.durationMs! <= 300000 && w.durationSource));
  assert.equal(
    inspectCollection({ collection: 'hindi', kind: 'movie', maxMinutes: 90 }).works.length,
    0,
  );
  assert.equal(
    inspectCollectionSchema.safeParse({
      collection: 'mexican',
      kind: 'artist',
      maxMinutes: 5,
      notes: 'private',
    }).success,
    false,
  );
  assert.equal(
    prepareBridgeSchema.safeParse({
      collection: 'hindi',
      brief: 'A song',
      favorites: 'pop',
      confirmed: true,
    }).success,
    false,
  );
  assert.equal(
    prepareBridgeSchema.safeParse({ collection: 'hindi', brief: 'x'.repeat(501), favorites: 'pop' })
      .success,
    false,
  );
  assert.equal(
    prepareBridgeSchema.safeParse({ collection: 'hindi', brief: 'A song', favorites: 'invented' })
      .success,
    false,
  );
});

test('WebMCP feature detection prefers Document, supports previews, and leaves unsupported browsers alone', () => {
  const modern: ModelContext = { registerTool: () => {} };
  const preview: ModelContext = { registerTool: () => {} };
  assert.equal(modelContextFor({ modelContext: modern }, { modelContext: preview }), modern);
  assert.equal(modelContextFor({}, { modelContext: preview }), preview);
  assert.equal(modelContextFor({}, {}), undefined);
});

const tool: PageTool = {
  name: 'test_tool',
  description: 'Test',
  inputSchema: { type: 'object' },
  execute: async () => 'ok',
};
test('WebMCP registration cleans up modern and preview tools on unmount', async () => {
  let signal: AbortSignal | undefined;
  const removed: string[] = [];
  const registration = registerPageTools(
    {
      registerTool: (_tool, options) => {
        signal = options?.signal;
      },
      unregisterTool: (name) => {
        removed.push(name);
      },
    },
    [tool],
  );
  await registration.ready;
  assert.equal(signal?.aborted, false);
  registration.dispose();
  registration.dispose();
  assert.equal(signal?.aborted, true);
  assert.deepEqual(removed, ['test_tool']);
});

test('unmount during asynchronous registration cannot leave a stale preview tool', async () => {
  let finish!: () => void;
  const removed: string[] = [];
  const registration = registerPageTools(
    {
      registerTool: () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
      unregisterTool: (name) => {
        removed.push(name);
      },
    },
    [tool],
  );
  registration.dispose();
  finish();
  await registration.ready;
  assert.deepEqual(removed, ['test_tool']);
});

test('failed registration removes earlier tools instead of leaving a partial integration', async () => {
  const removed: string[] = [];
  const registration = registerPageTools(
    {
      registerTool: (t) => {
        if (t.name === 'second') throw Error('Registration denied');
      },
      unregisterTool: (name) => {
        removed.push(name);
      },
    },
    [tool, { ...tool, name: 'second' }],
  );
  await assert.rejects(registration.ready, /Registration denied/);
  assert.deepEqual(removed, ['test_tool']);
});
