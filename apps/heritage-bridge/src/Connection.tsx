import { useEffect, useRef, useState } from 'react';
import type { ChoiceOrigin, CollectionId, Discovery, Mode, Work } from '../shared/types';
import { library } from '../shared/library';
import type { LocalData } from './storage';
import { Results } from './Results';
export function Connection({
  work,
  mode,
  local,
  onLike,
  onOpen,
  onSave,
}: {
  work: Work;
  mode: Mode;
  local: LocalData;
  onLike: () => void;
  onOpen: (w: Work, origin: ChoiceOrigin) => void;
  onSave: (w: Work, origin: ChoiceOrigin) => void;
}) {
  const [target, setTarget] = useState<CollectionId>(work.collection),
    [kind, setKind] = useState<'movie' | 'artist'>(work.kind === 'movie' ? 'artist' : 'movie');
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const [result, setResult] = useState<Discovery>();
  const controller = useRef<AbortController | null>(null);
  const liked = local.feedback[work.id]?.interest === 'more';
  useEffect(() => () => controller.current?.abort(), []);
  function invalidate() {
    controller.current?.abort();
    controller.current = null;
    setResult(undefined);
    setError('');
    setBusy(false);
  }
  useEffect(() => {
    if (!liked) invalidate();
  }, [liked]);
  async function connect() {
    invalidate();
    const active = new AbortController();
    controller.current = active;
    setBusy(true);
    const timeout = setTimeout(() => active.abort(), 180000);
    try {
      const r = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seedId: work.id,
          liked: true,
          collection: target,
          kind,
          excluded: Object.entries(local.feedback)
            .filter(([, v]) => v.interest === 'no')
            .map(([id]) => id)
            .concat(
              local.saved.filter((s) => s.stage === 'tried').map((s) => s.id),
              Object.entries(local.feedback)
                .filter(([, v]) => v.interest === 'more')
                .map(([id]) => id),
            )
            .filter((id, i, ids) => ids.indexOf(id) === i),
        }),
        signal: active.signal,
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      if (!active.signal.aborted) setResult(data);
    } catch {
      if (controller.current === active)
        setError(
          'The connection service could not finish. Keep exploring the curated collections or try again.',
        );
    } finally {
      clearTimeout(timeout);
      if (controller.current === active) setBusy(false);
    }
  }
  return (
    <section className="connection-panel" aria-label="Explore a taste connection">
      <p className="eyebrow">FOLLOW YOUR CURIOSITY</p>
      <h2>Where could this take you?</h2>
      <p>
        Like {work.name}? Ask Qloo for a next step in one collection and format. Opening or saving a
        work does not count as a like.
      </p>
      {!liked ? (
        <button className="secondary" onClick={onLike}>
          I like {work.name} — explore a connection
        </button>
      ) : (
        <>
          <p className="like-confirmation">You explicitly liked {work.name}.</p>
          <div className="connection-controls">
            <label>
              Explore
              <select
                value={target}
                onChange={(e) => {
                  invalidate();
                  setTarget(e.target.value as CollectionId);
                }}
              >
                {library.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.subtitle}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Find
              <select
                value={kind}
                onChange={(e) => {
                  invalidate();
                  setKind(e.target.value as 'movie' | 'artist');
                }}
              >
                <option value="artist">Music artists</option>
                <option value="movie">Films</option>
              </select>
            </label>
            <button className="primary" disabled={busy || mode === 'unavailable'} onClick={connect}>
              {busy ? 'Looking for a connection…' : 'Explore a connection'}
            </button>
          </div>
          <p className="hint">
            {mode === 'fixture'
              ? 'Sample mode: this demonstrates the interaction without claiming a real taste relationship.'
              : mode === 'unavailable'
                ? 'Qloo connections are unavailable. Browsing and saving still work.'
                : 'One bounded Qloo ranking, within your chosen collection and format.'}
          </p>
        </>
      )}
      {error && (
        <p className="error-box" role="alert">
          {error}
        </p>
      )}
      {result && (
        <Results
          result={result}
          saved={local.saved.map((s) => s.id)}
          onSave={onSave}
          onOpen={(w) => onOpen(w, result.mode)}
        />
      )}
    </section>
  );
}
