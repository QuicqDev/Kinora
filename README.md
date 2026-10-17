# Kinora

**Start with what your child loves. Find a film or song from your heritage to share together.**

Built for the [Qloo Agentic Hackathon](https://qloo.devpost.com/). Three source-reviewed collections — Hindi, Tamil and Mexican films and music — plus a private family album. Gemini checks which activity fits the family's situation; after confirmation, Qloo ranks eligible starting points from confirmed favorite films, artists or books.

Previously called Heritage Bridge. The app directory, environment variables and saved-album format retain their existing names for compatibility; earlier research and screenshots use the original name.

## Static judge preview

`npm run build:static` in the app directory creates a backend-free preview with **90 reviewed works across nine collections**: Hindi, Tamil, Mexican, French, British, US, Japanese, Korean and Italian. Plans and ranked positions are clearly labeled editorial samples; no Qloo, Gemini or other live recommendation calls run. The full live app remains a separate build. See [static demo and deployment status](apps/heritage-bridge/docs/STATIC_DEMO.md). The [interactive judge preview is live on GitHub Pages](https://quicqdev.github.io/Kinora/). It was deployed and verified on October 17, 2026, after the owner made the repository public.

## Install and run

Requires Node **22.19 or newer** and npm. Install the app dependencies:

```sh
cd apps/heritage-bridge
npm ci
npm run dev
```

Open http://127.0.0.1:5180. The API runs on 5181. For the built app:

```sh
npm run build
npm start
```

Open http://127.0.0.1:5181. From the repository root, `npm start` and `npm run dev` also launch Kinora after its dependencies have been installed.

Copy root `.env.example` to root `.env`. Default mode is an explicitly labelled fixture preview and makes no provider calls. To enable real discovery, supply server-side `QLOO_API_KEY`, `GEMINI_API_KEY`, `HERITAGE_MODE=live` and the correct Qloo endpoint. Event keys use `https://hackathon.api.qloo.com`. The tested local model is `gemini-3.8-flash`; availability depends on your account. Keys must never be browser variables or committed files.

## Verify

```sh
cd apps/heritage-bridge
npm run check
node scripts/run.mjs warm --live --collection=hindi
node scripts/run.mjs profiles --live
```

Live commands consume the configured provider budget and require explicit `--live`. The profile check uses synthetic demonstration preferences, not a real child's data. It tests input sensitivity, not enjoyment or superiority. Private traces remain under the configured state directory and must not be published.

## What the implementation does

- Plan a shared moment from a short brief. Check format and verified playback duration, ask for revision when no reviewed option fits, and rank only after confirmation. Twelve exact song recordings have sourced durations. Opening a work preserves the current visit's plan and results.
- Let compatible browser assistants inspect, prepare, plan and reopen a bridge through WebMCP. Private album notes are not exposed through tools. See the [WebMCP demo prompt](apps/heritage-bridge/docs/WEBMCP.md).
- Search and explicitly confirm three favorite identities, or try a clearly labelled example listener directly from the homepage. Choose a heritage collection, then receive up to two films and one artist from separate Qloo rankings. Results replace the input form and keep the favorites-to-heritage context visible.
- Recommend new choices: favorites, positive likes and items explicitly marked tried are excluded; browsing still permits revisits. Relevant positive feedback supplies additional ranking signals.
- Browse 60 original, source-reviewed entries, follow official destinations, keep notes and want/tried records, and download a private album copy.
- Validate identities, domain, IDs and affinities. Unresolved items stay browsable. A live failure never becomes a sample response. Artist affinity does not predict liking a specific song.

Qloo provides ranking evidence; Gemini chooses and checks an activity within a bounded tool loop. Suitability, subtitles and access vary. No measured family enjoyment or baseline advantage is claimed. The [demo walkthrough](apps/heritage-bridge/docs/DEMO.md) and [verification record](apps/heritage-bridge/docs/DEMO_READINESS_2026-10-13.md) cover the live flow and its limits.

## Deployment preparation

See [release configuration and validation](apps/heritage-bridge/docs/RELEASE_SETUP.md). Configure the actual HTTPS origin, host/port, private persistent state and a stable signing secret. Build with dev dependencies, then `npm ci --omit=dev` can run the server because `tsx` is a runtime dependency. Never serve or publish `.env`, private state, raw Qloo replies or user album copies.

The code is prepared for a small single-instance deployment. No public deployment or hackathon submission is implied by this repository. Public demo/source availability must be verified separately.

## License and assets

Project code and original material are under the [MIT License](LICENSE). Third-party packages retain their own licenses; bundled fonts use OFL, Lucide uses ISC. Source links establish factual provenance, not ownership of linked films, songs or images. The app links to official destinations and does not redistribute recordings, lyrics or posters. Illustration provenance: [ARTWORK.md](apps/heritage-bridge/docs/ARTWORK.md).

Review and evidence: [implementation review](apps/heritage-bridge/docs/IMPLEMENTATION_READINESS_REVIEW.md), [fix verification](apps/heritage-bridge/docs/IMPLEMENTATION_FIXES.md), [research handoff](RESEARCH_HANDOFF.md).

The earlier Tuesday Fix sample is preserved in the root source files. Run `npm run tuesday:start` to open it on port 4173. [Historical documentation](TUESDAY_FIX_README.md).
