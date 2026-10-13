# Implementation submission-readiness review

October 7, 2026 (India). Scope: Heritage Bridge implementation, not video. Review only; no application fixes, deployment, submission, commit or push.

**Decision: keep Heritage Bridge and make targeted corrections before submitting. The current build is a credible local prototype, but it is not ready to submit unchanged. No wholesale rewrite or new idea is needed.**

Codex owns this decision. Claude Opus 5.5 independently inspected the source, then revised its priorities after Codex supplied reproductions. Both reached the same conditional verdict. Technical integration works; release configuration, recommendation behavior and visibility of the core bridge need attention.

## Verification completed

- `npm run check`: catalogue validation (60 entries), TypeScript checking and production build passed. The sandbox blocked loopback fetches in two HTTP tests; the remaining 30 passed. Rerunning `npm run test` through the approved network route passed all 32. Those initial failures were environment restrictions, not application defects.
- Synthetic provider probe reproduced familiar-input recommendations, misplaced feedback capping and fixed candidate truncation. No real provider calls were made.
- Synthetic local HTTP probe reproduced three simultaneously active discovery jobs despite the declared limit of two after cancelling one browser request.
- `npm audit --omit=dev --json` reported four affected packages: two high and two moderate. `brace-expansion` reported an available fix; the `undici`/Pi/harness chain did not. Exploit reachability in this application is unestablished.
- Existing private live-smoke record corroborates three earlier successful technical flows: Hindi 21,724 ms / ok; Tamil 8,464 ms / partial; Mexican 7,636 ms / partial. Each charged four calls and had a cached repeat. All used the same Iqbal, Udit Narayan and Shreya Ghoshal profile. These are earlier measurements, not fresh live tests from this review. Raw responses remain private.

The [official rules](https://qloo.devpost.com/rules) were rechecked through indexed official content after direct fetches failed. They require working Qloo-integrated software meeting an agentic-tool/framework/agent route, a functional demo link, public source with an open-source license and run instructions, and free judge access through judging. Deeper autonomous planning is not an explicit requirement. This review does not determine entrant eligibility.

## Corrections to prioritize

| Priority | Finding and evidence | Recommended correction |
|---|---|---|
| Release gate | No root LICENSE found. Root `README.md:1` and root scripts still introduce Tuesday Fix. Local Git has no commits or configured remote; an accessible public submission repository was not verified. | Add the chosen open-source license; lead the root README with Heritage Bridge and its exact installation/run instructions; retain the old prototype as clearly labelled historical work. Verify public source access when publication is authorized. |
| Release gate | `server/app.ts:21` allows only localhost origins. A normal browser POST from a public HTTPS origin will be rejected. `server/index.ts:5` binds loopback; port selection is app-specific. | Configure the actual public origin and the host/port required by the selected deployment. Loopback is valid behind a same-host reverse proxy, so it is not inherently undeployable. Configure proxy trust only for the known topology. |
| P1 code bug | `server/app.ts:70` releases the concurrency slot on response close. Provider work continues. Probe: one active job, cancel it, start two more -> **three active jobs**. The browser abort does not propagate into discovery/provider calls. | Keep the slot until the job finishes, or propagate cancellation through provider work. Add a total request deadline and a meaningful regression test. Preserve daily budget accounting. |
| P2 code bug | `server/discovery.ts:156` caps all positive likes at seven before restricting them to the target collection. Probe: seven Mexican likes followed by a Hindi Udit Narayan like -> Hindi like omitted from ranking signals. | Filter relevant valid likes before applying the cap. Test cross-collection feedback and identity-resolution behavior. |
| P2 product correctness | `server/policy.ts:83` excludes only disliked items. Selected favorites remain eligible ranking options. A mock-ranked flow returned Iqbal even though Iqbal was supplied as a favorite. Real Qloo frequency is unknown. | Define novelty for “next discoveries” and exclude familiar input identities from that flow. Deliberately decide how liked/tried works should behave; revisiting can remain available. If tried-state exclusions are added, send minimal work IDs, never notes. |
| Reliability gate | `server/discovery.ts:138` resolves up to 10 films and eight artists sequentially. Each describe call has a 20-second timeout. A transient identity failure aborts the entire request. No fresh cold-cache live run was performed. | Validate startup warming and refresh identities within sponsor caching terms. Bound total time, preserve usable partial coverage where appropriate, and test clean-state behavior. Do not swallow global authentication/budget failures or extend cache lifetime blindly. |
| Release reliability | Shared SQLite daily budget is 100 by default. Private cache/state must persist on the chosen host. `npm start` requires dev dependency `tsx`; a production install omitting dev dependencies cannot use this start path. Favorite signing secrets are process-local. | Select a supported installation/runtime and persistent storage topology. Maintain fair judge access within cost limits. Use one stable process for the small demo or design shared signing explicitly. Test restart recovery. |
| High-value product improvement | `src/App.tsx:149` leads with browsing; the favorites-to-heritage action is inside a collection and labelled optional at `:253`. | Put the actual bridge on the first screen: familiar favorites -> selected heritage -> useful starting points. Reuse the existing flow. This concerns the application itself, not video. |

Do not force incompatible dependency upgrades. Inspect advisory paths, test compatible repairs, and document unresolved exposure before public hosting. Direct Insights requests use Node's built-in fetch; npm flags a separate undici package under Pi, so the audit does not establish that every ranking request is vulnerable.

## Substance and scope

Qloo is genuinely responsible for ranking verified candidates. The implementation checks returned IDs, domain, affinity and duplication; it never joins scores across separate queries. Identity resolution uses sourced names and years. Live errors never become undisclosed samples. Notes stay in the browser and request schemas reject private-note fields. Collections, official destinations, conversation prompts and separate want/tried records form a coherent product.

Gemini invokes scoped ranking tools and selects one of three approved explanations (`server/gemini.ts:44`, `:55`, `:126`). This plausibly meets the event's minimum agentic route; the organizer makes the final determination. Its limited decision-making is a competitive weakness, not a proven eligibility failure. Describe that role accurately. A new free-text parsing feature is optional, not a prerequisite for submission.

The fixed ten-film pool currently omits Secret Superstar and Piku from default Hindi personalization. That is a bounded-scope limitation, not an API correctness failure. Disclose or improve candidate selection without merging incompatible scores. Four unresolved identities may remain excluded honestly. A family study is not required to release the prototype; claims of measured enjoyment or superiority would require evidence.

## Smallest observable gates

1. On the selected hosted URL, verify ordinary same-origin browser POSTs, direct routes, server-only credentials, persistent state and a reproducible installation.
2. All existing tests and regression tests for collection-specific likes and cancellation concurrency pass. Discovery novelty follows the chosen policy.
3. Validate a non-heritage favorite profile through the real discovery flow, with an explicit total time limit, and separately measure a clean identity cache versus a warmed cache.
4. Compare two contrasting favorite profiles against the same frozen candidate pool. Record whether output changes, including failures. Variation demonstrates signal sensitivity, not usefulness or superiority.
5. Verify budget exhaustion, partial coverage and restart recovery preserve browsing and album use. Demonstrate sustainable judge access.
6. Confirm the public repository, license and first-screen explanation identify the actual project.

Unknowns: chosen production host, clean-cache latency, contemporary/non-heritage signal coverage, comparative usefulness, advisory reachability and public source/demo availability. None is settled by the 32 automated tests.

## Collaboration record

- Skill: `codex-claude-collab`, with the read-only `claude-opus-research` helper.
- Persistent topic: `heritage-bridge-implementation-readiness`.
- Session: `9fc3ec1f-4e10-4150-8ded-f2da8b66b73c`.
- Canonical model verified by helper: `claude-opus-5-5` in diagnostic and both research rounds. No substitution.
- Network recovery: initial sandbox invocation stalled with network disabled and was interrupted. An approved-route READY diagnostic succeeded. That diagnostic was connectivity evidence, not completed research.
- Round 1: independent source review. Claude distinguished careful engineering from unfinished submission packaging, a buried core flow, thin Gemini agency and unmeasured child-favorite coverage.
- Codex evidence return: all 32 tests passed; three synthetic reproductions; existing sanitized live measurements; current dependency audit; rule verification. Corrected cold identity count to 18, proxy assumptions, cache-extension advice and license/private-package conflation.
- Round 2: Claude accepted the feedback-cap and concurrency bugs, moved them ahead of optional agency features, withdrew unsafe cache/proxy advice, and agreed to targeted corrections rather than a rewrite.
- Codex final qualifications: public repository absence is unverified beyond local Git state; treating one identity failure as partial must not hide systemic authentication/budget failures; novelty needs an explicit revisit policy; signal variation does not prove usefulness. No time-to-fix estimate is treated as evidence.
- Important prompts and full responses are preserved in ignored `.claude-opus-research/heritage-bridge-implementation-readiness.round1.json` and `.round2.json`. Synthetic reproduction scripts remain in ignored app `.local/`. No secrets are copied into this report.

Optional follow-up polish: recovery from one malformed album record, library-version cache keys, precise server error status codes, a pinned tested Gemini configuration, and clearer candidate-cap disclosure.
