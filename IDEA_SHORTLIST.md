# Qloo idea tournament

## Latest user decision — Heritage Bridge selected, October 3, 2026

The user selected Heritage Bridge and requested a draft plan first, followed by implementation in a new chat. **Multiple collections from day one is confirmed.** Read [HERITAGE_BRIDGE_BUILD_PLAN.md](HERITAGE_BRIDGE_BUILD_PLAN.md) and [HERITAGE_BRIDGE_NEW_CHAT_HANDOFF.md](HERITAGE_BRIDGE_NEW_CHAT_HANDOFF.md). Three small collections are proposed; exact collection names remain planning defaults subject to source and Qloo coverage. This turn produced planning documents only; no new chat, implementation, live API validation or recruitment. Preserve Tuesday Fix. Prior selection, blocked-candidate and research-only statements below are historical where superseded. User selection does not establish originality or measured Qloo advantage.


**Newest fresh hunt:** see QLOO_CORE_SHORTLIST.md. Heritage Bridge is the creative lead, Hooked is a related runner-up, Dub First is rejected for this pass. These are sourced concept proposals with explicit competitors and test gates, not proved advantages. Second Home stays rejected.

**Latest user decision: Second Home rejected.** Barter/matching is not the intended AI contribution and Qloo was optional. No current champion. All earlier ranks below are historical; use the October 3 recheck in HACKATHON_CONSTRAINTS.md for the next selection.

**Latest October 3 reopened search:** NEW_MECHANISM_TOURNAMENT.md contains the current research shortlist. Second Home is the conditional research champion; no qualified runner-up. Tuesday Fix remains the existing prototype, not a canceled project. Will It Land and Cultural Catch-Up were withdrawn after proxy/baseline corrections. All rankings below are historical. No claim of global uniqueness, measured demand or sponsor advantage.

**Current status, 2026-10-02: user rejected gaming as not relatable. See the [latest relatable shortlist](RELATABLE_IDEA_SHORTLIST.md): Tuesday Fix, Both Sides, Two Doors. These are conditional creative options with substantial competitors, not validated unique products or build recommendations. Rankings and proposals below are historical. See the [current decision](HACKATHON_IDEA_DECISION.md).**

Research date: 2026-10-02. All proposed outcomes and thresholds are hypotheses, not measurements. Eligibility is conditional on the access, rights and personal eligibility gates in [constraints](HACKATHON_CONSTRAINTS.md). No implementation is authorized.

## Field formation

Six semifinalists were normalized: **ShelfBridge**, **SideStreet**, **SponsorFit**, **Encore**, **Nobody's Miserable**, and **Ungeneric**. The last two were removed before the four-finalist tournament. Codex originated ShelfBridge/Encore; Claude independently originated the other four before seeing an incumbent.

- Nobody's Miserable: raw minimum affinity across people is invalid because query scores are not calibrated across people. Even rank-based repair faces [CultureCircle](https://devpost.com/software/culturecircle) and [Duddle](https://devpost.com/software/duddle). Retain the visible tradeoff grid, not a claimed fairness percentage.
- Ungeneric: a general Qloo MCP wrapper duplicates the [official starter](https://github.com/qloo/qloo-hackathon-kit/blob/main/starter/mcp-client/README.md). Retain the ablation control, not the standalone infrastructure entry.
- Earlier explorations eliminated before semifinal normalization: gifted days (Aura), location/business analysis (GeoTaste/TAVA), opposite-taste exploration (Zesty), and festival scheduling (Clash/Frontstage). See [precedents](PREVIOUS_WINNERS.md).
- Late contrarian probes did not displace finalists: **First Controller** (adult gaming newcomer → one playable beginner game) needs actual free/browser-game coverage and onboarding access, not a generic videogame example; **Second Screening** (film club → licensed screening packet) needs a real licensable catalog and faces Swank's programming support. Both remain discarded hypotheses, not additional ranked finalists.

## Common eligibility and technical defense

Each finalist would be a working Qloo-integrated agentic tool: resolve ambiguous inputs; select and call tools; enforce independently verified constraints; inspect empty/partial results; ask for clarification; revise a bounded decision. The agent changes the next step in response to evidence. A deterministic constraint validator protects hard facts. A framework logo or one decorative API call does not satisfy our sponsor-removal test.

Preferred integration for later feasibility testing: public frontend → container/VM backend → supported Qloo harness/MCP → `qloo_rank` or Insights shortlist ranking, with an LLM controlling the bounded workflow. Actual tool schema, model access, output rights, quotas and deployment budget are untested. No paid provider is assumed. [Current starter](https://github.com/qloo/qloo-hackathon-kit/blob/main/starter/mcp-client/README.md).

Generic capability facts: Qloo can rank explicit output entities against cultural interest inputs; input attribution is documented under `feature.explainability=true`, with warnings possible. [Insights reference](https://github.com/qloo/docs-public/blob/main/reference/insights-api-deep-dive.md). This supports the proposed mechanisms, not their utility. An attribution shows which input affected the model, not why a person will like the result.

## Finalist 1: ShelfBridge — one book, then start

- **User/moment:** An adult wants to restart reading but cannot name favorite books; they can name films and music they love. Endless recommendations never become a first page.
- **Mechanism:** Use those familiar tastes to choose one book from a named shelf, repair the choice after one explicit objection, and open a legitimate sample or reading link.
- **Sponsor necessity:** Qloo supplies cross-domain ordering over the same finite book set; the LLM resolves inputs and handles clarification. If metadata plus an LLM chooses equally well, the sponsor hypothesis fails.
- **First 5–10 seconds:** “You know what you love watching. Find the book you want to start.” Three editable taste chips and a clearly marked sample case; one button produces one book, a short supporting reason, and “Start a sample.” No account or reading-history import.
- **Transformation/proof arc:** A 50-title shelf → one suggestion → “too long” or “already read” → constraint-respecting replacement → valid source link. An expandable evidence view separates Qloo input contribution, book metadata and editorial wording.
- **Metric:** Blind preference for Qloo choices against each baseline; valid-sample start rate; time to choice; hard-constraint error count. Not “increased literacy,” reading completion, or guaranteed enjoyment.
- **Controls:** Same shelf, factual metadata, constraints, display and explanation budget; LLM-only; genre/popularity ordering; shuffled taste seeds. Inspect recommendations before persuasive prose.
- **Scope:** One English-language demonstration shelf of 50 titles, adult users, 2–3 cultural seed types, one refinement, one lawful outbound sample/reading route. No local-library stock claim, social platform, book-content generation or marketplace.
- **Fatal assumption:** Qloo's cross-domain ranking changes what people actually want to start, beyond obvious genre/adaptation matching.
- **48h pass:** At least 45/50 titles resolve correctly; zero fabricated availability/rights facts; Qloo preferred in at least 16/24 blind trials against EACH baseline and a user-level advantage for at least 8/12 participants; 8/10 fresh users understand and reach the valid next action unaided. Exploratory thresholds, not statistical proof.
- **Downgrade/pivot/kill:** Missing attribution → show factual query provenance, never invented reasons. Coverage limited to a broad enough subset → name that shelf. No preference advantage → kill the Qloo mechanism; do not rescue it with better copy. No lawful sample route → downgrade “start” to “inspect,” then reassess the weakened idea.
- **Fallback:** Honest shortlist with explicit missing data; this retains utility but does not automatically retain a hackathon-worthy sponsor claim.
- **Remembered sentence:** “It used what I already love to help me finally start a book.”
- **Strongest objection:** This remains a recommender in a crowded domain. [PersonaReads](https://devpost.com/software/personareads) and [NoveList Select](https://about.ebsco.com/resources/novelist-select-overview) mean cross-domain/catalog discovery is not an invention. The narrower user, completion step, repair and measured lift must earn the distinction.

Data: [Open Library search availability](https://openlibrary.org/dev/docs/api/search) concerns Internet Archive editions, not branch stock; [its licensing guidance](https://openlibrary.org/developers/licensing) is not a blanket license for all assets. Use reviewed factual metadata, independently cleared images or text-only covers, and authorized links. [Gutenberg's permission guidance](https://www.gutenberg.org/policy/permission.html) requires title/jurisdiction care; link to landing pages. Public-domain-only coverage may overconcentrate on obvious classics, so do not silently narrow the test to easy wins. Official contemporary sample links exist: Macmillan provides excerpt routes for [The Terraformers](https://academic.macmillan.com/academictrade/9781250228062/theterraformers/) and [Archangels of Funk](https://academic.macmillan.com/academictrade/9781250807281/archangelsoffunk/). These demonstrate the route, not a completed 50-title rights audit or a recommended title list. Link out; do not copy the excerpts into the app.

## Finalist 2: SideStreet — your kind of afternoon elsewhere

- **User/moment:** A visitor has one free afternoon in an unfamiliar city and does not know which places merit the detour.
- **Mechanism:** Translate three known cultural/place favorites into a small destination cluster to explore, explain the tradeoffs, and repair it when a stop is rejected.
- **Sponsor necessity:** Qloo supplies cross-city/cross-domain place ranks. The application handles geography and constraints. No housing, relocation, neighborhood resident profiling or safety claims.
- **First 5–10 seconds:** Familiar favorites on one side, a destination map on the other; “Find my kind of afternoon.” One sample case works immediately, with editable real inputs.
- **Transformation/proof arc:** Generic destination highlights → three evidenced places → reject one or tighten area → revised cluster with links. No invented reservations, hours or route duration.
- **Metric:** Blind destination-place preference versus equally constrained LLM/popularity lists, correct identity/location, successful completion, and latency.
- **Controls:** Same destination pool and geographic bounds; rank-only changes; shuffled tastes. A home-neighborhood reconstruction is a diagnostic only: geographic leakage can explain it. Do not subtract query-normalized heatmaps or claim concentration of people like the user.
- **Scope:** Two well-covered cities, 30 reviewed places each, three-stop draft, no bookings or global coverage promise. A 60–90 minute visit is a user planning budget, not a guaranteed journey time.
- **Fatal assumption:** Affinity gives better choices beyond proximity, popularity and broad venue type.
- **48h pass:** At least 90% identity/geo coverage in both pools; same blind preference and first-use thresholds as ShelfBridge; zero invented operating facts; at least 80% of evaluated flows finish without manual intervention.
- **Downgrade/pivot/kill:** Weak heatmaps → use individual places, not an unsupported colorful surface. One covered city → label it. No held-out taste advantage → kill; dramatic geographic variation alone is insufficient.
- **Fallback:** Source-linked candidates for exploration, without claiming real-time availability.
- **Remembered sentence:** “It found places in another city that felt worth my afternoon.”
- **Strongest objection:** [Mapstr Matching](https://en.mapstr.com/fonctionnalites/mapstr-matching-artificial-intelligence) already recommends places worldwide from saved favorites; [Qloo's own map](https://www.qloo.com/) already visualizes taste-conditioned places. The core hook has direct commercial overlap. A complete bounded visit and visible repair need to exceed this floor.

## Finalist 3: SponsorFit — a defensible podcast shortlist

- **User/moment:** A small, nonpolitical brand is deciding which podcasts deserve sponsorship research.
- **Mechanism:** Rank a finite podcast slate against public brand/cultural signals, expose fit evidence and missing facts, and produce a research shortlist.
- **Sponsor necessity:** Brand-to-podcast affinity informs rank. No inferred actual audience overlap percentage, budget, availability, reach or conversions.
- **First 5–10 seconds:** A recognizable brand and three podcast cards showing different tradeoffs; “Which of these deserves a closer look?”
- **Transformation/proof arc:** Popular shows → culturally supported options → explicit missing-price/reach checks. Finish with a reviewable shortlist; no pitches sent or ad buys.
- **Metric:** Blind usefulness judgments from real planners, coverage, research time, factual accuracy. Historical sponsorship retrieval is only a confounded proxy, potentially contaminated by Qloo's training sources.
- **Controls:** Identical shows/metadata and brand brief; LLM and popularity; shuffled brands; no Qloo score as ground truth.
- **Scope:** 20 public brands and 50 podcasts, factual descriptions, source-linked notes. No scraping paid databases or using private Shopify data.
- **Fatal assumption:** Enough entity coverage and independent evaluator access to prove useful fit beyond existing planning products.
- **48h pass:** At least 90% correct entity resolution; at least three qualified evaluators available with permission; Qloo wins at least 14/20 balanced comparisons versus each baseline; no unsupported financial/performance claims.
- **Downgrade/pivot/kill:** Thin coverage → explicit narrow sector; no evaluators → remain research hypothesis, not decision-ready; no useful advantage → kill. Historical label hit rate alone cannot pass.
- **Fallback:** A bounded research assistant, which is much less distinctive.
- **Remembered sentence:** “It explained which shows deserved investigation before we spent money.”
- **Strongest objection:** [Podscribe's Planner](https://help.podscribe.com/dashboard-navigation/qA2few6ceZhaKHqAyDYhtX/campaign-planner-tab-/3mTToAp4n2uExmiC4xg7wS) already offers brand affinity and audience-fit planning. [Magellan AI](https://www.magellan.ai/products/media-planning) covers audience-based discovery. Claude's initial “tracking-centric incumbents” characterization was too weak; this is direct competition.

## Finalist 4: Encore — repair a canceled lineup

- **User/moment:** A small event organizer loses an act and has a constrained replacement roster.
- **Mechanism:** Eliminate unavailable/infeasible acts using supplied facts, then culturally rank the remainder and expose why the compromise changed.
- **Sponsor necessity:** Qloo provides cultural fit among feasible acts; external roster data supplies availability and fees. Neither Qloo nor the LLM establishes bookability or audience retention.
- **First 5–10 seconds:** Canceled lineup slot → feasible replacement choices; visible reasons eliminate impossible names.
- **Transformation/proof arc:** Tempting but infeasible famous act → real roster alternatives → changed constraint → revised recommendation. No booking or outreach performed.
- **Metric:** Constraint violations, qualified booker preference and preparation time; not ticket sales or attendance.
- **Controls:** Same roster/constraints, related-artist and popularity baseline, LLM-only, shuffled cultural inputs.
- **Scope:** One dated shareable roster, one event type, a comparison sheet. An invented scenario must be labeled and cannot establish live usefulness.
- **Fatal assumption:** Authentic roster access and actual evaluators, currently absent, plus meaningful Qloo differentiation.
- **48h pass:** A permissioned roster and at least three qualified evaluators; 90% resolution; zero constraint violations; 14/20 balanced judgments favor Qloo over each baseline.
- **Downgrade/pivot/kill:** Scenario-only data → demonstrator, materially weaker impact. No actual roster/evaluators within sprint → do not promote. No better decisions → kill.
- **Fallback:** Manual comparison with explicit unknowns, not fake confirmed bookings.
- **Remembered sentence:** “It repaired the lineup without pretending every similar artist was bookable.”
- **Strongest objection:** [Soundcharts](https://help.soundcharts.com/en/articles/3192479-what-s-compare-artists), [Advise](https://advise.events/how-it-works) and [Prism](https://prism.fm/) already cover adjacent discovery and booking decisions. Critical data remains less accessible than for the consumer finalists.

## Ranking and pairwise judgment

Codex's final research ranking is below. The event publishes equal criterion weights; the 0–10 scale and scores are ours. These are conditional design assessments, not measured performance or a promised chance of winning.

| Rank | Candidate | Technology | Design | Impact | Idea | Total /40 | Decision |
|---|---|---:|---:|---:|---:|---:|---|
| 1 | ShelfBridge | 7 | 8 | 6 | 7 | 28 | Provisional champion; utility unproven |
| 2 | SideStreet | 7 | 8 | 6 | 6 | 27 | Runner-up; direct Mapstr/Qloo overlap |
| 3 | Encore | 5 | 7 | 5 | 7 | 24 | Eliminate for this build without authentic roster/evaluators |
| 4 | SponsorFit | 6 | 5 | 6 | 4 | 21 | Eliminate; crowded, confounded evidence |

Below-7 explanations: ShelfBridge impact is bounded to one shelf and immediate choice, not sustained reading. SideStreet impact is a limited leisure choice; its idea score reflects direct competitors. Encore's technology and impact rest on currently unavailable operational data and a rare emergency. SponsorFit technology lacks independent ground truth, design needs domain explanation, impact is unproved, and idea overlaps mature products. Access/rights uncertainty applies to all and remains a separate gate, not a small numerical penalty.

Extra strategy diagnostics (not official weights): ShelfBridge has the shortest controllable input-to-action loop; SideStreet has the strongest visual first impression; Encore has the clearest dramatic consequence; SponsorFit has the clearest professional buyer. None currently has measured sponsor lift. Novelty alone cannot settle that gap.

### Six pairwise comparisons

| Pair | Tired-judge verdict on public app plus description | Evidence that could reverse it |
|---|---|---|
| ShelfBridge / SideStreet | **ShelfBridge, narrowly:** one repaired choice ends in a sample, while the map's central hook is already offered commercially. | ShelfBridge fails a same-shelf LLM comparison while SideStreet passes independent taste utility and a complete two-city flow. |
| ShelfBridge / Encore | **ShelfBridge:** a judge can supply tastes and finish the task; Encore's roster may only be illustrative. | Authentic roster, booker evaluations and stronger independently demonstrated decision improvement. |
| ShelfBridge / SponsorFit | **ShelfBridge:** immediately relatable and easier to test without industry access. | Qualified planners show a distinctive unmet workflow and strong independent lift for SponsorFit. |
| SideStreet / Encore | **SideStreet:** the judge can inspect genuine destination choices with their own inputs. | Encore passes authentic-data and evaluator gates while destination coverage or user preference fails. |
| SideStreet / SponsorFit | **SideStreet:** clearer consumer action and a visible spatial result despite crowding. | SponsorFit proves a specific advantage absent from Podscribe/Rephonic, while SideStreet merely copies Mapstr. |
| Encore / SponsorFit | **Encore:** the canceled-slot repair gives a clearer consequence and tradeoff. | SponsorFit secures credible utility evidence while Encore remains a synthetic roster demo. |

These are strategy comparisons, not an asserted official head-to-head judging process. The top pair is close enough that empirical evidence should dominate one-point scoring differences. SponsorFit and Encore do not automatically inherit the crown if both consumer ideas fail. A second submission is not recommended for the present unknown team/budget: it would split proof and presentation work before either mechanism passes.
