# Focused idea validation — 2026-10-02

**Superseded:** the user rejected the gaming direction as not relatable. See [RELATABLE_IDEA_SHORTLIST.md](RELATABLE_IDEA_SHORTLIST.md). The conditional recommendation below is historical, not active.

Research-only follow-up to “let's start.” This pass tests whether a specific task remains underserved, rather than whether two models can invent a new name. Public research cannot establish global uniqueness, reveal private entrant ideas, or establish willingness to pay. Product documentation establishes advertised capabilities, not tested performance. Proposed experiments below have not run.

## Result and selection boundary

**Codex's provisional validation choice is a co-op purchase-and-setup repair agent**, working name ReadyCheck. The name is a placeholder, not cleared branding. One sentence: **Before friends buy a co-op game, find one everyone wants and can actually join, then tell each person exactly what to buy, download or host.**

The differentiated hypothesis is the complete, source-backed plan for each friend, including edition, store, multiplayer mode, free passes, existing ownership, player count and individual constraints, followed by repair when a requirement fails. Generic game recommendations, shared-library intersections, group voting and cross-platform filters are already established. Neither a chat interface nor adding Qloo makes those original.

This is a choice for a bounded validation sprint, not a validated business, a unique invention or permission to implement. The largest hackathon risk is that compatibility rules supply all the useful value and Qloo adds nothing. CratePlan leaves the active shortlist after its final public-evidence check failed to establish the specific underserved stock-selection need. The earlier eight-direction audit remains historical.

## Real failure and current rules

A [2019 Steam discussion](https://steamcommunity.com/app/548430/discussions/1/2789318172117849037/) contains a purchaser's firsthand account of buying Deep Rock Galactic on Steam to play with Xbox friends and discovering that the editions were incompatible. This supports the existence of a costly mistake, not its frequency or the disputed allegation about advertising. The [developer's crossplay page](https://www.deeprockgalactic.com/crossplay-info) still distinguishes Microsoft Store/Xbox interoperability from Steam. “Both have a PC” or “this game supports crossplay” is insufficient information.

[EA's Split Fiction FAQ](https://www.ea.com/games/split-fiction/split-fiction/features/friends-pass-playstation) documents a different path: an owner can invite one friend with the free Friend's Pass across supported platforms. Its current platform list includes Switch 2, unlike the shorter [EA Help article](https://help.ea.com/en/articles/split-fiction/split-fiction/how-to-play/). The latter also addresses duplicate purchases and online console subscription requirements. These are recognized support scenarios, not evidence of how many purchases an app could prevent.

The [Operation: Tango developer FAQ](https://clever-plays.com/operation-tango/faq/) documents a Switch Friend Pass crossplay exception and excludes couch co-op. Its old subscription names also illustrate maintenance risk: a source can be official yet partly stale. Use the relevant platform's current requirements before issuing actionable instructions. [Keep Talking and Nobody Explodes](https://keeptalkinggame.com/how-to-play-remotely/) gives another mode distinction: the Defuser runs the game; Experts can use the manual. Wanting everyone to rotate roles changes the required setup.

These examples justify investigating a rules-composition problem. They do not demonstrate demand for a new app or justify a large catalog. Do not depend on old launch limitations remaining true. Record source, platform, edition, mode and check date for every rule; unresolved facts block a “ready” status.

## Competitor collision test

| Closest product | Published overlap | Proposed difference still to verify |
|---|---|---|
| [PickThe.Games](https://pickthe.games/) | Group votes and vetoes, player counts, platform-pair crossplay checks, a large catalog and Discord workflow. Closest competitor found in Claude round nine and independently verified by Codex. | Only exact edition/license/pass/host assignment and repair remain a potential difference. Its public page does not establish whether all those details are absent from the product. Direct group voting is a mandatory baseline. |
| [Lobbii](https://www.lobbii.games/) | Cross-store libraries, common games, polls, readiness, sessions, chat and deals. | Its inspected public page does not document a per-person license/pass/host assignment with edition and mode constraints. This is a bounded finding, not proof no such functionality exists. |
| [Steam Library Compare](https://steamlibrarycompare.com/) | Library comparisons and group recommendations. | Ownership intersection does not by itself prove interoperability or determine a purchase/setup plan. |
| [Co-Optimus](https://www.co-optimus.com/games.php?newadditions=true) | System, player count and co-op mode discovery. | A strong factual baseline; test whether composing those facts for this specific group saves meaningful effort. |
| [Arcade Augur](https://devpost.com/software/arcade-augur) | Historical Qloo game recommendations with Gemini, according to its creator. | Clear prior art against calling taste-based game discovery new. The proposed contribution must be repairing a blocked group plan. |

An equally informed general assistant with official sources is another serious baseline. If it reliably produces the same plan as quickly, the standalone product advantage is weak. A larger competitor might also add this workflow; the concept is copyable. Any practical advantage would need to come from reliable maintained rules, good failure handling and demonstrated usefulness, not secrecy of the prompt.

## Normalized candidate: co-op plan repair

- **User and moment:** two adult friends want to play together; a intended game fails on edition, platform, cost or hosting requirements. Start with pairs to keep licensing and acceptance comprehensible; do not claim a two-player solution serves a larger party.
- **Before/after:** scattered store labels and FAQs become a plan assigning each person a supported role and explicit next action, or an honest explanation that no audited option fits.
- **First 5–10 seconds:** a labeled example shows “These two editions cannot play together.” A proposed repair shows each person's device, required copy/pass and remaining prerequisite. “No extra game copy” is distinct from “no extra cost,” because subscriptions and equipment may still matter.
- **Agent behavior:** resolve ambiguous edition names, detect missing facts, query the feasible game pool, handle a rejected requirement, revise the plan and explain the source of each requirement. A hard validator, not model prose, decides feasibility.
- **Qloo contribution:** rank alternatives against each person's explicitly provided interests after hard constraints are enforced. The [official Insights reference](https://github.com/qloo/docs-public/blob/main/reference/insights-api-deep-dive.md) includes `urn:entity:videogame` in the output-type enum. Event entitlement, exact catalog coverage and useful ranking variation remain untested. Cross-domain inputs are optional and must earn their onboarding cost.
- **Score interpretation:** within-person ranks can inform a group proposal; raw affinity scores are not comparable enjoyment probabilities. Actual acceptance belongs to the people. Do not claim fairness or guaranteed fun from a graph score.
- **Event fit:** a working Qloo-integrated agent with substantive revision could fit the documented requirements, subject to [current constraints](HACKATHON_CONSTRAINTS.md). A deterministic license planner with decorative Qloo would fail our selection standard even if useful outside this competition.
- **Scope:** six to ten audited games, one declared pricing region, manual ownership/device inputs, two-person online scenarios first. No account import, checkout, installation, global cheapest-game claim or unrestricted hardware compatibility promise. A plan is not proof that the network and hardware will run successfully.
- **Data and rights:** cite publisher/platform factual rules, use lawful metadata and links, do not copy game artwork or bulk scrape catalogs without permission. Qloo output terms and entitlement need verification. A public page is not automatically an open data license.
- **Fatal assumption:** Qloo helps choose mutually acceptable feasible alternatives more effectively than equal-information baselines. License savings cannot be used as evidence for this claim.
- **Fallback:** return a useful incompatibility explanation when nothing fits. If only the rules engine adds value, retain the concept outside this hackathon or stop; do not relabel it as essential cultural intelligence.

## Paper walkthrough, not a tested product

1. A pair enters Deep Rock Galactic on Steam and Xbox. The developer's documented edition split prevents labeling the plan ready.
2. They ask for an alternative. A future implementation would filter an audited catalog by both devices, player count, ownership and other requirements, then use the competing rankers to propose desirable feasible choices. No Qloo output has been generated in this research.
3. In a **separate illustrative case**, one person owns Split Fiction on PC and the other uses PS5. EA documents the Friend's Pass route. The plan still needs the relevant account, online subscription and device requirements checked before it is ready. It cannot promise zero total cost just because the second game copy is free.
4. If a third friend joins, reject that two-player plan and search again. If the bounded catalog offers no supported plan, say so.

The examples prove that meaningful rule differences exist. They do not prove the alternative suits the friends or that the proposed agent is better than a FAQ.

## Other directions and why they lose

**SyncScout: independent musician → TV-show pitch targets.** Claude originated this direction independently. [Tunefind's musician guidance](https://support.tunefind.com/en/articles/15273438-i-m-a-musician-can-you-help-me-get-my-songs-placed-in-tv-shows-and-movies) supports research into existing placements and supervisors and emphasizes agency relationships. Claude then found [SyncMatch](https://www.syncmatch.me/syncmatch), whose primary page advertises track-to-show/library/supervisor matching using sampled placement data. Codex verified the indexed primary text and corrected an important limit: it explicitly focuses on production music and excludes indie/major artist placements. It does not prove that the exact one-stop indie artist segment is served. It does establish the target-matching workflow, while artist-audience affinity still does not establish scene fit or an available brief. Drop the direction on that combined overlap and proxy gap. No sync-deal percentage, pricing or exhaustive coverage claim is relied upon.

**Pub-quiz draft concentration audit.** An existing question set might cover nominally different categories while repeatedly invoking related cultural interests. [Trivialogy's professional guidance](https://www.trivialogy.com/single-post/how-to-write-great-trivia-night-pub-quiz-questions) establishes difficulty and breadth as real host concerns. Qloo could flag cultural proximity and suggest minimal swaps from a verified question bank. However, taste is not knowledge or question difficulty. General generators already promise balance; an honest related-reference editor may have little incremental value. Close this direction for the current selection.

| Other researched direction | Evidence and disposition |
|---|---|
| CratePlan | Real stock/space workflow, but no additional public evidence established the exact owned-stock selection gap beyond themes, experience and existing tools. Close the active lead; do not claim booksellers have no problem. |
| Indie Steam bundle partners | [Bundly](https://bundly.online/) and [Mad Octopus](https://madoctopus.fun/) directly address discovery/matching and collaboration. Reject the proposed matching delta. |
| Better playtester targeting | [PlaytestCloud](https://help.playtestcloud.com/en/articles/2642913-targeting-players-by-gaming-history) already targets gaming history. The investigated developer anecdote concerned who responded, which taste matching does not fix. |
| Author comp titles | [Author Media](https://www.authormedia.com/patron-toolbox/comp-finder/) already advertises recent verified comps; additional comp tools were found. Shared taste is an insufficient substitute for content and market positioning. Drop CompBridge. |

## Codex comparison under the event rubric

These are subjective forecasts of proposed concepts, **not measurements or official judging scores**. Equal columns reflect the event's four equally weighted criteria. No implementation earns a claim of actual technical quality. Passing hard gates matters more than totals.

| Candidate | Technology /10 | Design /10 | Potential impact /10 | Quality of idea /10 | Total /40 | Current gate |
|---|---:|---:|---:|---:|---:|---|
| Co-op plan repair | 7 | 8 | 5 | 5 | 25 | Conditional validation choice; sponsor advantage open |
| SyncScout | 4 | 6 | 3 | 3 | 16 | Closed: competitor and proxy gap |
| Quiz concentration audit | 5 | 6 | 4 | 4 | 19 | Closed: taste-to-knowledge gap |

Pairwise, the co-op plan wins over SyncScout because its opening identifies a verifiable failure and produces concrete roles; a list of TV shows cannot establish an available opportunity. It wins over the quiz audit because compatibility can be checked independently, whereas “balanced” risks overstating what affinity means. After the SyncMatch collision neither losing concept merits a runner-up; their order has no practical consequence. These comparisons are strategic judgments, not evidence that judges will agree.

Claude's separate forecasts are co-op 6/8/5/5 = **24/40**, SyncScout 4/6/3/3 = **16/40**, quiz 4/5/3/4 = **16/40**. Codex reduced co-op from 27 to 25 after verifying PickThe.Games, and SyncScout from 20 to 16 after verifying SyncMatch's scope. Scores are not averaged. Claude's lower technical score reflects maintenance burden and untested sponsor value; Codex gives some additional credit for the proposed explicit feasibility/repair mechanism, not for implemented work.

## Smallest falsification sprint — only after implementation/testing authorization

Thresholds below are practical precommitted decisions, not statistical significance claims. Do not recruit or contact anyone under the current research-only authority.

1. **Access and coverage first.** Verify event credentials, permitted use and game output/shortlist behavior. Resolve at least six of eight preselected audited games correctly, leaving at least three genuinely feasible alternatives in each preference test case. If choices collapse to one, that case cannot test ranking. Failure closes or changes the catalog before UI work.
2. **Correctness before persuasion.** Create 20 independently checked scenarios spanning edition mismatch, two versus more players, free-pass exception, missing subscription, rejected hosting and unknown facts. Require zero false-ready plans and zero invented requirements or prices. Missing information must be reported. This validates the rule layer, not Qloo.
3. **Direct workflow need.** With later recruitment authorization, examine eight adult pairs' recent real decisions. Require at least four concrete incidents involving incompatible editions, unexpected requirements, duplicate purchases or substantial setup research, and at least four pairs who find the proposed plan materially useful compared with their normal method. An enthusiastic hypothetical response alone is insufficient. Failure demotes the market claim.
4. **Isolate Qloo.** Same catalog, rules, metadata, costs and display; compare Qloo, a capable equally informed LLM, and genre/popularity ranking. Eight pairs, two distinct cases per pair, anonymous equal-length slates with randomized display order; collect each person's acceptance before group discussion and before persuasive explanations. Any later explanations have equal length. Require Qloo to win the pair-level aggregate comparison for at least six of eight pairs against **each** baseline; ties do not count as wins. Also record unanimous acceptance, time and vetoes separately. Results are exploratory and clustered by pair, not 16 independent users.
5. **Direct-vote baseline, negative control and clarity.** Include browsing/voting on the same feasible pool, as PickThe.Games does. Require at least 30% lower median decision time with no lower unanimous acceptance before making a search-time advantage claim. Counterbalance separate matched cases across methods; showing the same people the same games repeatedly would contaminate timing. Shuffle taste inputs to check whether preferences matter; inspect whether an apparent gain is merely popularity or explanation bias. Separately show ten fresh viewers the first screen for ten seconds; require eight to explain both the compatibility problem and next action. Presentation success cannot rescue failed sponsor value.

**Catalog-size disagreement:** Claude proposed 30–40 audited titles and argued six to ten leaves no ranking value. Codex accepts the small-pool risk, but not the categorical claim or an arbitrary scale threshold. Begin with the cheap coverage/rule gate; expand only if real scenarios justify breadth. If direct inspection of the feasible pool is already easier, stop. Do not manufacture a large catalog to make Qloo look necessary.

**Crown-transfer rule:** no parked idea inherits the lead if co-op repair fails. SyncScout would need credible evidence that audience affinity improves actionable targeting beyond actual placement/brief information, plus a verified workflow gap. Quiz audit would need host-validated utility beyond simple category/era checks without pretending taste measures knowledge. Otherwise reopen discovery with the recorded failures, not cosmetic renaming.

Stop this research pass after the reciprocal Claude review and recording corrections. Further model agreement cannot settle coverage, usefulness or sponsor advantage.

## Final reciprocal review

Claude round ten accepted the primary-source corrections, paired scope and staged catalog gate. One unresolved practical risk remains: two friends may settle on a game so quickly through ordinary discussion that inferred ranking cannot improve the workflow. That is a reason to test against browsing and direct voting, not to inflate party size or catalog size. The slight score disagreement remains recorded above.

Rounds 8–10 used verified model `claude-opus-5-5`, topic `qloo-agentic-hackathon-selection`, persistent session `db1470d7-6254-4dd9-b750-a3325b3f5454`. No API call, prototype, recruitment or external publication was performed. See [the log](HACKATHON_IDEATION_LOG.md) for source corrections and history.
