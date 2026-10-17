# Static judge preview

Deployed and publicly verified October 17, 2026: **[https://quicqdev.github.io/Kinora/](https://quicqdev.github.io/Kinora/)**.

The initial private-repository Pages restriction was resolved when the owner made Kinora public. GitHub Pages was enabled with GitHub Actions, and [deployment run 39037040204](https://github.com/QuicqDev/Kinora/actions/runs/39037040204) succeeded from application commit `8e9c63c`. No paid service was added. The first Linux build exposed missing native optional dependencies in the Windows-generated lockfile; four Linux x64 packages were added at their existing pinned versions with official registry integrity hashes. No application dependency versions changed.

## Experience and boundaries

The scrapbook preview runs in a browser with synthetic listeners, sample plans and fixed editorial choice order. It does not execute Qloo rankings, Gemini planning, other LLM calls or backend requests. The page explains that the full app integrates Qloo Insights API v2 and Gemini. Custom briefs receive an unsupported-input message, with supported sample requests available to continue. Changing favorites does not pretend to personalize sample choices.

The homepage example prepares three sample favorites and a five-minute listening request. Show the sample plan, inspect its duration checks, confirm, open a recording, read the conversation prompt, and save a note. “Back to my bridge” preserves the same result during this visit. The album persists locally under `kinora.static-demo.v1`, separate from the live album. An optional synthetic album entry is clearly labeled. No personal album or provider capture is bundled.

There are **90 reviewed works across nine sample collections**: Hindi, Tamil and Mexican (20 each), plus French, British/English-language, US, Japanese, Korean and Italian (two films and three recordings each). These are small editorial windows, not definitions of cultures or age-suitability endorsements. The full live mode retains the original three collections; the new shelves make no claim of verified Qloo identity coverage.

## Public data review

New catalogue entries live in `shared/demo-expansion.ts`, with original short descriptions and conversation prompts. Film facts and edition runtimes were checked against Criterion, GKIDS and the Korean Film Council; The Way Home links to its official Paramount page. Sources and official destinations are visible on the detail pages. The cited edition of Petite maman is 73 minutes, The Kid is the 53-minute restored rerelease, and I vitelloni is 108 minutes. Other editions may differ.

All 18 new recordings were manually selected after public catalogue search, then individually checked through Apple's public lookup endpoint on October 17. Only selected title, artist, album edition, duration and source/destination metadata were retained in the reviewed catalogue. No lyrics, recordings, posters or raw provider logs are published. Exact editions matter: the French ZAZ entry is a specifically named live recording, rather than an assumed studio duration. Duration limits compare milliseconds and exclude unknown recordings. Playback limits exclude access time, ads and conversation.

## Build, publish artifact and deployment

From `apps/heritage-bridge`:

```sh
npm ci
npm run catalogue:check
npm test
npm run build:static
```

Publish **only `dist/`**. The packaging script generates real entry files for every collection, recording and album route, plus hash navigation for reloads under `/Kinora/`. It also includes MIT, dependency and font notices. Regular `npm run build` retains the existing live build.

The static build has `connect-src 'none'`, no network fetch implementation, no remote scripts, no source maps and only local assets/fonts. The packaging audit rejects unexpected file paths, executable network primitives and common credential signatures, and checks text artifacts against local environment credential values without printing them. Its allowlist excludes `.env`, server source, private state, research notes, videos and captures.

`.github/workflows/pages.yml` is manually dispatched and uploads only the audited `dist/` directory. It does not automatically deploy on source pushes. For updates, run **Kinora static judge preview** from the main branch and verify the public homepage and deep links after success. The site publishes only the static artifact; the now-public repository separately exposes its existing source and Git history.

## Verification

- Catalogue validation: original 60 reviewed entries passed; expanded catalogue tests check nine collections, 90 unique works, source URLs and all 18 recording editions.
- All 63 tests passed, including the original live/server tests using mocked providers and loopback HTTP. No live Qloo or LLM smoke tests were run.
- Static build and generated-artifact audit passed with 140 allowlisted files. The ordinary live build also succeeded, written to private local test output.
- Browser verified sample favorites, unsupported custom brief, local plan, confirmation, editorial choices, recording edition/duration/source, conversation prompt, local note, saved/tried state, preserved bridge, album reload, and direct/reloaded recording routes.
- Actual browser-mediated WebMCP preparation and sample planning succeeded. The French five-minute plan reported three eligible recordings and exposed the same confirmation in the page. It did not claim to execute Gemini or Qloo.
- Browser console had no warnings or errors during the checked journey. The exported video and thumbnail were not changed.

## Public deployment verification

The GitHub-hosted Linux runner passed catalogue validation, the static build, the 140-file publish audit and all 63 tests. Both build and Pages deployment completed successfully. The public homepage, a Korean collection, a French recording, the album route, credits and illustration returned HTTP 200; referenced scripts and styles also loaded. Public `index.html` exactly matched the locally audited build and contained `connect-src 'none'`; deployed scripts contained no fetch, XHR or beacon calls.

The public browser journey confirmed synthetic favorites, the five-minute sample plan, confirmation, three sample choices, recording duration and conversation prompt, saving a choice and returning to the unchanged active bridge. No console warnings or errors were observed. The public preview remains a static sample; the full live Qloo/Gemini backend is not hosted on Pages.
