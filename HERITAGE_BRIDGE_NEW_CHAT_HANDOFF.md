# Heritage Bridge — new build chat brief

Implementation authorized October 4, 2026. The user selected Google Gemini for the LLM and will add Qloo and Gemini API keys to `.env` when available. Start building now with explicit fixture mode; do not wait for keys or ask the provider question again. Configure the backend to read the repository-root `.env` (F:/github/qloo-agentic-hackathon/.env), document exact variables in `.env.example`, and preserve any existing values without printing secrets. Real API validation remains pending until credentials are present. The existing ignore rules cover `.env` files.

## Prompt for the new chat

**Latest authorized steering, October 4:** build toward the curated-collection platform described in the new section 1 of HERITAGE_BRIDGE_BUILD_PLAN.md. Browse first; optional Qloo personalization inside collections. Implement Explore, collection detail, work detail and direct saving without a favorites prerequisite. Reuse the chosen personal family scrapbook direction, album and notes. Three usable curated launch collections; source-backed content and editorial ordering must be distinguished from Qloo ranking and fixture relations. Add a bounded Qloo-powered next discovery from an explicitly liked work, potentially leading into another collection. No keys are required to finish the browsing path. Preserve existing work and continue in the already-created Build Heritage Bridge chat; do not open a duplicate chat. Earlier favorites-first instructions below are superseded.

Build Heritage Bridge in this repository, following HERITAGE_BRIDGE_BUILD_PLAN.md and the user's final plan corrections. The user selected this idea after rejecting earlier directions. Product promise: help a parent introduce their child to a cultural collection through things the child already loves. Qloo's cultural-affinity evidence must drive the central choice. Idea is king; presentation is queen. The four equally weighted judging criteria are Qloo implementation, coherent design, demonstrated potential impact and creative use of Qloo.

Start by reading AGENTS.md, HERITAGE_BRIDGE_BUILD_PLAN.md, QLOO_CORE_SHORTLIST.md and the newest entries in RESEARCH_HANDOFF.md. Earlier champions and blocked barter validation are superseded. Do not restart ideation, revive Second Home or continue building Tuesday Fix.

Implement in apps/heritage-bridge/ as a separate app with its own package. Preserve the root Tuesday Fix prototype, research, uncommitted files and other people's changes. Inspect current state before installing or editing. A separate Git worktree was not requested; the research is currently uncommitted, so use the same saved project. Do not commit, push, publish, register accounts or incur new charges without applicable authorization.

Confirmed requirement: multiple collections from day one, each working end to end. Proposed launch collections are Hindi cinema/music, Tamil cinema/music and Mexican cinema/music, subject to source and API coverage checks. Start with about 12 films and 8 artists each (60 entries total), not a single Hindi catalogue. Provide collection selection and switching with favorites preserved, collection-scoped queries/cache and stale-response protection. Do not silently reduce this to one collection. Other planning defaults: English interface; parent-led family/teen use; three favorites across movie, book and music inputs; three suggested entry points when supported. No identity or ancestry inference. Artwork, media links and content facts need appropriate rights and verified sources. An artist-level affinity does not predict interest in a particular song.

Proposed stack: React/TypeScript/Vite, Node/TypeScript backend, official Qloo harness through MCP, Google Gemini tool-calling integration behind a provider adapter. Reverify runtime, current official SDK documentation and package compatibility; current kit needs Node >=22.19. Qloo and Gemini credentials must remain server-side. Keys are pending and the user will place them in the repository-root `.env`. Continue design and fixture-mode engineering now, visibly separating fixtures from live evidence. Never expose secret values in logs, chat or browser code.

First milestone: a bounded Qloo schema/coverage spike across all three collections alongside one carefully composed desktop/mobile discovery screen with collection selection. The existing site's design was rejected as generic; use the plan's editorial family-album direction, restrained palette, strong hierarchy and a first-use interaction rather than a dashboard. Show the actual screen for review before propagating the design everywhere.

Then complete one live flow: confirmed favorites → cultural pool → Qloo ranking → validated result cards → official watch/listen destination. Add separate interest/difficulty feedback and local saved choices. Handle ambiguity, partial/empty/degraded results, retries, quota limits and missing metadata honestly. Never invent IDs, affinities, attribution, personal enjoyment probabilities or availability. The LLM explains sourced results; it does not silently replace failed Qloo evidence.

Validate the core invariants and actual browser experience. Prepare an equal-input baseline comparison to substantiate Qloo's contribution. Do not recruit families or present synthetic personas as evidence. Follow build milestones in the plan and keep the user updated with concrete outcomes and uncertainties. External hosting and the submission package are later reviewed actions; target deadline October 31, 2026, 09:15 IST.

## Carry into the chat at creation time

- Confirmed multiple-collections requirement and any subsequent choices of collection names, audience or visual direction.
- Any confirmed Qloo/LLM readiness, without including secret values.
- Any approved spending or publishing constraints.
- The exact current plan path: F:/github/qloo-agentic-hackathon/HERITAGE_BRIDGE_BUILD_PLAN.md.

## October 10, 2026 — situation-aware activity planner

User chose practical activity selection over natural-language favorite resolution. Implemented an optional live brief → Gemini catalogue inspection/proposal or clarification → visible user confirmation → format/runtime-filtered Qloo ranking. The agent can choose music from a cooking context, restrict a film night by reviewed runtime, or ask for revision when no verified fit/unsupported requirements exist. Album notes remain private; the separate brief goes to Gemini and is not persisted by our server. Existing no-brief and homepage-example paths remain.

See `apps/heritage-bridge/docs/ACTIVITY_PLANNING.md` for exact limits and live evidence. 50 tests, TypeScript, build and catalogue validation pass. Natural-language interpretation remains probabilistic and is shown for confirmation; confirmed constraints are enforced independently of the model. No budget increase, external deployment or family-usefulness claim.
