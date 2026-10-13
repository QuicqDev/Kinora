import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../server/config';
import { DiscoveryService } from '../server/discovery';
import { normalizeName } from '../server/identity';
import type { Favorite, DiscoveryRequest } from '../shared/types';
import { Qloo } from '../server/qloo';
import { GeminiAgent } from '../server/gemini';
import { mode } from '../server/config';
import { PrivateState } from '../server/state';
if (!process.argv.includes('--live') || config.mode !== 'live')
  throw Error('Requires --live and HERITAGE_MODE=live');
const service = new DiscoveryService();
const runs: unknown[] = [];
let failure: string | undefined;
let coldInput: DiscoveryRequest | undefined;
try {
  if (config.dailyBudget - service.budget.count < 24)
    throw Error('Need at least 24 remaining tool charges; do not raise the budget automatically.');
  console.log(JSON.stringify({ phase: 'warm', ...(await service.warm('hindi')) }));
  for (const names of [
    ['Taylor Swift', 'Billie Eilish', 'Olivia Rodrigo'],
    ['Hans Zimmer', 'Ludovico Einaudi', 'Enya'],
  ]) {
    const favorites: Favorite[] = [];
    for (const name of names) {
      const reply = await service.search(name, 'artist');
      const matches = reply.matches.filter((f) => normalizeName(f.name) === normalizeName(name));
      if (matches.length !== 1) throw Error('Example artist identity needs manual review: ' + name);
      // These are explicitly supplied synthetic demonstration preferences, never a real child's data.
      favorites.push(matches[0]);
    }
    const input: DiscoveryRequest = { collection: 'hindi', favorites, feedback: {}, easier: false };
    coldInput = input;
    const start = Date.now(),
      before = service.budget.count;
    const result = await service.discover(input);
    const after = service.budget.count;
    const repeated = await service.discover(input);
    const run = {
      syntheticPreferences: true,
      favorites: names,
      status: result.status,
      latencyMs: Date.now() - start,
      charged: after - before,
      ids: result.works.map((w) => w.id),
      cachedRepeat:
        after === service.budget.count && JSON.stringify(result) === JSON.stringify(repeated),
    };
    runs.push(run);
    console.log(JSON.stringify(run));
    if (
      !['ok', 'partial'].includes(result.status) ||
      result.works.length !== 3 ||
      !run.cachedRepeat
    )
      throw Error('Live profile did not meet the technical gate');
  }
  const changed =
    JSON.stringify((runs[0] as { ids: string[] }).ids) !==
    JSON.stringify((runs[1] as { ids: string[] }).ids);
  console.log(
    JSON.stringify({ contrastingProfilesChangedResults: changed, provesUsefulness: false }),
  );
  if (process.argv.includes('--cold')) {
    if (config.dailyBudget - service.budget.count < 30)
      throw Error('Need 30 remaining global charges for the cold-cache check.');
    const cold = new DiscoveryService(
      new Qloo(),
      new GeminiAgent(),
      mode,
      new PrivateState(':memory:'),
    );
    // Isolate identity/cache state, but account EVERY call against the existing persistent global budget.
    cold.budget = service.budget;
    try {
      const before = service.budget.count,
        start = Date.now();
      const result = await cold.discover(coldInput!);
      const run = {
        coldIdentityCache: true,
        status: result.status,
        latencyMs: Date.now() - start,
        charged: service.budget.count - before,
        ids: result.works.map((w) => w.id),
      };
      runs.push(run);
      console.log(JSON.stringify(run));
      if (!['ok', 'partial'].includes(result.status) || result.works.length !== 3)
        throw Error('Cold-cache discovery did not meet the technical gate');
    } finally {
      await cold.close();
    }
  }
} catch (error) {
  failure = error instanceof Error ? error.message : 'Profile validation failed';
  throw error;
} finally {
  await mkdir(config.stateDir, { recursive: true });
  await writeFile(
    path.join(config.stateDir, 'profile-validation.json'),
    JSON.stringify({ at: new Date().toISOString(), model: config.model, runs, failure }, null, 2),
  );
  await service.close();
}
