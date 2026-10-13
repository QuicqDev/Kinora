# Demo script

One sentence: Kinora helps a parent find films and music from their heritage, starting with things their child already loves, then keeps the shared memories in a private family album.

First ten seconds: show the homepage and say, “Kinora turns what your child already loves into a film or song from your heritage that you can share together.” Lead with **Try a five-minute listening plan**, so the judge sees a practical agent decision as well as Qloo ranking.

## Primary rehearsal: about 90 seconds, plus provider latency

1. Open `/explore`, select Mexican heritage and click **Try a five-minute listening plan**. It confirms Taylor Swift, Billie Eilish and Olivia Rodrigo and fills an editable five-minute song request. These are synthetic example tastes, not a real child's history. This button prepares the request; it does not bypass the planner. Mexican has four eligible recordings, allowing a meaningful ranking comparison; the Hindi default also works, but has only one eligible recording.
2. Click **Plan our moment**. Say, “The agent checks which format and duration our reviewed collection can support.” Show the proposed plan and its catalogue checks. Hindi currently has one verified starting song under five minutes; Tamil has two and Mexican has four. A small eligible pool is disclosed honestly.
3. Click **Use this plan and find choices**. Say, “Only after I confirm does Qloo rank eligible artists using these favorites.” Read the actual returned result. Artist affinity and the editorial starting song are separate; do not claim track-level taste prediction.
4. Open **Share this song**. Show the exact recording's duration and source, the official listening link and the question to share. The five minutes cover playback; access, ads and conversation take extra time. Playback is voluntary.
5. Click **Back to my bridge**. The same result, favorites, request and agent checks are restored without re-ranking. Explain that the active bridge lasts for this visit; a page reload clears it. Album records persist separately.
6. For the album portion, save **Want to try**, then open **Our album**. Only mark **Tried together** after a real encounter. If demonstrating a note, visibly label it “Demo note”; never invent family evidence.

Optional judge question: “What if we only have 90 minutes for a Hindi film?” Edit the request to that exact constraint and plan again. The catalogue has no verified fit, so the agent should ask for a revision instead of silently relaxing the limit. Then use the catalogue-backed film example (Hindi 150 minutes, Tamil 120, Mexican 90). Time availability does not establish age suitability or regional access.

## Preflight and fallback

For the WebMCP callout, use the [browser-assistant demo prompt](WEBMCP.md). It prepares and plans through real page tools, leaving the usual confirmation button visible. The footer and activity form show connected status only in a compatible browser. Lead with the family benefit; WebMCP explains how a browser assistant can help operate the experience.

- Run `npm run check`, then `npm start` from this directory after building. Use the configured live mode and existing budget; do not change budget ceilings for a demo.
- Confirm `/api/status` reports live mode. Run `npm run demo:check` in the same configured environment to check local budget headroom and catalogue coverage without spending provider calls. It does not verify upstream availability or quotas; do one rehearsal on the actual presentation host. Keep keys and private album data out of screenshots.
- Start from `/explore` for a fresh bridge. Use an empty demo browser profile if the album contains personal data; do not clear the user's album to prepare a demo.
- If the provider fails, use **Keep browsing** and show the reviewed collection, source links and album. Say personalization is unavailable. Only show a fixed sample after explicitly starting fixture mode, and call it a sample.
- Recent real results may be reused, with that fact disclosed in the UI. Do not call a cached result a fresh provider response.

## Alternate discovery walkthrough

1. Lead with one of the visible homepage examples: Taylor Swift / Billie Eilish / Olivia Rodrigo, or Hans Zimmer / Ludovico Einaudi / Enya. These are synthetic preferences, not a real child's history. One click confirms exact artist identities using the existing search path and starts discovery for the selected heritage.
2. Show the completed result: the form is replaced by the discoveries, with the favorites and selected heritage visible together. Keyboard focus moves to the heading. Read the real returned choices; never promise a particular title in advance. Edit favorites returns to the preserved input set.
3. Explain once: Qloo ranked films and artists in separate reviewed pools. The listening entry is curated; artist affinity is not a prediction for a song. The “Why these appeared” panel contains provenance and limitations. A second example can demonstrate different inputs; different outputs alone do not prove better choices.
4. Demonstrate the agent's practical decision: choose Mexican heritage, edit the bridge and enter “We are cooking together. Suggest a way to share something from our heritage while we cook.” Show the proposed format and catalogue checks; confirm to get only that format's Qloo ranking. Then compare with “We want a film tonight with at most 110 minutes.” Verified runtimes filter the pool before Qloo; do not promise the same titles on each run. A 90-minute Hindi film request should ask for revision because the catalogue has no verified fit. These are synthetic demo briefs, not audience research.
5. Open a work, show its official destination and the question to share. Playback stays voluntary.
6. Save as Want to try. After an actual encounter, record Tried together and write a memory. For a demo, label the note as a sample; do not invent an actual encounter.
7. Open Our album; filter by Tried together. Explain that notes stay on this device and are excluded from provider requests. The separate activity brief goes to Gemini and is not stored by our server.

Measure actual end-to-end latency on the chosen host; do not promise the first-minute target without rehearsal. Name confirmation and ranking have visible progress and cancellation. Do not conceal failures or present a fixture as live. Recent real results may be reused; the interface discloses this and evidence retains the result timestamp. If explicitly presenting a known cached result, say so. Confirm sufficient remaining quota before demonstrating. No screenshots or recordings should expose keys or real family notes.

Honest claim: all three complete live technical flows were previously verified, and 56/60 catalogue identities matched. Family usefulness, superiority to baselines and cultural outcomes have not been measured. Public deployment and submission assets remain separate release work. The event does not require a video.
