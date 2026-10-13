# Bridge experience update — October 10, 2026

Implemented at the user's request following the judge audit. The selected scrapbook design, three collections and bounded Qloo ranking are retained.

## Changes

- Completed discovery replaces the input form. The result heading receives keyboard focus and the dialog returns to its top; input cards no longer hide the result below the fold.
- A compact favorites → chosen heritage summary stays beside the result. Example identities retain their example provenance when editing, closing and reopening discovery.
- Two visible homepage listener examples confirm the three artist identities and automatically start discovery for the currently selected heritage. The manual three-favorite path remains available. Fixture mode instead has a clearly labelled fixed sample bridge.
- Name confirmation and ranking show separate progress, cancellation and retry guidance. Exact artist matches are required; ambiguous/failed lookup does not become a guessed match or a sample replacement. StrictMode's discarded mount effect does not initiate the example request.
- Cards lead to the official watch/listen destination, conversation prompt and private album through a clearer sharing action. Normal results use concise introductory text; technical explanation and provenance remain in the evidence disclosure. Partial/error messages remain visible.
- Updated the demo script to lead with the bridge and the actual non-heritage examples, not browsing or heritage-native favorites. No invented causal attribution or enjoyment claims were added.

## Verification

- Catalogue validation: 60 entries pass. TypeScript and production build pass.
- Full suite: 43 tests pass, including three new tests for preserving signed example identities, rejecting ambiguous/wrong-domain/unavailable matches, and aborting without subsequent searches or partial favorites.
- As in the earlier audit, restricted-loopback execution caused four HTTP-test failures; the approved network-enabled run passed. No application workaround was introduced.
- Browser: fixture shortcut and result reveal; live homepage examples; result heading focus; first card/action visible without scrolling at desktop 1265 × 712 and mobile 390 × 844; mobile homepage examples visible; edit preserves favorites and returns focus to input; close restores trigger focus; reopen/resubmit retains example labeling; result opens the correct work page with destination, conversation and memory path.
- Both live Hindi examples completed through the actual browser flow. Pop profile returned The Lunchbox, Dilwale Dulhania Le Jayenge and Arijit Singh. Cinematic/calm returned Dangal, Taare Zameen Par and A. R. Rahman. A prompt repeat completed using the application's existing result path. No latency, cost, uplift or family-usefulness benchmark is asserted.
- Live verification used the existing configured limits, without increasing budgets. Source/backend ranking behavior was unchanged. No external deployment, public publishing or submission.

Private visual evidence in ignored `.local/`: `bridge-results-2026-10-10.jpg` and `bridge-mobile-2026-10-10.jpg`. These show synthetic preferences, not family history.

## Remaining work

Audience validation, equal-input usefulness comparison, suitability/difficulty evidence and hosted-release validation remain separate gates. This change improves presentation and task flow; it does not establish family demand, Qloo superiority or autonomous planning capability.
