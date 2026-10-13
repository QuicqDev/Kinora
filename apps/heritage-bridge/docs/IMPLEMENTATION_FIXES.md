# Implementation corrections and verification

October 7, 2026. User authorized correcting the Claude/Codex implementation review. Scope: Heritage Bridge application, installation and local release validation. No video changes, external deployment, public repository publication, submission, commit or push.

The actionable implementation findings are corrected. Claude Opus 5.5 reviewed the changed source in round 3 and found the main fixes solid, with no new blocker in those areas. Codex then corrected its proxy, quota and transient-cache follow-up findings and verified them with regression tests. Public-host validation remains a separate release step.

## Corrections

| Review finding | Result |
|---|---|
| Cancellation allowed more than two provider jobs | Admission slots remain occupied until backend work settles. Disconnects and a total 120-second deadline propagate cancellation through Qloo and Gemini; timeout returns 504 without prematurely freeing the slot. Provider checkpoints prevent further planned calls after cancellation. |
| Foreign likes displaced relevant feedback | Resolve target-collection likes before applying the seven-signal cap; skip duplicate favorite identities. |
| Familiar works appeared as next discoveries | Exclude favorite identities, positive likes, dislikes and explicit tried IDs from discovery. Revisiting remains available through browsing and the album. Only minimal tried IDs are transmitted; notes and dates remain local. |
| One transient lookup failed the whole flow | An individual timeout/upstream failure can produce honest partial results with backfilled candidates. Authentication, rate limits and global budget failures still stop work. Temporary failures have distinct retry wording and do not cache the partial result. |
| Cache reads extended stored identity lifetimes | Reads honor original expiry; seven-day identity TTL is not renewed by warming or reading persisted replies. Request keys include library version, model, endpoint and canonical exclusions. |
| Public requests/installations were unsupported | Configurable exact HTTPS origin, host and platform port; private persistent state location; stable signing secret across processes; runtime tsx dependency; supported production-only installation. Public loopback startup requires explicit trusted proxy ranges. |
| Limits accidentally applied site-wide through a proxy | Known proxy ranges produce separate client IP quotas. Public loopback without those ranges fails startup. Busy/invalid requests do not spend daily allowance. Accepted cached requests still count; NAT visitors share an IP allowance. |
| Actual bridge was buried | Home now leads with child favorites to selected heritage and opens the existing discovery flow. Live example listeners confirm exact artist identities before populating explicitly synthetic preferences. |
| Root packaging described the historical prototype | Heritage Bridge is the root README and default script entry point; MIT license added. Tuesday Fix remains separately documented and runnable. |
| Dependency advisories | Compatible brace-expansion 5.0.12 and undici 8.10.2 overrides installed and locked. Final production audit: zero reported vulnerabilities. |
| Optional data/error polish | Damaged album records preserve valid memories and archive the original before saving, with recovery download. Correct malformed/oversized request statuses, tested Gemini model, and explicit bounded-candidate disclosure. |

Ranking still uses separate official Qloo Insights calls per domain, at most ten verified new candidates per domain in editorial order, without joining scores from separate queries. Gemini uses scoped ranking tools and approved explanations. Additional free-text agency was optional in the review and was not introduced. Artist affinity is not claimed to predict a particular song.

## Verification

- Final `npm run check`: all 60 catalogue entries validated; TypeScript and production build passed; **40 tests passed, zero failed**.
- Meaningful new regressions cover feedback relevance and novelty; transient retry versus fatal provider errors; cancellation/deadline admission; busy rejections preserving quota; trusted-proxy client separation and startup guard; damaged album recovery; persisted cache expiry; signing across separate processes.
- Existing tests retain budget persistence across instances/restarts, response validation, honest fixture/live separation, album privacy and browsing during personalization failure.
- Final `npm audit --omit=dev --json`: **zero reported vulnerabilities**. This is an advisory check, not proof that the application has no security risks.
- Clean isolated production artifact installed with `npm ci --omit=dev`, started using a supported Node runtime and returned HTTP 200. Runtime tsx remained available.
- Local browser check covered desktop home and discovery entry, sample labeling, and a 390 × 844 viewport with no horizontal page overflow. Actual hosted-browser checks remain pending.

## Bounded live evidence

Used server-side existing credentials, tested Gemini `gemini-3.8-flash`, and the existing persistent global daily ceiling. No automatic budget increase. Preferences below are synthetic examples, not collected child data.

| Input | Observed result |
|---|---|
| Taylor Swift, Billie Eilish, Olivia Rodrigo → Hindi | Three live choices; latest uncached result 10,231 ms and four charged ranking/model calls. Shortlist IDs: hindi-candidate-5, hindi-ddlj, hindi-candidate-13. |
| Hans Zimmer, Ludovico Einaudi, Enya → Hindi | Three live choices with a different shortlist: hindi-candidate-4, hindi-candidate-1, hindi-candidate-11. Latest repeat 1 ms, zero charges. |
| Same composer profile with isolated empty identity/result state | Three live choices in **21,190 ms**, **22 charges**: 18 identity lookups plus four model/ranking calls. Charges used the original persistent global budget, not an isolated allowance. |

Identical cached repeats consumed zero tool/model charges. Warming reused unexpired identity records. Earlier attempt with Yo-Yo Ma could not produce one uniquely confirmed exact identity and stopped instead of choosing an arbitrary match; the script was changed to the unambiguous Ludovico Einaudi example. Failed-attempt and sanitized successful records remain private in ignored `.local/`. Four previously unresolved catalogue identities remain honestly excluded where applicable.

These checks establish functional live integration and sensitivity to input signals. They do not establish family enjoyment, recommendation superiority or usefulness. Cold-state timing above is local and specific to Hindi; it does not guarantee hosted performance or every collection.

## Remaining release work

Follow [RELEASE_SETUP.md](RELEASE_SETUP.md) on the chosen host. Verify real same-origin browser calls, direct routes, persistent state/signing after restart, two external clients with independent quotas, cancellation, budget exhaustion, and live/partial results. Verify a public source repository with the license and reproducible instructions, and accessible judge demo with sufficient availability and budget. Those external steps were not part of this implementation authorization.

Cancellable production requests do not share in-flight identity lookups: two cold concurrent requests can pay for the same lookup. This preserves independent cancellation and is bounded by the two-job admission cap and global budget; warm before judging. Per-client fairness remains process-local and per IP. Multiple hosts require deliberate shared state/admission design.

## Claude collaboration

Skill: codex-claude-collab with read-only claude-opus-research. Persistent topic `heritage-bridge-implementation-readiness`; session `9fc3ec1f-4e10-4150-8ded-f2da8b66b73c`; verified canonical model `claude-opus-5-5` in all completed rounds. Rounds 1–2 established the original findings; round 3 inspected the fixes and returned the proxy/quota/transient-cache follow-ups. Codex owns the implementation and final verification. Claude's round-3 review was source-only; it did not run the tests or live checks.

Full response preserved privately in ignored `.claude-opus-research/heritage-bridge-implementation-readiness.fixes.json`; earlier rounds remain beside it. Original [readiness review](IMPLEMENTATION_READINESS_REVIEW.md) is preserved as historical evidence rather than rewritten to erase the findings.
