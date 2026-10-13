import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config, appRoot } from '../server/config';
import { Qloo } from '../server/qloo';
import { PrivateState } from '../server/state';
import { IdentityResolver } from '../server/identity';
import { Budget } from '../server/policy';
import { publishedWorks } from '../shared/library';
if (!process.argv.includes('--live') || !config.qlooKey)
  throw new Error(
    'Use --live with a server-side Qloo key. This audit makes real provider requests.',
  );
const collection = process.argv.find((a) => a.startsWith('--collection='))?.split('=')[1];
if (collection && !['hindi', 'tamil', 'mexican'].includes(collection))
  throw new Error('Invalid collection');
const limit = Number(process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1] ?? 20);
if (!Number.isInteger(limit) || limit < 1 || limit > 60)
  throw new Error('Choose a tool-call ceiling from 1 to 60.');
const state = new PrivateState(path.join(appRoot, '.local', 'heritage.sqlite'));
const qloo = new Qloo();
const budget = new Budget(config.dailyBudget, state);
const rows: unknown[] = [],
  trace: unknown[] = [];
let calls = 0;
const observed = {
  call: async (name: Parameters<Qloo['call']>[0], args: Record<string, unknown>) => {
    const reply = await qloo.call(name, args);
    trace.push({ name, args, reply });
    return reply;
  },
};
const resolver = new IdentityResolver(
  observed,
  () => {
    if (calls >= limit) throw new Error('AUDIT_CALL_CEILING');
    budget.take();
    calls++;
  },
  state,
);
try {
  for (const work of publishedWorks.filter((w) => !collection || w.collection === collection)) {
    try {
      const resolved = await resolver.resolve(work);
      rows.push({
        id: work.id,
        collection: work.collection,
        kind: work.kind,
        status: resolved ? 'matched-title-type-year' : 'unresolved',
        qlooId: resolved?.qlooId,
      });
      console.log(
        JSON.stringify({ id: work.id, status: resolved ? 'matched' : 'unresolved', calls }),
      );
    } catch (error) {
      rows.push({
        id: work.id,
        status: 'error',
        code: (error as { code?: string }).code ?? 'AUDIT_STOPPED',
      });
      process.exitCode = 1;
      break;
    }
  }
  await mkdir('.local', { recursive: true });
  const report = {
    recordedAt: new Date().toISOString(),
    server: config.qlooServer,
    calls,
    dailyUsed: budget.count,
    rows,
    trace,
  };
  await writeFile(
    `.local/audit-${collection ?? 'published'}.json`,
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify({
      checked: rows.length,
      calls,
      dailyUsed: budget.count,
      privateReport: `.local/audit-${collection ?? 'published'}.json`,
    }),
  );
} finally {
  await qloo.close();
  state.close();
}
