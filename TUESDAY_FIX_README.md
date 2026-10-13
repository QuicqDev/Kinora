Historical prototype documentation. Run it with `npm run tuesday:start`; Heritage Bridge is the current submission project.

# Tuesday Fix

**Your café is empty on Tuesdays. What should you run?** A local prototype for the [Qloo Agentic Hackathon](https://qloo.devpost.com/).

**Idea is king. Presentation is queen. Easy-to-understand ideas win.**

Start with [RESEARCH_HANDOFF.md](RESEARCH_HANDOFF.md). Standing preferences live in [AGENTS.md](AGENTS.md).

Status, October 3, 2026: user selected Tuesday Fix and authorized implementation. Café brief, sample inspirations, constraint-aware proposals, visible staffing/budget repair and invitation downloads are implemented locally. Qloo and LLM integration are pending. User needs Qloo access and reports LLM access; provider and API availability are being clarified. Nothing has been published.

## Run

Requires Node >=22.14 for this sample, with no dependencies or API keys. The upcoming official Qloo harness needs >=22.19.

```sh
npm start
```

Open http://127.0.0.1:4173. The server listens only on this computer. `npm run dev` enables server watching; reload the browser after frontend edits.

```sh
npm test
```

Tests run in one process because the current Windows sandbox restricts subprocess spawning. Coverage includes staffing repair, budget/capacity boundaries, malformed input, truthful drafts and the HTTP/static-file boundary.

## Try it

Choose **Make a plan**, then **I only have one staff member**. The sample plan changes from a hosted event for 20 to a self-guided gathering for 12. Set staff to zero or budget below ₹580 and regenerate to see a blocked proposal. Select another inspiration or download the invitation draft. The redesigned interface uses an event poster and a cost sheet; narrow screens stack both.

## Current limits

Themes are editorial fixtures, not live Qloo recommendations. Costs are illustrative INR assumptions, not quotes; wages, tax and refreshments are excluded. Guest limits are capacity limits, not attendance predictions. Café names do not yet affect cultural relevance. The sample does not load `.env`; `.env.example` is a future configuration template.

Read [BUILD_REQUIREMENTS.md](BUILD_REQUIREMENTS.md) for resources and remaining milestones. A live agent, meaningful Qloo use, public hosting and an open-source license are still needed for the final submission. No purchases, registration, outreach or publishing occurred. Research has not established global uniqueness or measured Qloo's advantage.
