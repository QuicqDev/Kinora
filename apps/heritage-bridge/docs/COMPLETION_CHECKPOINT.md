# Completion checkpoint

October 7, 2026 (India); live verification recorded October 6 UTC. This supersedes earlier fixture-only checkpoints.

## Implemented

- Three collections of 20 source-reviewed entries; original summaries, official film/song destinations, language facts, conversation prompts, selected sourced runtimes and documented year variants. Lata’s entry now uses Tere Liye to remove a duplicated destination.
- Collection format/name filters and direct routes; optional live starting points and explicit-like taste connections.
- Explicit want/tried album states and encounter dates; collection/status filters; notes, legacy-album preservation and JSON backup download.
- Real Qloo/Gemini integration. Account returned gemini-3.8-flash, now pinned locally. Bounded function calls, low thinking and output headroom; no unverified generated explanation.
- Exact sourced title/alias and documented year matching; unresolved identities excluded from recommendations. Seven-day private identity cache, five-minute result/search cache; canonical keys insensitive to JSON property order.
- Atomic SQLite daily usage across restarts/processes. Local development ceiling raised from 100 to 150 for audit/validation. UTC midnight reset. Private state and provider traces are ignored by Git.
- Ranking uses one official GET /v2/insights query for already verified IDs, avoiding the MCP resolver’s parallel UUID hydration burst. Scores come from response query.affinity; response subtype is required to normalize generic entity types.

## Measured coverage

| Collection | Reviewed | Matched films | Matched artists | Total matched |
|---|---:|---:|---:|---:|
| Hindi | 20 | 12 | 8 | 20 |
| Tamil | 20 | 10 | 8 | 18 |
| Mexican | 20 | 10 | 8 | 18 |

All clear the proposed engineering gate of 16 total, nine films and six artists. Coverage is not usefulness evidence.

Unresolved: Kaaka Muttai, Kandukondain Kandukondain, La leyenda de la Nahuala, Cilantro y perejil. Title/translation or year discrepancies remain. They stay browsable but are excluded from personalized results when unresolved. No arbitrary year tolerance or popularity tie-breaker.

Raw Qloo data stays in ignored .local/audit-published.json and .local/heritage.sqlite. Public sources are in shared/catalogue-data.ts and shared/reviewed-expansion.ts.

## Live verification

Three confirmed public inputs: Iqbal (2005), Udit Narayan, Shreya Ghoshal. Search reused real audited describe replies privately; ambiguity still required selecting the intended identity.

All three complete live HTTP flows returned two films and one artist. Hindi status ok, Tamil/Mexican partial. Four charged provider calls per flow; cached repeat zero. Latencies about 21.7, 8.5 and 7.6 seconds. Private record: .local/live-smoke.json.

Earlier attempts included upstream rate limits and an Insights nested-affinity parsing error. They are not successful evidence. Canonical keys, one-query rankings and explicit nested affinity parsing were corrected before the successful run. No automatic retries are enabled.

Library validation, type checking, production build and 32 tests passed. Tests cover HTTP boundaries, wrong IDs/domains, invalid model tools, JSON ordering, persisted budgets/cache, ambiguity and separate encounter/preference records.

## Browser review

Actual local browser: expanded filter/search, work prompt, explicit tried state, sample note persistence after reload and album status filter. Legacy saves stayed readable. Phone viewport 390×844 had document width within viewport. No user-authored memory was edited.

## Remaining release work

Four identity exceptions; upstream dependency advisories; artwork display rights if introducing posters/photos; equal-input comparison and consenting-family usefulness study; production topology/HTTPS/origin/shared-state configuration; authorized deployment and hackathon submission assets. No publication or recruitment occurred.

npm audit still reports four transitive findings (two high, two moderate), through brace-expansion and undici in Pi 0.84.2 / official harness 0.1.26. Latest official harness remains 0.1.26. A non-mutating repair preview made zero changes; no incompatible forced upgrade was made. Local app remains bound to loopback.
