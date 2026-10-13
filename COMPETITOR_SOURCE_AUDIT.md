# Mechanism audit — historical competitors and current products

October 3, 2026. Read-only research prompted by the user's objection that Tuesday Fix can be reproduced in chat, plus an explicitly user-requested handoff from another chat. Current prototype preserved; no third-party repository code executed, no credentials used against it, no outreach or publishing.

## Evidence boundaries

The [2026 gallery](https://qloo.devpost.com/project-gallery) remains unpublished. These historical projects are comparison evidence, not confirmed 2026 entrants. Source inspection establishes code paths, not successful deployed behavior or user outcomes. Product documentation establishes advertised capabilities, not independently tested efficacy. README claims, fallback behavior and roadmap are separated below.

## Tiles

Audited source head: `a5b4d68cd80fcdf3394c8005e61f3350d595fc41` (July 19, 2025). Its [Devpost page](https://devpost.com/software/tiles-g6qnro) associates it with the historical Qloo LLM Hackathon and dates project creation July 20, 2025. This is more reliable for event association than the inconsistent README year label.

| Step | Source-level evidence | Limit |
|---|---|---|
| Input/state | [main.py L173](https://github.com/victorbash400/Tiles/blob/a5b4d68cd80fcdf3394c8005e61f3350d595fc41/mockapi/main.py#L173) processes chat messages, saves assistant responses and updates context. | No live session executed. |
| Decision gate | [event_service.py L180](https://github.com/victorbash400/Tiles/blob/a5b4d68cd80fcdf3394c8005e61f3350d595fc41/mockapi/event_service.py#L180) checks required event information, model readiness and user confirmation before generation. | This path reuses existing generated content rather than automatically rerunning the plan. |
| Qloo venue call | [qloo_venue_service.py L90](https://github.com/victorbash400/Tiles/blob/a5b4d68cd80fcdf3394c8005e61f3350d595fc41/mockapi/qloo_venue_service.py#L90) calls `/search`, deduplicates records and extracts metadata. Later code asks an LLM to filter suitability; errors can return initial records. | No independently verified slot availability, capacity or itemised-cost feasibility in this inspected path. |
| Music provenance | [qloo_music_service.py L95](https://github.com/victorbash400/Tiles/blob/a5b4d68cd80fcdf3394c8005e61f3350d595fc41/mockapi/qloo_music_service.py#L95) attempts a cultural-recommendations endpoint, falls back to an LLM on non-success, and assigns a Qloo-curated flag downstream regardless. | Endpoint validity and successful runtime calls not established. Flag alone cannot prove Qloo provenance. |
| Parameter handling | [ai_services.py L314](https://github.com/victorbash400/Tiles/blob/a5b4d68cd80fcdf3394c8005e61f3350d595fc41/mockapi/ai_services.py#L314) passes count in the fourth argument, where the receiving venue-service signature expects guest count. | Narrow static defect; fixing it is not an original product idea. |

The Devpost author presents budgets and direct vendor integration as future work. Chat, cultural suggestions, imagery and plan documents already overlap our basic proposition. The folder name `mockapi` does not establish that every API is mocked.

## Alloy

Audited head: `879bed171442974e144a6dc89e256c0f85aaff83` (July 30, 2025).

The [agent source](https://github.com/MR-GREEN1337/alloy/blob/879bed171442974e144a6dc89e256c0f85aaff83/backend/src/services/react_agent.py#L90) resolves entities and calls Qloo insights, converting recommendations to sets. Later paths generate brand proxies from web/model research, calculate intersections/unions and use heuristics to label overlap and expansion. Explicit model-estimated fallbacks exist. The [bounded loop at L494](https://github.com/MR-GREEN1337/alloy/blob/879bed171442974e144a6dc89e256c0f85aaff83/backend/src/services/react_agent.py#L494) runs up to 12 turns, accumulating observations and sources.

[Report code](https://github.com/MR-GREEN1337/alloy/blob/879bed171442974e144a6dc89e256c0f85aaff83/backend/src/api/v1/reports.py#L83) combines overlap/expansion at 60/40 and persists draft, pending, completed or failed states. This is meaningful orchestration and product engineering. Those weights and set operations do not establish acquisition-outcome prediction. Final UI fallback disclosure was not inspected. We did not run a report.

## Fyndly and other handoff leads

[Fyndly's cached GitHub page](https://github.com/sanjail3/fyndly) describes cross-domain recommendations, people matching and communities. Linked app/lib/prisma pages failed to fetch; direct public GitHub repository and tree requests returned 404 in this audit. Consequently implementation depth remains unverified; do not infer that the code is fake, deleted or nonfunctional. Claimed accuracy, usage and performance remain creator assertions.

Cultural Concierge and Appmuseme remain handoff leads, not newly source-audited projects. Earlier [PREVIOUS_WINNERS.md](PREVIOUS_WINNERS.md) records GeoTaste and other verified historical awards and limitations. No videos were watched in this audit.

## External products defeat simple novelty claims

| Mechanism | Primary evidence | Implication |
|---|---|---|
| Use quiet café space for events | [Peerspace](https://hosts.peerspace.com/for-events) | Off-peak venue monetisation already marketed. |
| Match people and manage a restaurant gathering | [Timeleft matching help](https://help.timeleft.com/hc/en-150/articles/28530361837212-How-Does-Timeleft-Match-Me-With-a-Group), [dinner flow](https://timeleft.com/dinners-with-strangers/) | Group formation and changing available participants are not new mechanisms. No vendor outcome percentages accepted here. |
| Allocate preferences across constrained sessions | [Allocio](https://allocio.co.uk/about.php) | Explicit preferences, capacities and conflict-aware scheduling already advertised. |
| Conditional event formation | [Catalyst, CSCW 2014](https://hci.stanford.edu/publications/2014/Catalyst/catalyst_cscw.pdf) | Participant/role thresholds and deferred commitment predate this project. Authors qualify their deployment as not a controlled field experiment; motivation still matters. |
| Reference soundtrack replacement | [Artlist Song Match](https://artlist.io/blog/song-match-feature/) | Reference-to-catalogue matching already exists. |
| Music agent and adaptation | [Soundstripe Supe](https://www.soundstripe.com/knowledge/how-do-i-use-supe-to-find-music), [Epidemic MCP](https://developers.epidemicsound.com/docs/mcp/) | Brief-aware iteration and duration-oriented tooling already documented. |

## Decision consequence

No inspected gap certifies global originality or user demand. Verified constraints, traceable source/fallback status, state transitions and minimal-change repair would improve engineering integrity over some audited paths; none independently proves a creative use of Qloo. The next gate is a decision-level comparison isolating Qloo's cultural contribution, described in MECHANISM_PROOF_PLAN.md.
