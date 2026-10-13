# Collection-first milestone — October 4, 2026

## Experience

Explore → one of three collections → film or song → official destination or save. No favorites or questionnaire is required. The selected visual direction is a personal family scrapbook: warm paper, book-like collection covers, original illustration, serif headings and small handwritten memory annotations.

- Three usable collections with 17 distinct entries: Hindi 5, Tamil 6, Mexican 6.
- The shared Hindi duet is listed once with Udit Narayan and Lata Mangeshkar credited. All 18 previously reviewed records remain readable for existing album entries.
- Collection and work URLs support direct navigation and refresh; browser history and native links work.
- Album, collection notes, work notes and independent interest/difficulty feedback stay in the existing local storage format. The new editorial origin is backward compatible. Clearing requires an explicit dialog confirmation.
- “Find my starting point” is optional and preserves the editorial sequence. It uses three confirmed favorites and the existing bounded discovery path.
- An explicitly liked work can seed a single target-domain ranking within any one collection. Saving or opening does not implicitly like it. Fixture connections are labeled examples and never presented as real affinity.

## Content and outage behavior

`shared/catalogue-data.ts` stores reviewed facts, sources and the remaining unpublished queue. `shared/library.ts` defines the versioned collection order, rationale and published subset. `npm run catalogue:check` rejects missing/unreviewed entries, invalid destinations and duplicates. Current edition: 2026-10-04.2.

The browser bundles the reviewed library; it does not wait for `/api/status` or `/api/library` to display content. Discovery API failure therefore does not prevent collection browsing, official links, notes or album saves. This is not an offline caching claim: the web host must still serve the application files.

`GET /api/library` also exposes the editorial edition without a provider call. Production routes serve the app only for the supported page patterns, leaving unknown API paths and secret-file requests as 404s.

`POST /api/connect` validates explicit like, seed, target collection, target format and bounded exclusions. Live execution resolves the seed and up to six eligible targets, conservatively verifies name/type/year, performs at most one Qloo rank in the chosen format, intersects results with the curated pool and caches the outcome. Gemini retains the existing bounded orchestration. No arbitrary model-generated work can be displayed. Provider failure never substitutes fixtures.

## Verification

- Catalogue validator: 17 published entries, three collections, passed.
- 26 automated tests: existing 19 plus catalogue integrity, explicit-like boundary, fixture scope, mocked cross-collection live ranking/cache, no fallback on failure, unavailable-personalization HTTP/direct routes and legacy album persistence.
- Type check and production build passed.
- Actual browser: desktop Explore/collection, mobile work/album, optional three-favorite sample shortlist, explicitly liked Iqbal → Mexican music sample connection. No live provider calls.
- Saved a temporary song and memory without any favorites, refreshed the work URL, verified the album editorial origin and note, then removed only those test additions. Existing Iqbal and Meiyazhagan entries were preserved.
- Mobile DOM reported document width equal to viewport width (375px in the captured browser surface).

## Still unverified

Keys and actual Qloo/Gemini responses, cultural catalogue coverage, ranking usefulness and age/content suitability remain unverified. The 42 pending records are unpublished. Known upstream dependency advisories from the previous status remain unresolved. This is a local review build, not a public launch or a claim of measured recommendation quality.

## Design research applied

- [NN/g: visual design principles](https://www.nngroup.com/articles/principles-visual-design/) — scale and contrast establish hierarchy; related controls share proximity.
- [NN/g: proximity](https://www.nngroup.com/articles/gestalt-proximity/) — whitespace groups facts, destinations and notes into meaningful sections.
- [GOV.UK: make the service simple to use](https://www.gov.uk/service-manual/service-standard/point-4-make-the-service-simple-to-use) — allow the main task immediately and make optional personalization secondary.

The scrapbook treatment is a product-specific design judgment, not a claim that these references prescribe that aesthetic. Existing original artwork provenance remains in ARTWORK.md.
