import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Search as SearchIcon, Plus } from 'lucide-react';
import type { Favorite, Kind, Mode } from '../shared/types';
import { exampleFavorites } from '../shared/collections';
import { Modal } from './Modal';
export function Search({
  mode,
  favorites,
  onClose,
  onConfirm,
}: {
  mode: Mode;
  favorites: Favorite[];
  onClose: () => void;
  onConfirm: (f: Favorite) => void;
}) {
  const [kind, setKind] = useState<Kind>('movie');
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<Favorite[]>(
    mode === 'fixture' ? exampleFavorites.filter((f) => f.kind === 'movie') : [],
  );
  const [chosen, setChosen] = useState<Favorite>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);
  function changeKind(value: Kind) {
    pending.current?.abort();
    setBusy(false);
    setKind(value);
    setMatches(mode === 'fixture' ? exampleFavorites.filter((f) => f.kind === value) : []);
    setError('');
  }
  async function search() {
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&kind=${kind}`, {
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (!controller.signal.aborted) {
        setMatches(data.matches);
        if (!data.matches.length)
          setError('No confirmed matches found. Try a fuller title or a different format.');
      }
    } catch (e) {
      if (!controller.signal.aborted)
        setError(e instanceof Error ? e.message : 'Search is unavailable. Please try again.');
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }
  return (
    <Modal title="Find a favorite" onClose={onClose}>
      <p className="eyebrow">THEIR WORLD</p>
      <h2>{chosen ? 'Is this the one?' : 'Find a favorite'}</h2>
      {chosen ? (
        <>
          <p>Confirm the actual work or artist you have in mind.</p>
          <div className="confirm-favorite">
            <span className="pill">{chosen.kind}</span>
            <h3>{chosen.name}</h3>
            <p>{chosen.subtitle}</p>
            <small>
              {mode === 'fixture'
                ? 'Example favorite · not verified with Qloo'
                : 'Identity returned by Qloo'}
            </small>
          </div>
          <div className="dialog-actions">
            <button className="secondary" onClick={() => setChosen(undefined)}>
              <ArrowLeft size={15} /> Back to matches
            </button>
            <button className="primary" onClick={() => onConfirm(chosen)}>
              Yes, add this <Plus size={16} />
            </button>
          </div>
        </>
      ) : (
        <>
          <p>
            {mode === 'fixture'
              ? 'Sample preview · Choose from six example favorites.'
              : 'Search Qloo, then confirm the intended match. Nothing is selected automatically.'}
          </p>
          <div className="format-tabs" role="group" aria-label="Favorite format">
            {(['movie', 'artist', 'book'] as const).map((k) => (
              <button
                key={k}
                aria-pressed={kind === k}
                className={kind === k ? 'active' : ''}
                onClick={() => changeKind(k)}
              >
                {k === 'movie' ? 'Films' : k === 'artist' ? 'Music artists' : 'Books'}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            className="search-form"
          >
            <input
              autoFocus
              placeholder="Search a film, artist or book"
              aria-label="Search favorites"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={180}
            />
            <button
              className="secondary"
              disabled={query.trim().length < 2 || busy}
              aria-label="Search"
            >
              <SearchIcon size={18} />
            </button>
          </form>
          <div role="status" className="form-status">
            {busy ? 'Searching for real matches…' : error}
          </div>
          <div className="search-results">
            {matches
              .filter((f) => !favorites.some((x) => x.id === f.id))
              .map((f) => (
                <button key={f.id} onClick={() => setChosen(f)}>
                  <span>
                    <strong>{f.name}</strong>
                    <small>{f.subtitle}</small>
                  </span>
                  <ArrowRight size={17} />
                </button>
              ))}
          </div>
        </>
      )}
    </Modal>
  );
}
