# Live API readiness

October 7, 2026. Both keys work; root .env now selects live mode.

56/60 catalogue identities matched. All three full HTTP discovery flows returned two films and one artist; cached repeats made zero provider calls. Read [COMPLETION_CHECKPOINT.md](COMPLETION_CHECKPOINT.md) for scope, private evidence, earlier failures and release gates.

Event endpoint: https://hackathon.api.qloo.com. Keys stay server-side. Official MCP handles describe/search; already verified ranking IDs use one documented Insights query. Measured account model gemini-3.8-flash is pinned locally.

Intentional live commands: node scripts/run.mjs audit --live --limit=20 --collection=hindi; node scripts/run.mjs smoke --live. They use provider quota and write only ignored private reports. Persistent local daily ceiling 150; UTC midnight reset.

Actual family usefulness and public release remain pending.
