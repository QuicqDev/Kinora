import { mkdir, writeFile } from 'node:fs/promises';
import { createApp } from '../server/app';
import { DiscoveryService } from '../server/discovery';
import { once } from 'node:events';
import { config } from '../server/config';
if (!process.argv.includes('--live') || config.mode !== 'live')
  throw Error('Requires --live and HERITAGE_MODE=live');
const service = new DiscoveryService();
const server = createApp(service).listen(0, '127.0.0.1');
await once(server, 'listening');
const base = 'http://127.0.0.1:' + (server.address() as { port: number }).port;
const favorites = [];
const runs = [];
const before = service.budget.count;
try {
  for (const [q, kind] of [
    ['Iqbal', 'movie'],
    ['Udit Narayan', 'artist'],
    ['Shreya Ghoshal', 'artist'],
  ]) {
    const response = await fetch(base + '/api/search?q=' + encodeURIComponent(q) + '&kind=' + kind);
    const data = await response.json();
    if (!response.ok || !data.matches.length) throw Error('Search unavailable');
    const selected = data.matches.find((f: any) => kind === 'artist' || f.subtitle === '2005');
    if (!selected) throw Error('Expected confirmed identity not present');
    favorites.push(selected);
  }
  for (const collection of ['hindi', 'tamil', 'mexican']) {
    const start = Date.now(),
      charged = service.budget.count;
    const input = { collection, favorites, feedback: {}, easier: false };
    const response = await fetch(base + '/api/discover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await response.json();
    const after = service.budget.count;
    const repeated = ['ok', 'partial'].includes(data.status)
      ? await service.discover(input as any)
      : undefined;
    const run = {
      collection,
      http: response.status,
      status: data.status,
      latencyMs: Date.now() - start,
      charged: service.budget.count - charged,
      works: data.works?.map((w: any) => ({ id: w.id, kind: w.kind })),
      cacheRepeat: repeated
        ? JSON.stringify(repeated) === JSON.stringify(data) && service.budget.count === after
        : null,
    };
    runs.push(run);
    console.log(JSON.stringify(run));
    if (!response.ok || data.mode !== 'live' || data.works?.length !== 3 || !run.cacheRepeat)
      process.exitCode = 1;
  }
  await mkdir('.local', { recursive: true });
  await writeFile(
    '.local/live-smoke.json',
    JSON.stringify(
      {
        recordedAt: new Date().toISOString(),
        model: config.model,
        server: config.qlooServer,
        before,
        after: service.budget.count,
        runs,
      },
      null,
      2,
    ),
  );
} finally {
  server.closeAllConnections();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await service.close();
}
