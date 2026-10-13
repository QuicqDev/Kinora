# Kinora

Start with what your child loves. Find a film or song from your heritage to share together.

Read the [repository README](../../README.md) for the product, credentials, licensing and historical prototype. This is the current app, with 60 original source-reviewed entries across Hindi, Tamil and Mexican collections.

## Run

Requires Node >=22.19. From this directory:

```sh
npm ci
npm run dev
npm run check
```

Open http://127.0.0.1:5180; backend 5181. To run the built app: `npm run build`, then `npm start` and open http://127.0.0.1:5181. The development launcher prefers bundled Node 22.23.3. Production needs a supported platform Node; `npm ci --omit=dev` retains the runtime tsx loader.

## Live mode

Repository-root `.env` or server environment supplies keys. Never use browser/VITE variables. Set `HERITAGE_MODE=live`, `QLOO_API_SERVER=https://hackathon.api.qloo.com` for event keys, and the account-supported Gemini model. Tested: `gemini-3.8-flash`. Fixture mode makes no provider calls and labels its results honestly.

```sh
node scripts/run.mjs warm --live --collection=hindi
node scripts/run.mjs profiles --live
node scripts/run.mjs profiles --live --cold
```

These commands consume the existing persistent budget. They do not increase it. Read [release setup](docs/RELEASE_SETUP.md) before production. Configure exact public origin, host/platform port, private persistent state, trusted proxy ranges if needed, and a stable signing secret. Public live startup requires that secret. One stable process is the supported small-demo topology.

## Situation-aware activity planning — October 10, 2026

In live discovery, describe the shared moment after choosing three favorites. Gemini chooses a practical format, inspects the reviewed catalogue and either proposes a feasible activity or asks you to revise a request the data cannot support. The original request, proposed format, time limit and catalogue checks are visible before you confirm.

Confirmed plans change the actual Qloo candidate pool and query: films with a time limit require reviewed runtimes within that limit; music uses only an artist ranking. Unknown durations are excluded from time-bound plans. The unconstrained three-choice and homepage example paths remain available. Planning requests go to Gemini; album notes never do. The server does not persist the brief.

See [activity planning verification](docs/ACTIVITY_PLANNING.md) for the implementation, live checks and limits.

## Demo improvements — October 13, 2026

The homepage now has a five-minute listening-plan example that prepares confirmed example favorites and an editable brief, then lets the user request and confirm the agent's plan. Film examples use feasible durations from the selected collection. Opening a work preserves the active request, plan and result in memory; **Back to my bridge** restores them without another ranking. Reloading clears this visit's bridge, while album records remain on the device.

Twelve starting songs have exact-edition durations from Apple's public catalogue, with provenance in `shared/song-durations.json`. Time filtering compares milliseconds and excludes unknown durations. The display rounds up to the next second. Playback limits do not cover ads, access or conversation. Follow the [demo script](docs/DEMO.md) for a short presentation and fallback.

[WebMCP tools](docs/WEBMCP.md) let compatible browser assistants inspect catalogue feasibility, prepare a request, ask Gemini for a plan and reopen the active bridge. Plan confirmation stays in the page; private album notes are not exposed through tools. Run `npm run demo:check` to inspect catalogue coverage and remaining local budget without provider calls.

The [October 13 demo verification](docs/DEMO_READINESS_2026-10-13.md) records 59 passing tests, actual browser-mediated WebMCP calls, live short-song results and the no-fit check. Public deployment and submission remain separate from this local demo.

## Earlier verification — October 7, 2026

Catalogue validation, type checking, build and 40 tests passed. Zero vulnerabilities in the production dependency audit after compatible brace-expansion/undici overrides. A clean production-only installation starts and responds HTTP 200.

Two contrasting non-heritage artist profiles returned three live choices with different shortlists; cached repeats cost zero. A clean Hindi identity cache returned three choices in 21.19 seconds with 22 charges. These are technical/signal-sensitivity checks, not proof of family enjoyment or superiority. Four earlier unresolved catalogue identities remain excluded honestly.

Details: [implementation fixes](docs/IMPLEMENTATION_FIXES.md). Earlier [completion checkpoint](docs/COMPLETION_CHECKPOINT.md) records historical all-collection coverage, before these corrections.

## Architecture and limits

Official Qloo MCP resolves identities; verified IDs are ranked through one official Insights query per domain. At most ten new candidates per domain in editorial order; no cross-query score merging. With an activity brief, Gemini chooses between catalogue inspection, proposing a plan and asking for clarification; after confirmation, the server makes only the selected domain ranking. Without a brief, the older bounded two-domain orchestration remains. Returned works and identity attribution are validated independently of the model. Artist affinity does not predict a specific song.

Favorite inputs, positive likes and explicitly tried work IDs are excluded from next discoveries. Relevant resolved likes contribute up to seven additional signals. Browsing and revisiting remain available. Private notes and encounter dates stay in the browser; only minimal tried IDs go to the server for exclusions. Albums have JSON export and damaged-record recovery with an archived original.

Identity replies expire after seven days, search/results after five minutes. Reads do not extend the original expiry. The global daily tool ceiling persists in SQLite across restarts; UTC midnight resets it. Per-client daily/request-rate fairness and the two-job admission cap are process-local. A 120-second total deadline and provider cancellation stop further planned work; already-sent upstream work may finish independently. No automatic retries or hidden sample fallbacks.

Suitability, access and subtitles vary. Original summaries and artwork only; linked media are not redistributed. Fonts retain OFL; Lucide retains ISC. Public deployment, public repository verification, submission and actual family usefulness remain pending.
