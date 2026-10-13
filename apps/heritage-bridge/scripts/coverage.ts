import { mkdir, writeFile } from 'node:fs/promises';
import { catalog } from '../server/catalog';
import { config } from '../server/config';
import { candidates } from '../server/policy';
import { Qloo } from '../server/qloo';
// This command is deliberately not invoked by the app, installation or tests.
const collection = process.argv.find((x) => x.startsWith('--collection='))?.split('=')[1];
if (!process.argv.includes('--live') || !['hindi', 'tamil', 'mexican'].includes(collection ?? ''))
  throw new Error(
    'Explicit live audit required: --live --collection=hindi|tamil|mexican. Up to 20 paid Qloo calls.',
  );
if (config.mode !== 'live' || !config.qlooKey)
  throw new Error('Set live mode and a server-side Qloo key before an authorized audit.');
const qloo = new Qloo();
try {
  const rows = [];
  const pool = catalog.filter((w) => w.collection === collection);
  for (const work of pool) {
    const reply = await qloo.call('qloo_describe', { entity: work.name, type: work.kind });
    const matches = candidates(reply, work.kind).map(
      ({ token, ...publicIdentity }) => publicIdentity,
    );
    rows.push({
      catalogueId: work.id,
      name: work.name,
      kind: work.kind,
      metadataStatus: work.metadataStatus,
      expectedYear: work.year ?? null,
      status: reply.status,
      matches,
      correctIdentity: 'requires-manual-review',
    });
    if (reply.status === 'error') break;
  }
  const output = {
    checkedAt: new Date().toISOString(),
    collection,
    harness: '0.1.26',
    calls: rows.length,
    coverageClaim:
      'Not verified until identity matches are manually reviewed; a returned match is not a confirmed identity.',
    rows,
  };
  await mkdir('.local', { recursive: true });
  await writeFile(`.local/coverage-${collection}.json`, JSON.stringify(output, null, 2));
  console.log(
    `Recorded ${rows.length} responses in .local/coverage-${collection}.json. Review every identity before claiming coverage.`,
  );
} finally {
  await qloo.close();
}
