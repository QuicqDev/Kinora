# Reopened idea search — October 3, 2026

**Superseded by explicit user rejection:** Second Home is rejected, not a conditional champion awaiting credentials. The user correctly identified that barter and matching work without AI and that Qloo was optional to the proposed core. Do not revive it through a different name, more participants or a more elaborate solver. The live event brief recheck confirms Qloo must determine the core cultural value. The previous analysis below is retained as history; its validation plan is no longer the next action.

Research checkpoint, not a validated pivot. Preserve the Tuesday Fix prototype. User explicitly invoked Idea Forge, Claude Opus Research and Codex–Claude Collaboration and activated the continuing idea-search goal.

**Latest practical audit:** the small-group scope may erase the value of taste onboarding. Measure total owner effort, not question count alone. A real organizer documents slow want-list review, but in a board-game trade; this does not validate a 15-person book exchange. Research priority remains conditional, pending user reaction, Qloo access and actual preference/effort evidence. See the practical audit below.

## Provisional Codex choice: Second Home

**Trade something you don't use for something you want—even when nobody wants a direct swap.** Working name only; no brand clearance.

Start with an existing friends, apartment or workplace group, one offered physical cultural item per adult, and a shared handover session. Books are the cleanest initial scope; records require distinguishing an artist affinity from interest in a specific record. Do not create a public marketplace, escrow or shipping system for the first proof.

The problem is discovery and agreement: people may not know which available item they would like, and two-way wishes may not align. [Which?'s January 2025 survey of 2,047 UK adults](https://www.which.co.uk/policy-and-insight/article/marmite-scented-deodorant-used-pyjamas-and-rotten-fruit-which-reveals-the-uks-most-disappointing-christmas-presents-a2MYW4I4pDSJ), published December 29, reports 21% received an unwanted/unsuitable gift. This supports unwanted possessions, not demand for this product. A [2017 EPFL/UCSD barter study](https://swapit.github.io/data/wsdm238-rappazA.pdf) found explicit wishlists missed many actual trades in its historical datasets. Modern adoption and local pool density remain unproved.

### Mechanism and sponsor contribution

1. Owners enter an actual offered item, condition and handover constraints, plus explicit cultural favorites and known wants.
2. Resolve the offered items and favorites to Qloo entities, asking about ambiguity. Qloo ranks a fixed available pool using cross-domain interests; it supplies suggestions, not accepted trades. [Qloo parameter documentation](https://raw.githubusercontent.com/qloo/docs-public/main/reference/parameters.md) documents entity filters and interest signals. Actual key coverage, endpoint behavior and limits remain untested.
3. The agent selects a consequential question: “Would you exchange your offered item for this specific item?” Human yes/no answers build the exchange graph.
4. An exact matcher selects disjoint two- or three-person cycles using only approved edges. Each person gives and receives one item; nobody's item is assigned twice. People outside cycles retain theirs.
5. Complete proposals receive final confirmation. Changed items, conditions or approvals invalidate the affected plan and trigger recomputation.

The technical bet is **more accepted exchanges for the same amount of questioning**, not a novel cycle algorithm. Qloo supplies within-person ranks; never sum raw affinity across people or label it an acceptance probability. A tool-using LLM could reproduce much of this workflow. Only a controlled comparison can establish extra sponsor value.

### Codex refinement: a bounded stopping rule

Maintain a confirmed graph containing yes answers, and an optimistic graph containing yes plus all still-unknown feasible answers. No edges and hard-constraint violations are excluded. Let L and U be exact maximum participant coverage by disjoint cycles of length two or three in those graphs.

Under a fixed item pool, stable answers and fixed constraints, L <= fully informed optimal coverage <= U. If L = U, further answers cannot improve participant count within this model. This certifies neither satisfaction nor fairness nor physical delivery. A heuristic optimistic packing is not a valid upper bound; use an exact optimum or a valid relaxation bound.

Questions target unknown edges that could improve the confirmed plan. Qloo can order promising questions, but cannot remove low-ranked or unmapped unknown edges from the optimistic graph. The bounds may remain unchanged after a question; no guaranteed question efficiency. At the question budget, show the best confirmed plan and remaining gap. This is an engineering refinement based on established methods: [preference elicitation for exchanges was studied in 2002](https://www.cs.cmu.edu/~sandholm/exchange_elicitation.pdf).

### First interaction and ecosystem

Illustrative seeded scene: three unwanted books and three people, with no reciprocal two-way swap. Three explicit approvals close a triangle. Open any edge to see the actual approval. Change one answer to no: the plan breaks or repairs honestly. Label seeded answers as demo data.

The natural repeat loop is list → discover → approve → exchange → report outcome. Existing clubs or community hosts could run repeated rounds if one group finds value. Network effects and reduced waste are hypotheses, not demonstrated impact. The initial presentation should be a small shelf of actual objects and clear ownership, not a decorative network diagram or chat transcript.

### Competitors and strongest objection

- [DDBD / BarterAI](https://barterai.io/en/exchange) advertises circular chains of three to five participants and confirmations. [Badal](https://badal.app/en/) advertises AI barter matching. Vendor claims inspected; operation not tested.
- [Gen Con math-trade discussion](https://www.gencon.com/forums/80-events-2021/topics/16796-gen-con-math-trade) describes software maximizing trades from participant wants. It is historical participant evidence, not an official software performance evaluation.
- Donation, resale and simply browsing a small catalogue are strong alternatives.

The remaining hypothesis is cross-domain discovery with fewer consequential questions. We have not established that competitors lack this, that people want it, or that Qloo outperforms an equally informed LLM. No claim of global uniqueness.

## Other candidates assessed

**Will It Land? — Claude's initial champion.** An inline checker would flag cultural references in a speech and suggest replacements for a target age group. The first-screen transformation is excellent, but its proposed evidence fails the target. [YouGov's 2019 article](https://yougov.com/en-gb/articles/22631-which-tv-shows-divide-generations) measures liking among viewers/familiar respondents; it does not measure comprehension of an allusion. Qloo documents age-influenced affinity, not recognition of a joke. Rank shifts cannot repair this mismatch. Codex rejects the green/red “will understand” promise without actual audience testing. An affinity-only rewrite would be a materially weaker product.

**Cultural Catch-Up — Claude's weak fallback.** Personalized cultural risers from a period away. No primary evidence of a sufficiently painful problem supplied this round. A web-enabled LLM can retrieve recent information, so a knowledge-cutoff argument does not establish advantage. Do not promote.

**Business lane eliminations.** Catalogue replacement meets [Parrot content valuation](https://insights.parrotanalytics.com/content-valuation-whitepaper) and unavailable rights prices. Corporate gifting meets [Givenly](https://givenly.com/) and [Caroo](https://www.caroo.com/products). Museum routing has [ICAPS 2013 prior art](https://ojs.aaai.org/index.php/ICAPS/article/view/13587), unavailable live occupancy, and an unverified taste-to-artwork mapping. These agent findings are supporting exclusions, not exhaustive root audits or proof no opportunity exists.

## Comparison and falsification

Codex provisional research priority: Second Home. Tuesday Fix remains the existing product and comparator, not an automatic fallback winner. Will It Land fails its central measurement claim; Cultural Catch-Up lacks a developed need case.

Pairwise: Second Home beats Tuesday Fix on a clearer non-text outcome and testable question-efficiency mechanism; Tuesday Fix wins existing progress and the user's expressed enthusiasm. Authentic café demand and measured Qloo benefit could reverse the research ordering. Second Home beats Will It Land because its acceptance is directly observed; validated reference comprehension could reopen that comparison. Tuesday Fix beats Will It Land on honest feasibility claims, despite a less striking inline transformation.

The four equal official criteria remain technological implementation, design, potential impact and quality of idea. These are prospective comparisons: no new implementation or measured user impact exists. Complexity and model agreement are not scores for originality.

Proposed 48-hour study, clock starts only with access and authorized consenting participants:

- Freeze 30 plausible cultural items; require at least 90% correct Qloo entity resolution in the chosen scope. Narrow scope transparently if coverage fails.
- Obtain complete yes/no matrices for several fixed group pools, with item conditions visible. Record whether people prefer browsing, swapping, donating or selling; do not assume a swap is desirable.
- Replay equal question budgets with Qloo plus graph-aware selection, equally informed LLM plus the same selection, metadata plus selection, random selection, and Qloo rank-only ordering. All use the same matcher, item pool, constraints and item descriptions. Also compare ordinary full-catalogue browsing, including effort/time.
- Proposed continuation gate: at least 25% fewer questions for the same accepted participant count versus the strongest automated baseline across multiple pools, plus useful real owner intent. Small-study thresholds guide continuation; they do not establish statistical efficacy. Require zero unsupported approvals or conflicting assignments.
- Downgrade to a narrower item domain if identity coverage is the only failure. Kill the sponsor claim if Qloo does not improve results. Kill this product direction if people prefer a simpler alternative or pools lack compatible items. No automatic crown transfer to a failed runner-up.

No API experiment, participant recruitment, transfer, implementation, external publication or purchase was performed in this round. Human usefulness and Qloo lift remain unresolved.

## Claude convergence and Codex final judgment

Rounds 16–17 successfully returned through the prescribed helper after normal network approval, both verified as `claude-opus-5-5`, topic `qloo-agentic-hackathon-selection`, persistent session `db1470d7-6254-4dd9-b750-a3325b3f5454`. Raw responses are in Git-ignored `.claude-opus-research/round-16-open-search.json` and `round-17-judgment.json`.

Claude accepted the affinity-versus-recognition correction, withdrew the web-recency argument, and ranked Second Home first with no qualified runner-up. Its useful addition was emphasis on the timed full-catalogue checklist. It suggested a five-minute cutoff; Codex does not adopt that arbitrary universal cutoff. Practical effort, abandonment and participant preference should determine whether saved questions matter. Claude also proposed 12/15 identity coverage; retain the previously specified stricter 90% scope gate rather than silently relaxing it. Subsets of the same group are correlated and do not constitute independent replications.

| Candidate | Codex technology/design/impact/idea | Claude technology/design/impact/idea |
|---|---|---|
| Second Home | 7 / 8 / 5 / 6 = 26 | 7 / 8 / 5 / 6 = 26 |
| Tuesday Fix | 6 / 8 / 6 / 4 = 24 | 6 / 8 / 6 / 4 = 24 |
| Will It Land, reduced to affinity | 5 / 7 / 4 / 4 = 20 | 5 / 7 / 5 / 5 = 22 |

All scores are subjective forecasts, not achieved performance or independent market evidence. Second Home's impact and idea scores are weak because stakes are limited and category prior art substantial. Tuesday Fix has unproved sponsor lift and direct overlap; its impact is plausible rather than demonstrated. The corrected reference tool cannot answer the motivating question, reducing its technical, impact and idea forecasts. Both models prefer its original presentation but reject its unsupported meaning.

Codex final call: **test Second Home before considering a pivot; do not claim a jhaasu winner yet.** The useful new mechanism is asking fewer consequential preference questions, followed by verifiable agreements. It is not defensible merely because it uses a solver. Further model debate cannot settle whether actual people want the available items or whether Qloo helps. The ongoing goal remains incomplete.

## Practical audit — next goal continuation

The preceding goal turn was progress: new mechanisms, verified corrections, a comparative decision and saved evidence. This continuation checked the surviving idea against a concrete existing workflow rather than opening another unconstrained model brainstorm.

**New primary evidence.** [Toronto BoardGamers' organizer instructions](https://www.torontoboardgamers.ca/no-ship-math-trade.html) explicitly say that reviewing offered items and deciding acceptable trades can take time. They require clarified condition/details before adding wants and freeze items during the want-list period. This supports an effort problem in organized board-game exchanges; it is not evidence of demand among small book-swapping groups. Do not revive gaming after the user's stated preference.

[TradeMaximizer's own documentation](https://github.com/chrisokasaki/TradeMaximizer) describes participant want lists, maximum-cardinality exchange cycles, preference priorities and duplicate protection. This supplies a concrete baseline implementation, beyond a vendor's AI-marketing claim. It permits longer cycles, whereas our initial two/three-person restriction could reduce matches. A shared handover may not justify that restriction: require an actual operational reason, and compare unrestricted cycles before counting extra solver complexity as value. Source inspected; no competitor code executed.

[BookSwap's own case study](https://www.bookswapapp.com/engineering) describes a basic listing/discovery/offer/chat loop, with recommendations deferred from its first version. This is the developer's account, not evidence that personalization cannot help. A [different Nairobi founder's firsthand account](https://www.reddit.com/r/bookishke/comments/1t1oo0u/i_built_a_book_swapping_app_for_nairobi_after/) describes interviews pointing primarily to lost/damaged loans and trust. Those self-reported interviews cannot be generalized to permanent swaps, but caution against solving a taste problem when the practical barrier is reliability.

**Question-count savings can conceal more work.** For a one-item-per-person group of n, full browsing involves at most n−1 candidate items per person. Let k be guided questions, t the average effort per item, and s the additional effort to enter cultural tastes. Ignoring other differences, guided flow saves (n−1−k)t−s. All quantities must be measured; this is arithmetic, not a behavioral model.

Illustrative assumptions only: n=15, k=5, s=60 seconds. At t=5 seconds, guidance costs 15 seconds more; at t=10 seconds, it saves only 30 seconds. These examples show why a 25% reduction in questions does not itself establish worthwhile benefit. We must not inflate the catalogue or invent a large group solely to make the method win.

**Revised decisive test:** retain accepted coverage and the sponsor ablations, but make total active participant time plus abandonment the primary effort measures. Include inventory entry, taste entry, item examination, question answering, corrections and proposal confirmation. Report elapsed waiting separately. Full browsing must not be forced to collect unnecessary taste data. Compare acceptable-item quality and withdrawals so fewer questions cannot win by accepting poor swaps. If there is no useful total-effort gain, do not promote on a question-count result.

This changes the next action: obtain the user's reaction to the concept and identify an authentic pool before building. Qloo-key status and concept-relatability questions are pending; no reply or access is assumed. No further Claude round is needed to resolve this empirical hinge. No implementation, recruitment or external action occurred.
