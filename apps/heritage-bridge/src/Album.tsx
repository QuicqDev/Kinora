import { useState } from 'react';
import { ArrowUpRight, BookOpen, Film, Music2 } from 'lucide-react';
import { collections } from './catalogue';
import type { CollectionId, ChoiceOrigin, Work } from '../shared/types';
import type { LocalData } from './storage';

export function Album({
  local,
  works,
  onOpen,
}: {
  local: LocalData;
  works: Work[];
  onOpen: (work: Work, mode: ChoiceOrigin) => void;
}) {
  const [filter, setFilter] = useState<CollectionId | 'all'>('all');
  const [stage, setStage] = useState<'all' | 'want' | 'tried'>('all');
  const backup =
    'data:application/json;charset=utf-8,' +
    encodeURIComponent(
      JSON.stringify(
        { format: 'heritage-bridge.v1', exportedAt: new Date().toISOString(), ...local },
        null,
        2,
      ),
    );
  const entries = local.saved.flatMap((saved) => {
    const work = works.find((work) => work.id === saved.id);
    return work &&
      (filter === 'all' || work.collection === filter) &&
      (stage === 'all' || (saved.stage ?? 'want') === stage)
      ? [{ saved, work }]
      : [];
  });
  return (
    <div className="family-album">
      <p className="eyebrow">OURS TO KEEP</p>
      <h1>Our family album</h1>
      <p>A few things to try. A few stories to hold on to.</p>
      <div className="album-stage-tabs" role="group" aria-label="Filter album by experience">
        {(
          [
            ['all', 'All pages'],
            ['want', 'Want to try'],
            ['tried', 'Tried together'],
          ] as const
        ).map(([value, label]) => (
          <button key={value} aria-pressed={stage === value} onClick={() => setStage(value)}>
            {label}{' '}
            <span>
              {local.saved.filter((s) => value === 'all' || (s.stage ?? 'want') === value).length}
            </span>
          </button>
        ))}
      </div>
      <div
        className="album-filters"
        role="group"
        aria-label="Filter saved discoveries by collection"
      >
        {[{ id: 'all', name: 'Everything' }, ...collections].map((c) => (
          <button
            key={c.id}
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id as CollectionId | 'all')}
          >
            {c.name}
          </button>
        ))}
      </div>
      {entries.length ? (
        <div className="album-grid">
          {entries.map(({ saved, work }) => (
            <article className={'album-entry ' + work.kind} key={work.id}>
              <div className="album-entry-top">
                {work.kind === 'artist' ? <Music2 size={20} /> : <Film size={20} />}
                <span>
                  {collections.find((c) => c.id === work.collection)?.name} ·{' '}
                  {saved.mode === 'editorial'
                    ? 'From the collection'
                    : saved.mode === 'fixture'
                      ? 'Sample'
                      : saved.mode === 'live'
                        ? 'Qloo discovery'
                        : 'Saved choice'}
                </span>
              </div>
              <h3>{work.name}</h3>
              <p className={'experience-stamp ' + (saved.stage ?? 'want')}>
                {saved.stage === 'tried' ? 'Tried together' : 'Want to try'}
                {saved.stage === 'tried' && saved.triedAt
                  ? ' · ' +
                    new Date(saved.triedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : ''}
              </p>
              {work.entry && <p className="album-track">{work.entry}</p>}
              <p className={'album-memory' + (!saved.note ? ' empty-memory' : '')}>
                {saved.note ||
                  (saved.stage === 'tried'
                    ? 'What will you remember about this one?'
                    : 'Leave a note after you try it together.')}
              </p>
              {local.feedback[work.id]?.interest &&
                local.feedback[work.id]?.interest !== 'untried' && (
                  <p className="album-feedback">
                    {local.feedback[work.id].interest === 'more'
                      ? 'You wanted more like this'
                      : 'You marked this “Not for us”'}
                  </p>
                )}
              <div className="album-entry-bottom">
                <small>
                  Saved{' '}
                  {new Date(saved.at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </small>
                <button className="text-link" onClick={() => onOpen(work, saved.mode)}>
                  Open & add a note <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="album-empty">
          <BookOpen size={42} strokeWidth={1} />
          <h3>
            {stage === 'tried'
              ? 'Your first shared moment belongs here.'
              : filter === 'all'
                ? 'The first page is yours.'
                : 'A page waiting to be filled.'}
          </h3>
          <p>
            {stage === 'tried'
              ? 'After watching or listening together, open the work and mark it “Tried together”.'
              : `Save a discovery from ${filter === 'all' ? 'any collection' : 'this collection'} to keep it here with your own notes.`}
          </p>
        </div>
      )}
      <p className="album-privacy">
        This album stays in this browser. Your notes are never sent to Qloo or Gemini.
      </p>
      <a
        className="secondary album-download"
        href={backup}
        download={'heritage-bridge-album-' + new Date().toISOString().slice(0, 10) + '.json'}
      >
        Download a copy of our album
      </a>
      <p className="hint">
        Saves your memories and choices as a file on your device. Keep it somewhere private.
      </p>
    </div>
  );
}
