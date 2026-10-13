# Heritage Bridge — design rationale

## Latest direction — family scrapbook

The user rejected the cultural-journal pass as lacking taste and explicitly selected **Personal family scrapbook — tactile, intimate, built around memories**. The app now uses an original family-keepsake illustration, a notebook-like form, a visible parent-memory note and a saved album with collection filters. Caveat handwriting is limited to annotations and notes; normal controls remain readable. This direction is selected, but the finished execution has not been approved. See `PRODUCT_GAPS.md` for outstanding product work and `ARTWORK.md` for the generated asset, full prompt and provenance. The journal discussion below is historical.

Updated October 4, 2026 following the user's explicit request to avoid a generic AI-generated appearance and research good design principles online. This records a design decision, not a claim of user approval or measured usability.

## Evidence and application

| Source | Principle | Application here |
|---|---|---|
| [Nielsen Norman Group: Good Visual Design, Explained](https://www.nngroup.com/articles/good-visual-design/) | Consistent alignment, hierarchy, intentional color and useful imagery | Shared page edges, strong heading/body/caption roles, ink and oxblood on paper, collection titles in place of decorative postcards |
| [Nielsen Norman Group: Proximity Principle](https://www.nngroup.com/articles/gestalt-proximity/) | Spacing conveys relationships | Each label sits beside its input; larger gaps divide favorites from cultural collection; restrained rules separate groups |
| [GOV.UK: Layout](https://design-system.service.gov.uk/styles/layout/) | Design for small screens and constrain reading width | Single-column mobile form, approximately 70-character explanation measure, secondary collection preview omitted on narrow screens |
| [GOV.UK: Type scale](https://design-system.service.gov.uk/styles/type-scale/) | Use a consistent type system and readable rhythm | 14–17px body/control text, 12px metadata, serif section/display hierarchy, 1.5–1.65 body leading |
| [W3C: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Normal text needs at least 4.5:1 contrast; large text 3:1 | Darker supporting text, strong button contrast and visible keyboard focus; no claim of a complete accessibility audit |

These sources support the principles, not the exact aesthetic. The cultural-journal direction, typeface pair and oxblood accent are project-specific design judgments.

## Chosen direction

A small cultural journal with an immediately usable discovery form. Fraunces supplies an editorial voice; DM Sans handles controls and reading. The logo remains a quiet bridge mark. Thin rules, aligned text and generous but purposeful spacing establish structure.

The first sentence explains the product: use a child's favorites to find films and music from a parent-selected culture. The desktop collection preview names actual reviewed works and labels them as a look inside the collection, not personalized results. The form uses direct labels: Their favorites, Your culture, Find films & music.

Removed decorative tilted postcards, generic orbital motifs, sparkle decoration, repeated inspirational slogans, pastel collection tiles, large duplicate title covers and the promotional closing section. Results are compact editorial entries with a title, language/year, sourced description, exploration action and save control.

Small screens prioritize the form. The secondary collection index is omitted, inputs are at least 16px, main touch controls are at least 44px, dialogs support Escape and focus return, and reduced motion is respected. Sample mode remains plainly labeled and cannot imply live personalization.

## Continuing constraints

- Add an image only when it helps identify or explain a specific work and its usage rights are recorded. Decorative stock images and invented movie posters would weaken this direction.
- Use color to communicate selection/action; do not add unrelated accent colors per section.
- Keep core copy concrete. Avoid using “connection”, “journey” or “discovery” as substitutes for describing the action.
- Review desktop, narrow mobile, long titles, empty/error states and keyboard use after meaningful interface changes.
- The film/song facts are not an age-suitability assessment. Live Qloo coverage and recommendation value remain separate validation gates.
