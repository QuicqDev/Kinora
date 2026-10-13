# Heritage Bridge: judge assessment, October 10, 2026

## Decision

Retain Heritage Bridge and the selected personal family scrapbook direction. It has a credible technical foundation and a legible emotional proposition. It is not yet an evidence-backed top-tier entry: family usefulness, Qloo advantage, the first-result reveal, and public judging availability remain the decisive gaps. This is a qualitative assessment, not a predicted placing or win probability.

User confirmed they are unsure whether the idea is grounded in firsthand experience or user conversations. Do not invent a founder story, family anecdote, domain advantage, or validated demand. The observed implementation is the team's demonstrated asset; audience understanding remains to be developed.

Scope of this review: source inspection, existing local checks, fixture browser walkthrough, current official rules and historical examples, and Claude research. No application edits, new provider benchmark, recruitment, deployment, publication, commit, or push.

## Official arena, reverified

- [Current overview](https://qloo.devpost.com/): a working Qloo agentic application; externally hosted functional demo; public repository, run instructions, open-source license, and description. Video is explicitly not required.
- [Current rules](https://qloo.devpost.com/rules): technology, design, impact, and idea are equally weighted. Technology is the first tie-break criterion. Judges may rely on submission materials without testing the app. Consequently, both the actual first-use experience and the description/screenshots must explain the transformation.
- Deadline: October 30, 2026, 11:45 p.m. EDT / October 31, 9:15 a.m. IST. Testing availability must extend through the November 16 judging end, not merely submission day.
- [Current gallery](https://qloo.devpost.com/project-gallery) does not yet provide a competitor field on which to base a relative placing.

## Verified implementation and limits

Today, catalogue validation checked 60 reviewed entries; TypeScript and production build passed. The initial test run passed 36/40: loopback connections were blocked by the execution sandbox (`EACCES`). The approved rerun with local networking passed all 40/40. This was an environment issue, not evidence of four application regressions.

The October 7 record reports 56/60 conservative Qloo identity matches, complete live flows across all three collections, different Hindi shortlists for contrasting non-heritage artist profiles, and a 21.19-second cold Hindi run. Those are previous recorded measurements, not repeated live tests today. They establish functionality and input sensitivity, not recommendation superiority or family enjoyment.

Source inspection confirms separate Qloo rankings for films and artists, bounded reviewed candidates, verified identities, exclusions for familiar/tried choices, positive feedback signals, bounded Gemini tools, persistent budgets/cache, honest failure behavior, and private local notes. These are real technical substance. Qloo is structurally central to ranking; the scrapbook and browsing remain useful without it, which is appropriate graceful degradation. Whether its ranking is materially better than an equally informed alternative is unresolved.

No public deployment was verified. This checkout has no configured Git remote and its project files are untracked; this does not establish that no external repository exists elsewhere. Do not call the project submission-ready until actual public source and hosted paths are checked.

## Judge rubric

| Criterion | Assessment | What raises it |
|---|---|---|
| Technological implementation | Strong local foundation; actual sponsor use. Agent behavior is deliberately narrow. | Show a real Qloo-dependent decision and reliable hosted execution; avoid inflating fixed tool orchestration into autonomous planning. |
| Design | Coherent, warm visual direction; first-result presentation has friction. | Immediate visible result state, prominent example path, a complete shared-activity path. |
| Potential impact | Weakest evidence. A plausible audience and emotional hypothesis, without observed family benefit. | Actual voluntary choices/encounters, separately recorded interest and comprehension, candid small-sample findings. |
| Quality of idea | Understandable and emotionally specific; mechanism remains close to a bounded cultural recommender. | Demonstrate why starting from the younger person's interests changes the family's choice and creates a useful shared moment. |

Likely skeptical question: “This looks thoughtful, but why would this family choose something better here than with a parent, a curated list, or a capable LLM?” More infrastructure alone does not answer it.

## Product findings and ordered work

### 1. Fix the visible success state before adding features

In the current 1265 × 712 browser viewport, the fixture result completed below the visible modal content. The screen still showed the three input favorites and the submit button; result cards required scrolling. This was directly observed, not inferred from source. `src/StartingPoint.tsx` appends Results after the full form without a result transition or focus/scroll handoff.

Proposed change: replace/collapse the form into a compact input summary on success, move accessible focus to the result heading, and show the first choice and next action immediately. Preserve an obvious Edit favorites action. Show the example listener as a visible alternative to manual input; today the live path is hidden inside a collapsed details element. The examples are synthetic demonstration preferences, not family evidence.

Keep the existing visual direction. The homepage screenshot showed clear typography, warm spacing, the intended family image, and the primary heritage action. A full redesign is not justified by this review.

### 2. Make one complete shared encounter the primary story

Existing components already include official destinations, conversation prompts, want/tried states, notes, and an explicit-like connection. The value should be legible as:

**“Find a film or song from your heritage through what your child already loves—and share a first moment together.”**

Proposed result structure: compact familiar-input set → selected heritage → Qloo-ranked options → one family-chosen work → official destination plus a specific conversation prompt → private memory and explicit feedback. Do not mix film and artist affinities to invent an overall best score; let the family choose a format or make the display order editorial and explicit.

Use specific, source-grounded work prompts where possible. The sampled song's current prompt (“Who would you want to share this song with, and why?”) is functional but generic. Do not generate fictional personal memories or make artist affinity sound like a prediction for a particular track.

The current `docs/DEMO.md` is stale relative to the homepage: it opens on browsing and uses Iqbal/Udit Narayan/Shreya Ghoshal as inputs. That is a weaker demonstration of bridging from outside the chosen collection than the already verified non-heritage example profiles. Revise this script during the next authorized implementation/presentation pass.

### 3. Resolve the audience and practical constraints

The homepage says “your child,” but there is no age/suitability selection, verified difficulty filtering, or reliable subtitle/access constraint. Work pages explicitly say suitability and difficulty are unassessed. This is honest, but leaves important parts of the parent's decision unresolved.

Choose a defensible initial audience after real conversations. Parent-led discovery with an older teen or adult child is a possible narrower claim, not a validated recommendation or automatic suitability guarantee. Keep all three user-requested collections; lead the demonstration with the best-supported one.

`App.tsx` records Comfortable / Needed help / Too difficult. `StartingPoint.tsx` always sends `easier: false`; `DiscoveryService` refuses an easier request because metadata is missing. Interest affects later ranking; difficulty does not currently select easier works. Either describe difficulty as a journal record or add a small source-reviewed constraint path. Do not claim adaptive language learning.

### 4. Prove the sponsor contribution against a fair alternative

Run the existing [equal-input protocol](BASELINE_PROTOCOL.md), preserving the same candidate pool, facts, constraints, exclusions, output slots, and interface. Compare Qloo with an equally informed LLM, the editorial order, and a parent's unaided choice. Use genre/popularity only when frozen metadata exists; never invent a weak baseline to win against.

Contrasting profiles and shuffled favorites are mechanism checks. They cannot establish that an output is more appealing. Record all failures, overlap, latency, identity coverage, and actual choices. Do not report compatibility percentages as enjoyment probabilities or infer a particular favorite caused a result without attribution evidence.

### 5. Treat agency as a product decision, not agent count

`GeminiAgent.rank` is told to call each available format once, then chooses one of three approved explanation framings. This is genuine bounded tool use with useful safeguards, but limited autonomous judgment. It is not automatically an eligibility failure under the event's broad alternatives. It may, however, be less compelling than an agent visibly resolving a real user constraint.

If deeper agency is needed, add one narrow, useful adaptation after collecting evidence: e.g., a user asks for a shorter activity and the system selects among source-verified durations/formats, then re-ranks eligible works through Qloo. Only do this if the data supports the promise. A generic chat box, extra agent roles, fabricated rationales, or unchecked difficulty inference would weaken the entry.

### 6. Complete hosting and submission evidence

Use [RELEASE_SETUP.md](RELEASE_SETUP.md). Validate real external origin, cold/warm behavior, persistence/restart, independent clients, failure and cancellation, deep links, and capacity through judging. Current search/result caching lasts five minutes; a warmed result is not a promise of free service for the entire judging period. Budget identity refresh, search, ranking, and model calls. Do not raise budgets automatically.

Prepare a short description and a few accurate screenshots that show input, changed choice, and the shared-activity outcome. Judges may never explore the album unless this value is visible in the submitted materials. No video work is required by this assessment.

## Updated Idea Forge applied

- **Seeds:** user-selected family scrapbook; cultural works already present in the reviewed collections; sponsor-supported cross-domain ranking. Firsthand founder experience remains unknown after the user's reply.
- **Combination:** taste-guided entry into a family-selected culture plus a record of an actual shared encounter. The album is useful when attached to the encounter, not merely an extra feature beside recommendations.
- **Why now:** existing working access to Qloo and bounded tool calling makes this feasible. No newly invented cultural-affinity technology or exclusive recent unlock has been established.
- **Nearest alternative:** [Common Sense Media](https://www.commonsensemedia.org/apps) already provides family media guidance and links to viewing destinations. MovieMuse and Akademino remain adjacent leads from prior research; today's direct extraction was empty, so no expanded feature claims are made about them. Do not claim family recommendations, cultural discovery, or memory albums are new categories.
- **Sponsor removal:** Qloo's audience-affinity ranking evidence disappears; a curated/LLM workflow can still function. The empirical question is whether that evidence improves the task.
- **Delayed value:** lasting cultural connection cannot be demonstrated in a minute. Show a real immediate choice and separately label a sample or replay of later feedback. Do not stage a shared encounter as if it happened live.

Historical lesson, not current rule: the [2025 gallery](https://qloo-hackathon.devpost.com/project-gallery) identifies GeoTaste, Alloy, Resonance AI and Zesty as winners. [GeoTaste](https://devpost.com/software/geotaste-your-agentic-qloo-taste-business-consultant) expresses a location-to-business-decision transformation; [Zesty](https://devpost.com/software/zesty) has a memorable reversal of recommendation. Our inference is to make the decisive transformation easy to recognize. Their awards do not establish what caused their wins or predict this entry's ranking.

## First-minute target and falsification gates

This is a proposed target, not observed timing:

1. 0–10 seconds: explain the family moment; show known favorites and selected heritage, with a visible example action.
2. 10–30 seconds: display real validated choices prominently, retaining the input context. If loading takes longer, show honest progress; cached evidence must be disclosed.
3. 30–45 seconds: choose a work, reveal its actual destination and a meaningful prompt.
4. 45–60 seconds: show the private album and how explicit feedback changes future eligible choices. Label demonstration memories and time compression.

Proposed 48-hour evidence sprint, not executed:

- Five fresh adult reviewers: at least four can explain the product after ten seconds and find a first usable choice without guidance within one minute. A failed test calls for flow changes, not extra features.
- Confirm the audience/problem with concrete recent examples from potential users. Ask what they already tried and what happened, not whether the concept sounds nice. Do not infer child interest from a parent's approval.
- Follow the existing exploratory family protocol (eight families / six preferring Qloo is a continuation heuristic, not statistical proof), with actual voluntary encounter and desire-to-continue recorded separately. Outreach/recruitment was not performed in this review.
- If comprehension passes but actual use fails, narrow the audience or shared activity. If the family experience works but Qloo repeatedly offers no useful difference against a fair baseline, reopen the sponsor mechanism before adding polish. If coverage prevents credible choices, repair the supported pool or narrow the claim while retaining the three collections as browsing surfaces.

## Claude collaboration record

Skills: `hackathon-idea-forge`, `claude-opus-research`, `codex-claude-collab`.
Persistent topic: `heritage-bridge-judge-audit`.
Session: `e72de341-f92b-4215-abb1-e17a05375020`.
Verified canonical model in the diagnostic and both completed research rounds: `claude-opus-5-5`.

The first sandbox invocation stalled with networking disabled and was interrupted. The approved diagnostic returned READY with the expected model. This establishes connectivity only; it is distinct from the two completed research rounds below.

**Round 1, independent judge review:** Claude read the updated Idea Forge methodology, current project records and relevant frontend/backend source. It recommended retaining the idea, exposing the bridge transformation, reducing onboarding friction, improving usefulness evidence and giving the agent a meaningful bounded decision. It independently caught the stale demo script and the fixed nature of Gemini's orchestration. Claude did not run the product or tests; its Devpost requests returned 403, so Codex supplied primary-source verification.

**Codex evidence return:** supplied the directly observed below-fold result, fresh 40-test pass, user's uncertainty about firsthand grounding, official event requirements and historical awards. Corrected Claude's proposed per-favorite attribution badges: separate rankings do not establish causal attribution and their scores cannot be compared across queries. Corrected its estimated benchmark call count and rejected output-diversity/LLM-overlap thresholds as tests of quality or sponsor value. Eight profiles × three collections is 24 discovery requests, each potentially charging multiple model/ranking calls plus searches and identity work; benchmark cost requires a ledger. Also rejected treating constrained agency as an automatic eligibility failure.

**Round 2, convergence:** Claude explicitly accepted these corrections, withdrew the attribution badge and the quality claims derived from diversity/overlap, and agreed on result reveal, visible example, audience/encounter evidence, equal-input usefulness and public release as priorities. It proposed reserving an early decision point for one useful agent improvement and a conditional 48-hour test with UI visibility, call accounting and participant evidence.

**Remaining differences / Codex final judgment:** a labelled cached example is an honest fallback, but cannot replace sufficient availability for the required working judged application. A confusing prototype plus weak initial intent is not by itself evidence that the underlying idea should be abandoned; repair comprehension and test the understood proposition before reopening selection. No arbitrary date or model consensus should trigger an agent feature. Choose that feature only when a concrete user obstacle and supporting data justify it. Five fresh reviewers and the existing eight-family exploratory comparison are decision aids, not statistical validation or eligibility conditions.

Private full responses: `.claude-opus-research/heritage-bridge-judge-audit.round1.json` and `.round2.json`; session storage and responses verified Git-ignored. Prompt purposes and consequential corrections are preserved here. Joint judgment supports retaining the direction; actual usefulness and public readiness remain unresolved empirical gates.
