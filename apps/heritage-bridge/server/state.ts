import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

// Private backend state. SQLite makes budget increments atomic across workers
// and preserves identity lookups across restarts without publishing Qloo data.
export class PrivateState {
  private db: DatabaseSync;
  constructor(filename: string) {
    if (filename !== ':memory:') mkdirSync(path.dirname(filename), { recursive: true });
    this.db = new DatabaseSync(filename);
    this.db.exec(`PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT NOT NULL, expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS budget (day TEXT PRIMARY KEY, used INTEGER NOT NULL);`);
  }
  get(key: string): unknown {
    const row = this.db.prepare('SELECT value, expires FROM cache WHERE key=?').get(key);
    if (!row || Number(row.expires) <= Date.now()) return undefined;
    try {
      return JSON.parse(String(row.value));
    } catch {
      return undefined;
    }
  }
  set(key: string, value: unknown, ttlMs: number) {
    this.db
      .prepare(
        'INSERT INTO cache VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, expires=excluded.expires',
      )
      .run(key, JSON.stringify(value), Date.now() + ttlMs);
    this.db.prepare('DELETE FROM cache WHERE expires<=?').run(Date.now());
  }
  charge(limit: number, day = new Date().toISOString().slice(0, 10)) {
    const row = this.db
      .prepare(
        `INSERT INTO budget VALUES (?, 1)
      ON CONFLICT(day) DO UPDATE SET used=used+1 WHERE used<? RETURNING used`,
      )
      .get(day, limit);
    this.db.prepare('DELETE FROM budget WHERE day<?').run(day);
    return row ? Number(row.used) : undefined;
  }
  count(day = new Date().toISOString().slice(0, 10)) {
    return Number(this.db.prepare('SELECT used FROM budget WHERE day=?').get(day)?.used ?? 0);
  }
  close() {
    this.db.close();
  }
}
