import { existsSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { appRoot, config, mode } from '../server/config';
import { library, libraryVersion, publishedWorks, validateLibrary } from '../shared/library';
import { activityExamples, fitsActivity } from '../shared/activity';

// Local preflight only: no provider calls, no secrets, no cache/album content.
const day = new Date().toISOString().slice(0, 10);
const filename = path.join(config.stateDir, 'heritage.sqlite');
let used = 0;
if (existsSync(filename)) {
  const db = new DatabaseSync(filename, { readOnly: true });
  try {
    used = Number(db.prepare('SELECT used FROM budget WHERE day=?').get(day)?.used ?? 0);
  } finally {
    db.close();
  }
}
const errors = validateLibrary();
const built = existsSync(path.join(appRoot, 'dist/index.html'));
console.log(
  JSON.stringify(
    {
      mode: mode(),
      built,
      catalogue: libraryVersion,
      errors,
      budget: {
        utcDay: day,
        used,
        limit: config.dailyBudget,
        remaining: Math.max(0, config.dailyBudget - used),
      },
      collections: library.map((c) => ({
        name: c.subtitle,
        verifiedSongs: publishedWorks.filter((w) => w.collection === c.id && w.songDuration).length,
        songsWithinFiveMinutes: publishedWorks.filter(
          (w) => w.collection === c.id && fitsActivity(w, { kind: 'artist', maxMinutes: 5 }),
        ).length,
        examples: activityExamples(c.id, publishedWorks),
      })),
      note: 'Local checks only. Build freshness, provider availability, upstream quota and live identity coverage require rehearsal. No provider calls made.',
    },
    null,
    2,
  ),
);
if (
  !built ||
  errors.length ||
  mode() === 'unavailable' ||
  (mode() === 'live' && used >= config.dailyBudget)
)
  process.exitCode = 1;
