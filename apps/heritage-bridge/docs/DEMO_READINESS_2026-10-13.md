# Local demo verification — October 13, 2026

## Implemented

- Active bridge state lives above the work view. Returning restores the original brief, plan, checks, favorites and result without another provider request. It lasts for the current visit, not across reloads. A new example or heritage intentionally starts a new draft.
- The homepage's five-minute listening example prepares a brief and signed example favorites, then runs the real planner after an explicit request. Catalogue-backed film examples use 150 minutes for Hindi, 120 for Tamil and 90 for Mexican.
- Twelve exact song recordings have public Apple catalogue duration metadata. Comparisons use milliseconds; display rounds up to the next second. Unknown durations never meet a time limit, and playback is distinguished from time spent accessing a service or talking.
- WebMCP exposes four actions across the page and open bridge dialog: inspect, prepare, plan and resume. The visible confirmation remains between planning and ranking. No private album-note tools are exposed. Browser support is detected, with normal controls retained when unsupported.
- `npm run demo:check` reports catalogue coverage, build presence and remaining local daily budget without making provider calls. The [demo script](DEMO.md) includes a primary walkthrough, WebMCP callout and provider-failure fallback.

## Verification

Catalogue validation passed for 60 reviewed works. Type checking, production build and all **59 tests** passed. New regression checks cover exact duration boundaries, missing/mismatched recordings, feasible collection defaults, constrained Qloo artist pools, draft preservation/reset, WebMCP input validation and registration cleanup. Existing HTTP tests were run with local network permission.

In the actual in-app browser:

1. The Hindi five-minute example resolved the three synthetic pop favorites, produced a live Gemini artist plan and returned Asha Bhosle via Qloo, with the exact Piya Tu Ab To Aaja recording shown as 4:01. It was the only duration-eligible Hindi recording, which the proposal disclosed.
2. Opening that work and returning reproduced the same rendered result, original request, checks and evidence timestamp. Editing the bridge retained its original brief and favorites.
3. The browser discovered and invoked WebMCP's collection inspector and request preparation tools. Inspection returned four eligible Mexican recordings. The planner tool then made the live Gemini request and returned an artist plan capped at five minutes, with four reviewed options. The same proposal appeared in the page. The WebMCP planning call completed in approximately 6.6 seconds in this rehearsal; this is not an end-to-end performance claim.
4. Confirming the Mexican plan returned Silvana Estrada through Qloo, with Te Guardo's exact recording shown as 3:22. Opening the work removed the dialog's planner tool from browser discovery. Calling the resume tool restored the result.

Additional live planner checks through the local HTTP endpoint: the Hindi 90-minute film request returned `needs_input` after inspecting an empty eligible pool (5.54 seconds); the Tamil five-minute song request returned a ready plan with two eligible recordings (4.38 seconds). No limit was silently relaxed. These timings are individual rehearsal measurements, not guarantees. The demo browser reported no console errors.

Screenshots are kept privately in `.local/webmcp-plan-demo.jpg` and `.local/demo-live-result.jpg`. They contain synthetic demo preferences and no album notes. The previous active browser tab was preserved; no album data was cleared.

## Duration provenance

`shared/song-durations.json` contains track ID, title, credited artists, edition, exact milliseconds, Apple lookup URL, linked song destination and review date. Each fact was checked against the exact Apple lookup ID on October 13, 2026. No audio, artwork or lyrics were copied. Five recordings are Hindi, three Tamil and four Mexican; respectively one, two and four fit five minutes. The two existing Apple IDs that returned no record (Café Tacvba 1704381492 and S. P. Balasubrahmanyam 6792098437) remain without a duration.

The source lookup endpoint is `https://itunes.apple.com/lookup?country=us&id=TRACK_ID`; exact URLs are stored per recording. The Zoé entry now correctly names the linked Lucha Rock: Zoé edition rather than claiming that it is the Música de Fondo live edition.

## Remaining limits

This establishes local demo readiness, not public deployment or submission completion. Rehearse on the actual presentation browser and host; WebMCP availability, provider latency and quotas can vary. There is no measured evidence yet of family enjoyment or improvement over baselines. Content suitability, language difficulty and regional access are still not verified. Qloo ranks artists; starting songs remain editorial choices.
