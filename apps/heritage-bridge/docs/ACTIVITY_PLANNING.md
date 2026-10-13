# Activity planning — October 10, 2026

User-authorized direction: let the agent choose a shared activity that fits the situation, beyond the existing fixed film-and-artist tool sequence.

## Implemented decision

An optional family brief is interpreted by Gemini. It can inspect a film or artist pool with an optional time limit, propose a checked plan, or ask the family to clarify/revise the request. The model chooses the branch and arguments; there is no keyword-based routing of the family brief. A contextual request such as cooking together can lead to music without naming that format.

The interface shows the original request, proposed format, interpreted time limit, a constrained practical explanation and catalogue checks. The family confirms before discovery. Editing the brief or favorites invalidates the proposal. Requests that need revision cannot be resubmitted unchanged from that state. Cancellation and timeout preserve the input and prevent late responses replacing the current state.

After confirmation, the server filters the reviewed collection before identity resolution and Qloo ranking. Unknown runtimes never satisfy a time limit. Qloo ranks at most ten eligible candidates in the selected format, returning up to two films or one artist; the redundant fixed Gemini ranking sequence is skipped on this path. Favorite/like/tried exclusions, identity validation and provider-result validation remain active. Cache keys include format and time limit. A depleted pool produces an empty result without relaxing the confirmed constraint.

The homepage examples and no-brief discovery path retain their existing behavior. Fixture mode does not simulate a live activity planner.

## Bounds and limits

- At most four model turns, two distinct catalogue inspections and one tool call per turn. Invalid tools, unknown arguments, repeated inspections and uninspected/empty proposals are rejected.
- Planning uses the existing daily provider budget, HTTP rate/client limits, two-job admission cap, request deadline and cancellation signal. No budgets were increased for verification.
- Only format and reviewed runtime are enforceable. The model is instructed to ask for revision when essential suitability, subtitles, difficulty, accessibility, thematic or availability requirements cannot be checked. Natural-language interpretation is probabilistic: explicit user review of the original request against the proposed filters remains necessary. The server deterministically enforces the confirmed filters, not the meaning of arbitrary prose.
- Catalogue counts precede Qloo identity verification and taste ranking; unresolved identities can reduce the final pool. Partial live results disclose this.
- The brief goes to Gemini but is not saved in server cache or album storage. Album notes are never included. Providers' own processing policies are separate from application storage behavior.
- No song durations are verified. Artist affinity selects an artist, while the starting song is editorial. No suitability or family-enjoyment claim is inferred.

## Verification

Catalogue validation passes for 60 reviewed entries. TypeScript and production build pass. All 50 tests pass, including seven new planner/HTTP tests covering tool feedback, conditional decisions, invalid and empty proposals, cancellation, budget exhaustion, schema boundaries, cache isolation, scoped Qloo calls, exclusions and foreign-result rejection.

Actual configured Gemini/Qloo calls were checked with synthetic requests:

| Request | Observed behavior |
| --- | --- |
| Mexican film, at most 110 minutes | Inspected seven reviewed runtime-qualified films; proposed movie/110. After confirmation, Qloo returned Temporada de patos (87 minutes) and La misma luna (109 minutes). Two unresolved identities were excluded and disclosed as limited live results. |
| Cooking together, no requested format or hard duration | Chose artist/no limit, explained listening alongside the activity, inspected eight artists. After confirmation, Qloo returned Silvana Estrada with the editorial starting song Te Guardo. |
| Hindi full film, at most 90 minutes | Inspected zero verified fits and asked for revision; no ranking requested. |
| Movie suitable for a six-year-old, with English subtitles | Asked for revision because those requirements cannot be verified; no ranking requested. |
| Song with a hard five-minute limit | Asked for revision because no song has a verified duration. The unchanged request could not be resubmitted; editing restored the planning action. |

The first two flows completed in the actual browser. The final build was checked at desktop and mobile 390 × 844: proposal, original brief and confirmation remain usable; editing a needs-input request clears the old proposal; results receive focus and show the confirmed constraint. One- and two-choice results adapt to the available width. Recent real rankings were reused on repeat requests. Private screenshots are in ignored `.local/activity-plan-2026-10-10.jpg`, `.local/activity-plan-mobile-2026-10-10.jpg` and `.local/activity-results-2026-10-10.jpg`.

These checks establish technical routing and constraint behavior, not family demand, satisfaction or superiority over simpler recommendations. Public deployment remains separate work.
