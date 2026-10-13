# Heritage Bridge — build status

## Latest completion checkpoint — October 7, 2026

Implementation is authorized and live. Three collections now contain 60 source-reviewed entries, with 56 conservatively matched Qloo identities. All three full live HTTP flows returned two films and one artist; cache repeats made zero provider calls. Explicit want/tried album records, filters/search, conversation prompts, selected runtimes, backup download, persisted private SQLite budgets/cache and canonical request keys are implemented. Read apps/heritage-bridge/docs/COMPLETION_CHECKPOINT.md for measured scope, earlier failures and remaining gates. Local .env is live, model gemini-3.8-flash, development ceiling 150. Raw responses remain ignored; no external publication, recruitment, commit or push. Four identity exceptions, upstream advisories and actual usefulness remain pending. Earlier checkpoints below are historical.
## Earlier API checkpoint — October 6, 2026

Qloo and Gemini credentials are now present and validated. The app forwards `QLOO_API_SERVER` through the official harness's base-URL/trust variables, keeps harness traces in ignored app-local storage, handles verified detail/rank type variants and preserves ambiguity descriptions. One real Udit Narayan → Mexican artist connection succeeded, returning two approved works; a cached repeat made no provider call. Catalogue validation, type checking, build and 27 tests pass. Film identity ambiguity, complete coverage and usefulness remain pending. Default `.env` mode remains fixture. Read [LIVE_API_READINESS.md](LIVE_API_READINESS.md) for measured scope and the remaining work order. The older no-live-call and missing-key statements below are historical.

Updated October 4, 2026. Implementation was authorized in the new build chat. Tuesday Fix and existing research remain in place. No commits, publication, purchases, account creation, or live Qloo/Gemini requests were made. An original illustration was generated using the built-in image-generation tool.

Latest design decision: user selected a personal family scrapbook after rejecting the journal pass. The new interface includes original artwork, visible private memory notes and a saved album with collection filters. See `PRODUCT_GAPS.md` for the wider remaining work; this is a visual checkpoint, not a claim that the product is complete or the execution approved.

## Latest milestone — collection-first

The current entry point is Explore → curated collection → work → official destination/save. Three collections publish 17 distinct entries; all 18 reviewed records remain available to existing albums. Personalization is optional. The versioned library is bundled independently of the discovery API. The explicit-like connection endpoint supports a bounded target-domain ranking, including another collection. See [COLLECTION_FIRST.md](COLLECTION_FIRST.md) for architecture, design rationale and verification.

Current checks: catalogue validation, 26 automated tests, type checking and production build passed. Live Qloo/Gemini remains untested. The following records describe the earlier milestone where applicable.

## Earlier milestone

- A responsive React/TypeScript/Vite application and Node/TypeScript backend in this directory.
- Editorial discovery screen shown at desktop and mobile sizes before expanding the interface. Direction remains open to user feedback, not claimed approved.
- Hindi, Tamil and Mexican collections work end to end in **explicit fixture mode**. Three favorites, format-aware search and explicit entity confirmation; preserved favorites when switching collections; stale responses aborted/ignored.
- Three result cards, sourced work facts, official destinations, provenance disclosure, local saved choices and notes, independent interest/difficulty feedback, fresh discovery and reset.
- Failure, partial, empty and missing-credential handling. Fixture mode never makes provider calls; live failures never silently become fixtures.
- Official Qloo MCP transport and actual local tool-schema inspection. Google Gemini SDK adapter uses bounded function calls to request eligible film/artist rankings, then choose an approved evidence-grounded explanation framing. Unchecked generated prose cannot create recommendations or claims.
- App-local Node 22.23.3; host Node 22.14.0 is unchanged. `npm run dev` selects the compatible local runtime.

## Coverage, honestly

| Collection | Frozen candidates | Reviewed film/artist entry points | Qloo identity coverage | Live ranking |
|---|---:|---:|---|---|
| Hindi | 12 films + 8 artists | 3 + 3 | Not tested | Not tested |
| Tamil | 12 films + 8 artists | 3 + 3 | Not tested | Not tested |
| Mexican | 12 films + 8 artists | 3 + 3 | Not tested | Not tested |

There are **60 candidates, not 60 verified recommendations**. The other 42 entries stay in a research queue and cannot appear in results. Basic facts and destinations are checked for the 18 reviewed entries; this is not a content-suitability assessment. No duration, age-suitability or difficulty claims are invented. The easier-to-follow constraint honestly returns empty until verified difficulty metadata is available. Candidate artist nationalities are not used to infer song language.

The initial live slice resolves at most six reviewed works in the selected collection, then ranks three film candidates and three artist candidates separately, returning at most two films and one artist. This provides real alternatives within each domain. Larger catalogues need a new coverage audit and selection policy; the official rank tool caps options at ten and forbids treating separate batches as one comparable ranking. The initial slice is not evidence of final launch coverage.

## Verification

- 19 automated tests passed, including actual HTTP boundary tests, bounded Gemini tool behavior and a mocked live orchestration chain. These tests are engineering evidence, not live Qloo/Gemini validation or usefulness evidence.
- Type checking and production build passed.
- Actual browser review: desktop 1440×1080 and mobile 390×844; three collection flows; saved choices; independent feedback; detail/source links. Mobile document width matched viewport width (no horizontal overflow).
- Screenshots are in `docs/screenshots/`. More detailed final QA notes are recorded in `QA.md`.
- Revised the initial visual direction following the user's explicit design feedback: researched hierarchy, proximity, mobile layout and contrast; implemented a restrained cultural-journal layout with real collection titles, larger text and compact results. See `DESIGN.md` for sources and decisions. No user approval of the revised direction is assumed.
- `docs/qloo-tool-schemas.json` was retrieved from the installed official MCP server using `listTools()`. No API coverage call was made.

## Remaining gates

1. Add keys to the repository-root `.env`, deliberately choose live mode, then run a small budgeted live test. Verify account entitlement and choose the Gemini model available to the account. The configured `gemini-flash-latest` alias follows official SDK examples but actual access is untested.
2. Inspect real Qloo identity, affinity and error responses. Exact name/type/year validation is intentionally conservative. Ambiguous catalogue identities are excluded, not guessed. Resolve exclusions through an audited catalogue mapping before extending the pool.
3. Review the other 42 candidate records, source their language/content/destinations, and test the per-collection coverage gate from the plan (16/20 total, including 9 films and 6 artists). Do not claim those thresholds have passed.
4. Run the equal-input comparison in `BASELINE_PROTOCOL.md`; no uplift or family usefulness has been measured.
5. Before any separately authorized public deployment, replace the process-local request budget with persistent shared limits and resolve upstream package advisories. `npm audit` reports four transitive findings (two high, two moderate) through the pinned official Qloo harness/Pi dependency. Pi ships `npm-shrinkwrap.json`; ordinary overrides did not update its pinned nested packages, so ineffective overrides were removed. No force upgrade or vendor-code rewrite was performed. The app remains bound to loopback.

## Source/implementation evidence

- [Official MCP starter](https://github.com/qloo/qloo-hackathon-kit/blob/main/starter/mcp-client/README.md): canonical `qloo mcp`, backend stdio SDK, six result statuses and Node >=22.19.
- [Qloo API access](https://github.com/qloo/qloo-hackathon-kit/blob/main/docs/API_ACCESS.md): attributable credentials, shared quotas, bounded requests and necessary caching.
- Installed `@qloo/qloo-harness@0.1.26`: `dist/chunks/chunk-MCLV3P4I.js` supplies the rank/describe schemas; `dist/qloo-tools.js` shows entity compaction and `resolution.issues[].candidates`. SDK schemas were checked locally, not inferred from prose examples.
- [Google Gen AI JavaScript SDK](https://googleapis.github.io/js-genai/release_docs/index.html): `GoogleGenAI`, function declarations, `FunctionCallingConfigMode`, and manual response loop. Pinned `@google/genai@2.27.0`; no automatic unrestricted MCP-to-model execution.
- Every reviewed work carries primary platform/producer/artist URLs in `shared/catalogue-data.ts`; original short paraphrases and original typographic covers are used. No poster, audio, lyrics or film footage is copied.
