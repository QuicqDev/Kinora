# Judge review after activity planning — October 10, 2026

Scope: whole-app reassessment requested by the user after activity planning shipped. Review and research records only; no application edits, new provider benchmark, recruitment, publishing or deployment.

## Codex judgment

Heritage Bridge is now a credible, coherent local hackathon prototype with a useful bounded agent. It is not yet submission-ready or supported as a leading entry. Keep the idea, scrapbook design and three collections. The next priority is evidence and task completion, not agent count or another interface redesign.

The agent can interpret context, choose a format/time constraint, inspect actual catalogue facts, propose a checked activity or request revision. That changes the candidate pool and Qloo call. This is meaningful progress beyond the old fixed two-domain sequence. However, a simple format/time form can accomplish much of the explicit-request path. Its strongest incremental claim is handling a situation where the family has not already chosen the format, and helping recover from an infeasible request. Recovery currently ends in generic revise-the-request text. It is not yet a broad adaptive family guide.

Gemini chooses the activity constraints; Qloo ranks eligible work identities using taste signals; editorial data supplies work notes, prompts and starting songs. These roles should remain clear. Qloo does not decide that cooking calls for music, and artist affinity does not establish song preference.

## Evidence reviewed

- Fresh browser walkthrough: existing live result → Te Guardo detail → empty album → Explore → reopened starting-point form. The favorite identities survived, but the brief, proposal and shortlist did not survive opening the work. No notes or fabricated encounters were created.
- Source reviewed: App, StartingPoint, Results, Connection, Album, storage, planning, discovery, policy/config and release documentation. Root README still describes the older fixed orchestration and output slots.
- Prior-turn completed verification: 50 tests, catalogue validation, TypeScript/build, desktop/mobile checks and real Gemini/Qloo examples. These were not rerun or presented as fresh benchmark measurements in this review.
- Fresh local catalogue count:

| Collection | Films | Films with runtime | Films with known runtime ≤120 min | Song runtimes |
| --- | ---: | ---: | ---: | ---: |
| Hindi | 12 | 3 | 0 | 0 |
| Tamil | 12 | 9 | 2 | 0 |
| Mexican | 12 | 8 | 8 | 0 |

These are metadata coverage counts, not claims about the true lengths of works with missing metadata. Catalogue eligibility also precedes Qloo identity verification.

## Rubric assessment

| Official criterion | Judgment, not an official score |
| --- | --- |
| Technological implementation | Strongest area: working sponsor ranking, constrained model decisions, identity/result validation, cancellation, quotas and honest failures. Public reliability remains unverified. |
| Design | Clear proposition and coherent visual direction; visible results fix the earlier major defect. Planner discoverability and loss of task context still weaken the full journey. |
| Potential impact | Weakest evidence: specific plausible audience, but no recorded voluntary family-use or comparative choice outcome. Tests and synthetic personas cannot establish this. |
| Quality of idea | Memorable emotional framing; currently still a curated cultural recommender plus a private album. The actual intergenerational encounter must distinguish it. |

## Biggest gaps, in order

### 0. Public submission gate

No public demo or public repository was verified. `git remote -v` is empty in this checkout; this does not prove no external repository exists elsewhere. MIT and local run instructions exist, but are not proof of public accessibility.

The [official overview](https://qloo.devpost.com/) was checked today: externally hosted, publicly usable demo; public source and run materials; open-source license; project description. No video is required. Deadline shown: October 30, 2026, 11:45 p.m. EDT, which is October 31, 9:15 a.m. IST. Full rules returned 403 in this review, so do not represent all legal/eligibility clauses as freshly verified.

Smallest completion gate: an outsider can use the real HTTPS app and obtain a live result; a clean checkout runs from the published instructions; cold/warm startup, restart persistence, deep links, two clients and quota exhaustion are checked on the actual host. Follow RELEASE_SETUP.md. Plan capacity/cost through judging; five-minute result caching is not unlimited availability. Publication requires a separate authorized action.

### 1. Support an ordinary short family moment

“We have ten minutes” is central to the small-shared-moment story, but no starting song has a verified runtime. The honest refusal is valuable engineering and weak task completion. Only 20 of 36 films have runtimes; Hindi has no known fit under two hours.

Specific first-use mismatch: Hindi is the default heritage, but the form offers the same “film tonight, at most 110 minutes” example for every collection. Under the current facts and correct constraint interpretation, the default collection cannot fulfill its own suggested film request. Make examples collection-aware or fill the metadata before demonstrating that path. This is a deterministic catalogue observation, not a newly executed model benchmark.

Smallest useful improvement: verify exact editions and durations for a few existing starting songs in each collection, plus relevant factual access information. Keep track duration separate from artist affinity. Then an infeasible film request can present a checked listening alternative and ask before changing format. Preserve time for conversation separately; a ten-minute track does not leave conversation time inside a ten-minute activity budget. Do not silently claim complete runtime coverage, regional availability, subtitles or suitability.

### 2. Establish audience usefulness and Qloo's incremental value

The user was unsure of firsthand grounding. No real family-demand claim is warranted. Contrasting profiles returning different shortlists proves input sensitivity, not quality.

Run a small, clearly exploratory comparison with actual consenting target users, using the same candidates, metadata, filters, result slots and interface for Qloo, an equally informed LLM and editorial selection. Blind/randomize method labels. Record which choice they voluntarily want to try, whether they can actually access it, and whether an encounter happens; separate parent approval from the other participant's interest. Retain failures and negative reactions. Five to eight sessions can guide iteration but cannot support population-level claims. BASELINE_PROTOCOL.md needs its output-slot rule aligned with the confirmed activity (film or artist), not always two films plus one artist.

### 3. Put the agent in the first useful interaction and preserve it

Homepage examples call `find(initialExample)` directly without a brief, so the easiest path bypasses the new decision. The useful contextual behavior is optional deeper in the form after three favorites. A judge may only see the older recommender.

Offer a visible, editable example situation alongside example tastes. Let the judge see request → checked proposal → confirmed constraint → Qloo choice without first rerunning discovery. Preserve the current request, proposal and shortlist in session state when opening a work; provide a return-to-plan path. This need not persist the brief to a server or send album notes anywhere.

### 4. Match the audience promise to actual support

The homepage says “your child,” but age suitability, language difficulty and subtitle availability are unassessed; some listed films include mature themes. Choose a defensible initial audience based on conversations—parents and adult children are a plausible hypothesis, not a validated pivot. Avoid implying child-safe recommendations. If younger children remain central, essential suitability/access metadata is core work rather than disclaimer copy.

Difficulty feedback is a journal record, not an adaptation signal. Many music descriptions/prompts are generic; the inspected song page asks which song brings back a memory. A few work-specific, source-grounded prompts would better connect the recommendation to an actual encounter. Do not invent personal memories or use private notes for agent context.

## Recommended sequence

1. Verify a small short-activity subset and make the agent's contextual choice visible on entry; preserve the plan through detail navigation.
2. Run the exploratory target-user comparison and revise claims from what actually happens.
3. Complete public release checks in parallel, then update root README and submission text/screenshots around the demonstrated loop.

Do not add agent swarms, a large chat interface, more collections, accounts or automatic memory inference before these gaps are resolved. The useful story to demonstrate is a familiar taste becoming a feasible shared encounter—not merely a successful API response or a refusal.

## Independent-review status

Claude review was initially rejected by automatic approval review because sending private repository content to an external service was not considered sufficiently authorized. The user then explicitly authorized sharing relevant source and review notes while excluding secrets/private album data. Both subsequent rounds completed using verified `claude-opus-5-5` on topic `heritage-bridge-judge-audit`, session `e72de341-f92b-4215-abb1-e17a05375020`.

Round 3 independently inspected current source and judged the planner genuine but small, with much of its output expressible by a two-field form. It prioritized public release, visible sponsor contribution, audience evidence and careful claims. It initially recommended keeping the planner out of the first minute. It also identified returning-user favorite entry friction. It did not run the app/tests and did not freshly reread Connection.tsx; Codex inspected that component separately.

Codex returned fresh browser evidence of lost request/proposal/shortlist state, exact runtime coverage, stale root README, source-verified no-fixture-on-live-failure behavior and current official requirements. Codex corrected age suitability being “the main parent concern” from asserted priority to an untested hypothesis, and reiterated that profile contrast is sensitivity rather than usefulness/attribution evidence. Codex proposed a small exact-edition song-duration subset and one optional contextual example after the immediate bridge value.

Round 4 accepted those corrections and the optional-example approach, elevated lost state and metadata coverage, and identified the Hindi default versus 110-minute suggested-request mismatch. It recommended no additional agent tools. Its suggested numeric walkthrough thresholds and “no slower than a form” criterion are not adopted as requirements: tiny samples are exploratory, and useful assistance can justify extra time. Nor does missing metadata prove the planner “mostly refuses” across real usage; representative request frequencies have not been measured.

Joint conclusion: retain the direction, complete the actual shared-activity path, demonstrate sponsor contribution honestly and finish public release. Codex's final priority keeps real-user/baseline evidence as core winning-case work rather than optional merely because hosting succeeds. The remaining empirical questions are whether a contextual brief helps enough to justify its effort, which constraints users actually raise, and whether the Qloo-ranked choices are useful relative to equal-input alternatives.

Private full outputs are Git-ignored: `.claude-opus-research/heritage-bridge-judge-audit.round3.json` and `.round4.json`. No outreach was conducted; the review does not establish consent for future participant recruitment or deployment.
