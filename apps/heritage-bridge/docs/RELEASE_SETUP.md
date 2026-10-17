# Small single-instance release setup

This document covers the full live app. For the backend-free GitHub Pages sample preview, use [STATIC_DEMO.md](STATIC_DEMO.md) and `npm run build:static`. The static artifact contains no server, credentials or private state, and the workflow uploads only `dist/`. Private-repository Pages is currently blocked by the existing GitHub plan; visibility has not been changed.

Use Node >=22.19. Build with `npm ci` and `npm run build`. Keep the generated dist folder, server/shared/scripts source and lockfile in the deployment artifact. A production `npm ci --omit=dev` retains tsx, which runs the server. Start with `npm start`.

Set server-side credentials and `HERITAGE_MODE=live`. Additional configuration:

| Setting | Purpose |
|---|---|
| `HERITAGE_PUBLIC_ORIGIN` | Exact HTTPS origin, e.g. `https://heritage.example`; no slash/path. Only this and local origins may call the API. |
| `HERITAGE_HOST` | Default `127.0.0.1` for local use/same-host reverse proxy. Use `0.0.0.0` if the selected container host requires it. |
| `HERITAGE_PORT` / `PORT` | Explicit app port wins; otherwise hosting `PORT`, otherwise 5181. Omit HERITAGE_PORT when the host provides PORT. |
| `HERITAGE_STATE_DIR` | Absolute private persistent directory, outside served dist. Contains SQLite and harness state. Never include it in public source. |
| `HERITAGE_SIGNING_SECRET` | At least 32 random characters, persisted as a server secret across restarts. Never expose it. |
| `HERITAGE_TRUST_PROXY` | Only known proxy IPs/CIDRs, comma-separated. Empty by default. Public-origin startup on loopback requires this setting. Do not blindly trust every proxy. |
| `HERITAGE_DAILY_TOOL_BUDGET` | Existing hard global ceiling; not a currency budget. Includes warming and model calls. |
| `HERITAGE_CLIENT_DAILY_REQUESTS` | Per-IP accepted personalization-request ceiling; default 24. Busy and invalid requests do not consume it; accepted cached requests do. This fairness counter is process-local; global tool accounting persists. |
| `HERITAGE_REQUEST_TIMEOUT_MS` | Total request deadline; default 120 seconds, maximum 150 seconds. Provider calls have shorter limits. |

Do not put private state beneath dist or a published source directory. Use one stable process: concurrency and per-client fairness are local to that process. SQLite shares atomic global budgeting on one host. Multi-host/serverless replicas need a deliberate shared-state and admission design and are outside this release scope.

If a reverse proxy forwards visitor addresses, trust only its actual IP/CIDR and configure it to replace client-supplied forwarded headers. Verify with two clients on different networks that their limits are independent. Visitors sharing a NAT still share an IP allowance. For direct connections leave proxy trust empty. A public origin with a loopback listener and no trusted proxy fails startup to prevent all visitors sharing the proxy's quota.

After installation/restart, run `node scripts/run.mjs warm --live --collection=hindi` (repeat for other collections). Warm-up reuses unexpired identities; it does not extend their TTL. Provider identity replies expire after seven days; refresh within Qloo's allowed caching terms. A failed identity never becomes an arbitrary match. Individual timeout/upstream failures can yield partial coverage; auth, rate limits and budget failures stop work.

Temporary identity failures use retry wording and their partial results are not cached. Cancellable requests resolve independently: two simultaneous cold requests can each charge for the same uncached lookup, bounded by the two-job limit and persistent global budget. Warm the private identity cache before judging. Do not raise the hard budget automatically.

Run `node scripts/run.mjs profiles --live` to compare two fixed non-heritage favorite profiles. It checks unique exact artist identities before using these explicitly declared demo preferences. Keep raw responses private. Inspect successful statuses, three validated choices and free cached repeats. Differences in output show input sensitivity only.

From a clean browser outside the hosting machine verify: home discovery action; search identity confirmation; POST from the real origin; live and partial results; official destinations; saved notes after reload; want/tried state; deep links; JSON backup; cancellation/retry; budget exhaustion; process restart with persisted signing/cache. Check cold startup separately from warmed behavior and record failures.

Before publication inspect the files being published, confirm secrets/private traces/Claude sessions are excluded, verify MIT and dependency/asset notices, and ensure sufficient budget and service availability through judging. No automatic budget increase, blind proxy trust or unlimited access is configured. Public publication and submission remain separate authorized actions.
