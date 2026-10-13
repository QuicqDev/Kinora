# Equal-input comparison — prepared, not run

Purpose: test whether Qloo’s cultural-affinity ranking improves choices for this parent-led discovery task. A functioning API call is not proof of benefit.

## Freeze before collecting results

For each collection, record the catalogue version, exact confirmed favorites/IDs, eligible film and artist IDs, sourced descriptions, content/format constraints, exclusions and explicitly liked entities. Use the same candidate pool, editorial output slots (two films and one artist for an unconstrained bridge; up to two films or one artist for a confirmed activity), interface, title facts and time budget for every method. Freeze the confirmed activity before comparing ranking methods, including exact-edition song durations and unknown-duration exclusions. Candidate pool membership must not depend on which method is being evaluated. Keep the ranking-tool limit of ten options per domain.

Methods:

1. Qloo bounded ranking with confirmed signals; Gemini can introduce validated results but cannot replace the ranking.
2. An equally informed LLM with web access, identical frozen pool and sources, and the same format/constraint limits. Record its additional web sources and exclude factual discoveries unavailable to the other methods or incorporate them for all methods before rerunning.
3. Genre/popularity baseline using independently sourced, frozen metadata. Do not invent popularity ranks for the current incomplete catalogue.
4. The parent’s unaided selection from the identical pool.

Use randomized, concealed method labels when presenting cards. Do not infer actual family preferences from synthetic personas. Shuffled favorites test signal sensitivity only; output variation is not a usefulness metric.

## Record actual evidence

Per run: run ID; UTC timestamp; collection/catalogue version; input set; eligible pool; exclusions/constraints; provider/model/version; request count; response status; latency; returned IDs; valid displayed IDs; provenance; missing entries; and source checks. Do not store keys or parent notes in the evidence file. Keep failures in the record; do not cherry-pick only successful profiles.

Per consenting family, after separately authorized recruitment: parent choice; voluntary child interest; actual first encounter; difficulty; desire to continue; effort/time. Separate parent confidence from observed child response. Eight families/six preferring Qloo is a proposed exploratory continuation threshold from the plan, not statistical proof. No recruitment or measurements have occurred.

## Ready-to-fill run record

```json
{
  "runId": "",
  "recordedAt": null,
  "collection": "hindi",
  "catalogueVersion": "2026-10-04.1",
  "confirmedInputs": [],
  "eligiblePool": {"movie": [], "artist": []},
  "constraints": {},
  "methods": {
    "qloo": {"status": "not-run", "results": [], "latencyMs": null},
    "llmWithWeb": {"status": "not-run", "results": [], "sources": [], "latencyMs": null},
    "genrePopularity": {"status": "not-run", "results": [], "sources": []},
    "parent": {"status": "not-collected", "results": []}
  }
}
```

No baseline scores, Qloo uplift, enjoyment probabilities or cultural connection outcomes are claimed by the current preview.
