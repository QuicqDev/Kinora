# Browser-agent integration

Kinora exposes browser-native WebMCP tools. The browser assistant operates the same React state and planning endpoint as the visible interface. This is separate from the server's Qloo MCP integration: WebMCP connects a browser assistant to the page; Gemini plans against the reviewed catalogue; Qloo ranks the confirmed activity's candidates.

## Demo callout

“Your browser assistant can prepare the activity with WebMCP. The agent checks what fits, you confirm the plan, and Qloo finds a starting point from your child's tastes.”

In a compatible browser assistant, ask:

> Use Kinora's WebMCP tools to inspect Mexican starting songs under five minutes. Prepare a bridge using the synthetic pop example and the request “We want a song lasting at most 5 minutes to share together.” Wait for the favorites to resolve, then ask for a plan. Leave confirmation to me.

The visible result should be a five-minute music proposal with four reviewed options (before exclusions), plus **Use this plan and find choices**. Click that button to continue. Open the returned work, then ask the assistant to reopen the current bridge. Do not hardcode a returned artist in the presentation.

## Tools

| Tool | Purpose | Effects |
| --- | --- | --- |
| `heritage_inspect_collection` | Inspect public reviewed films or starting songs by collection, format and playback limit. | Read-only, no provider call. Returns public facts, durations and source links; not personalized results. |
| `heritage_prepare_bridge` | Set collection and a visible brief; use current favorites or the explicitly chosen pop/instrumental example. | Replaces the active draft/results; example artist names are resolved through the existing Qloo search. Does not plan or rank. |
| `heritage_plan_moment` | Plan the visible request with three confirmed favorites. Available when the live bridge dialog is open. | Calls the same Gemini planning endpoint, consumes the existing budget and displays a proposal or clarification. Cancellation propagates to fetch. |
| `heritage_resume_bridge` | Reopen the active bridge from this visit. | Restores existing state without provider calls. |

The tools cannot write album notes, mark an encounter as tried, export private notes or invoke ranking confirmation. Runtime schemas reject extra fields and invalid input. The planner keeps the normal server budgets, deadlines and catalogue constraints. Starting a new request explicitly replaces the previous draft. Closing the dialog unregisters its planner tool; callbacks read current React state so stale drafts cannot be executed.

## Browser support

The integration feature-detects `document.modelContext.registerTool` and uses abort-signal registration cleanup. It also supports earlier preview browsers exposing `navigator.modelContext` with explicit `unregisterTool`. No third-party polyfill or remote script is loaded. The regular app remains usable when the API is absent or registration fails. The footer reports connected status only after registration succeeds.

WebMCP remains an experimental browser capability; confirm the actual presentation browser supports it. If not, demonstrate the normal controls and describe WebMCP as implemented but unavailable in that browser. Do not show a connected badge or claim an actual tool call without verifying one.

Implementation references checked October 13, 2026: [Chrome imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api) and [WebMCP specification](https://webmachinelearning.github.io/webmcp/).

## Verified locally on October 13, 2026

The Codex in-app browser discovered the native tools. Actual WebMCP calls inspected the Mexican five-minute artist pool (four exact-edition recordings), prepared the synthetic pop example and executed the live Gemini planner. The tool returned a ready artist plan with a five-minute limit and four eligible options; the same plan and confirmation action appeared in the page. Confirmation produced a Qloo result for Silvana Estrada with the 3:22 starting song Te Guardo. Opening the work removed the planner tool; the resume tool restored the result. These were real browser-mediated invocations, not direct test calls to JavaScript callbacks. See the [demo script](DEMO.md) for the presentation sequence.
