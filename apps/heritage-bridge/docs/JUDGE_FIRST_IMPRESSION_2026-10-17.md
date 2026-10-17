# First-impression review and fixes

October 17, 2026. Review of the public static preview from a hackathon judge's perspective, followed by local desktop and phone-sized browser verification. This is a product walkthrough, not a study with actual judges.

## What was confusing

- The poetic “Their favorites. Your heritage.” headline required reading the smaller paragraph to identify the parent/child use case.
- “Try the interactive example,” “Try a five-minute listening plan” and “See a sample bridge” appeared to be competing ways to start. The compact viewport hid the latter two without explaining the difference.
- “Which heritage would you like to share?” suggested a personal recommendation flow before explaining the sample listener.
- The top disclosure consumed a separate row while the hero had a large empty gap. Qloo and Gemini were named but their roles were behind an expandable explanation.
- The first dialog asked “What do they love?” despite already filling in three favorites. An editable custom brief and repeated example actions distracted from the next step.
- On a phone, large favorite rows pushed “Show sample plan” below “Keep browsing.” Planning also scrolled an ancestor and could move the modal partly offscreen.

## Changes

The opening promise is now **“Connect your child with your culture.”** The next sentence explains the concrete outcome: find a film or song from the parent's heritage through what the child already loves, then keep the memory together.

The homepage has one primary **Start the guided demo** action. Named sample favorites and the five-minute listening moment explain what to expect before clicking. The selector explicitly chooses a heritage for the sample. A secondary link clearly offers browsing 90 films and songs across nine collections.

The short demo label still says fixed sample data and no live AI calls. A visible sentence explains the full app's actual roles: Gemini checks the activity plan; Qloo Insights API v2 ranks choices from favorites. Disclosure details remain available. The scrapbook artwork, colors and typography remain in place.

The first dialog tells the judge that favorites are prefilled, shows the shared moment and makes **Show sample plan** the obvious next action. Optional activity editing and alternate sample listeners are behind named disclosures. Phone layouts put the primary action first, while favorite controls retain their touch targets. Plan copy exposes the eligible catalogue count and keeps exact duration sources and checks available. Custom requests still receive an explicit unsupported-input message and can recover to a supported sample.

Plan scrolling is confined to the dialog, preserving its position in the viewport.

## Verification

- Type checking, static build and publish audit passed: 140 allowlisted files, no network primitives or credential signatures.
- Browser reviewed at the default desktop viewport and 390 × 844. On both, the homepage promise, primary action and full-app provider roles are visible without scrolling.
- The first phone dialog now shows **Show sample plan** before the secondary action, without scrolling. The plan remains inside the dialog instead of shifting it offscreen.
- Verified the optional activity disclosure, custom-request rejection, recovery to the five-minute sample and local catalogue feasibility count.
- The static transport, catalogue, live-provider boundaries, video and thumbnail were not replaced. The hosted preview remains sample-only.

Public preview: https://quicqdev.github.io/Kinora/. The Pages workflow runs the existing 63-test suite and static-artifact audit before publishing updates.

## Published verification

[Pages run 39037769413](https://github.com/QuicqDev/Kinora/actions/runs/39037769413) passed the catalogue check, build, 63 tests and artifact audit, then deployed commit `33d3ac8`. Public HTML matched the audited local build, and the referenced script and stylesheet returned HTTP 200. The new opening, primary action, sample plan and confirmation-to-results flow were verified in the public browser with no console warnings or errors.

A browser that still held the prior deployment's entry document needed a reload after publication. The refreshed document loaded the current assets successfully. Existing browser caches may require refreshing to see the update.
