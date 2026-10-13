# Local verification

Latest October 7, 2026: read COMPLETION_CHECKPOINT.md for 32 passing tests, three real live HTTP flows and current browser checks. Download target filename and JSON format were checked in the UI; the in-app browser did not emit a download-completion event. Earlier checks follow.

October 4, 2026. No real Qloo/Gemini requests or paid calls were used.

## Automated


pm run check` passed: 19 tests, TypeScript checking and Vite production build. Tests cover all three collection fixtures, exclusions and independent feedback, cache boundaries, signed inputs, identity ambiguity, malformed ranking responses, unavailable/provider failures, request budgets, constrained Gemini tool orchestration and HTTP input/origin/secret boundaries. Provider responses in tests are mocks; this does not establish real API compatibility or usefulness.

## Browser

Latest scrapbook pass: verified independent Hindi/Tamil note storage, note persistence after reload, saved-note edits appearing in the album, Tamil-only album filtering and the Mexican empty-album state. Temporary QA notes were restored to their original empty values. Inspected desktop 1440×1080 and mobile 390×844; checked 320px layout and changed narrow collection controls to rows to prevent script labels overflowing their buttons. Screenshots prefixed `scrapbook-` are the newest checkpoint. All 19 automated tests and the production build also passed after the new album component was added.

- Original implementation exercised Hindi, Tamil and Mexican flows; collection changes preserved favorites and changed returned works.
- Saved Iqbal and Meiyazhagan, reloaded, and verified both in Our collection. Interest and difficulty remained independent.
- Revised journal layout inspected at desktop and 390×844 mobile. Mobile document width equaled the layout viewport (375px after scrollbar), without horizontal overflow.
- Opened favorite search, selected Paddington 2, confirmed it, reopened search, pressed Escape and verified focus returned to the second-favorite button.
- Re-ran sample discovery and inspected revised results and mobile detail controls. Official destinations and source links remain separate from recommendation evidence.
- All screenshots with `journal-` prefix depict the new direction; earlier screenshots record the initial checkpoint.

## Limits

No complete assistive-technology audit or user study. No real credential test, Qloo coverage measurement, model-quality comparison, regional availability check or age-suitability review. Upstream dependency audit findings and launch gates remain in BUILD_STATUS.md.
