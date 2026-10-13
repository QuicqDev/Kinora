import { config as dotenv } from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const repositoryRoot = path.resolve(appRoot, '../..');
dotenv({ path: path.join(repositoryRoot, '.env'), override: false, quiet: true });
const positive = (value: string | undefined, fallback: number, max: number) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? Math.min(n, max) : fallback;
};
const publicOrigin = process.env.HERITAGE_PUBLIC_ORIGIN?.trim() || '';
if (
  publicOrigin &&
  (new URL(publicOrigin).origin !== publicOrigin || !publicOrigin.startsWith('https://'))
)
  throw new Error(
    'HERITAGE_PUBLIC_ORIGIN must be one HTTPS origin without a path or trailing slash.',
  );
if (publicOrigin && process.env.HERITAGE_MODE === 'live' && !process.env.HERITAGE_SIGNING_SECRET)
  throw new Error('Public live discovery requires a persistent HERITAGE_SIGNING_SECRET.');
const stateDir = path.resolve(process.env.HERITAGE_STATE_DIR || path.join(appRoot, '.local'));
for (const served of [path.join(appRoot, 'dist'), path.join(repositoryRoot, 'public')])
  if (stateDir === served || stateDir.startsWith(served + path.sep))
    throw new Error('HERITAGE_STATE_DIR must not be inside a publicly served directory.');
const host = process.env.HERITAGE_HOST || '127.0.0.1';
const trustProxy =
  process.env.HERITAGE_TRUST_PROXY?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) || [];
if (publicOrigin && ['127.0.0.1', 'localhost', '::1'].includes(host) && !trustProxy.length)
  throw new Error(
    'A public origin on loopback requires explicit trusted proxy IPs/CIDRs, so visitors do not share the proxy quota.',
  );
export const config = {
  mode: process.env.HERITAGE_MODE === 'live' ? ('live' as const) : ('fixture' as const),
  qlooKey: process.env.QLOO_API_KEY || '',
  qlooServer: process.env.QLOO_API_SERVER?.trim() || 'https://api.qloo.com',
  geminiKey: process.env.GEMINI_API_KEY || '',
  model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  port: positive(process.env.HERITAGE_PORT || process.env.PORT, 5181, 65535),
  host,
  publicOrigin,
  trustProxy,
  stateDir,
  signingSecret: process.env.HERITAGE_SIGNING_SECRET || '',
  requestLimit: positive(process.env.HERITAGE_REQUESTS_PER_MINUTE, 12, 30),
  clientDailyLimit: positive(process.env.HERITAGE_CLIENT_DAILY_REQUESTS, 24, 100),
  dailyBudget: positive(process.env.HERITAGE_DAILY_TOOL_BUDGET, 100, 500),
  timeout: 20_000,
  requestTimeout: positive(process.env.HERITAGE_REQUEST_TIMEOUT_MS, 120_000, 150_000),
  cacheMs: 5 * 60_000,
};
export function mode() {
  return config.mode === 'fixture'
    ? 'fixture'
    : config.qlooKey && config.geminiKey
      ? 'live'
      : 'unavailable';
}
