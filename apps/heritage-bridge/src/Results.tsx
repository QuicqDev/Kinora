import { staticDemo } from './demo-mode';
import { ArrowRight, Bookmark, Check, ExternalLink, Film, Music2 } from 'lucide-react';
import type { ActivityPlan, Discovery, Feedback, Mode, Work } from '../shared/types';
import { Modal } from './Modal';
import { useEffect, useRef } from 'react';
import { formatSongDuration } from '../shared/activity';
export function Results({
  result,
  onOpen,
  onSave,
  saved,
  bridge,
  moment,
  reveal = false,
}: {
  result: Discovery;
  onOpen: (w: Work) => void;
  onSave: (w: Work, mode: Mode) => void;
  saved: string[];
  bridge?: { collection: string; favorites: string[]; example: boolean };
  moment?: { brief: string; plan?: ActivityPlan };
  reveal?: boolean;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!reveal) return;
    heading.current?.focus({ preventScroll: true });
    heading.current?.closest('dialog')?.scrollTo(0, 0);
  }, [result, reveal]);
  return (
    <section className="results" aria-label="Your discoveries">
      <div className="results-heading">
        <div>
          <p className="eyebrow">A PLACE TO BEGIN TOGETHER</p>
          <h2 ref={heading} tabIndex={-1}>
            {result.works.length ? 'Your bridge starts here.' : 'No discoveries this time'}
          </h2>
        </div>
        <span className={'mode-label ' + result.mode}>
          {result.mode === 'fixture'
            ? 'SAMPLE RESULTS'
            : result.mode === 'unavailable'
              ? 'PERSONALIZATION UNAVAILABLE'
              : ['degraded', 'partial'].includes(result.status)
                ? 'LIMITED LIVE RESULTS'
                : 'QLOO RESULTS'}
        </span>
      </div>
      {bridge && (
        <div className="bridge-context">
          <span>
            <small>{bridge.example ? 'EXAMPLE FAVORITES' : 'THEIR FAVORITES'}</small>
            <strong>{bridge.favorites.join(' · ')}</strong>
          </span>
          <ArrowRight size={20} aria-hidden="true" />
          <span>
            <small>YOUR CHOSEN HERITAGE</small>
            <strong>{bridge.collection}</strong>
          </span>
        </div>
      )}
      {result.mode === 'fixture' || result.status !== 'ok' ? (
        <p className="result-message" role="status">
          {result.message}
        </p>
      ) : (
        <p className="result-message" role="status">
          Qloo ranked these starting points from your favorites. Choose one to share together.
        </p>
      )}
      {result.activity && (
        <p className="activity-applied">
          <strong>Your confirmed plan:</strong>{' '}
          {result.activity.kind === 'movie' ? 'Watch a film' : 'Listen to music'} ·{' '}
          {result.activity.maxMinutes === null
            ? 'no time limit'
            : `up to ${result.activity.maxMinutes} minutes of playback. Only ${result.activity.kind === 'movie' ? 'films' : 'starting songs'} with reviewed durations qualify.`}
        </p>
      )}
      {moment?.brief && result.activity && (
        <details className="evidence">
          <summary>
            {staticDemo ? 'Sample request and local checks' : 'Your request and the agent’s checks'}
          </summary>
          <p>{moment.brief}</p>
          <ul>
            {moment.plan?.checks.map((check, i) => (
              <li key={i}>{check}</li>
            ))}
          </ul>
        </details>
      )}
      <div className="result-grid">
        {result.works.map((w, i) => (
          <article className="work-card" key={w.id}>
            <div className="work-info">
              <div className="work-heading">
                <span className="work-number">0{i + 1}</span>
                <span className="work-kind">
                  {w.kind === 'artist' ? <Music2 size={13} /> : <Film size={13} />}{' '}
                  {w.kind === 'artist' ? 'LISTEN' : 'WATCH'}
                </span>
              </div>
              <h3>
                <button
                  className="work-title"
                  aria-label={'Explore ' + w.name}
                  onClick={() => onOpen(w)}
                >
                  {w.name}
                </button>
              </h3>
              <p className="work-meta">
                {w.year && `${w.year} · `}
                {w.language}
                {w.runtime && ` · ${w.runtime} min`}
                {w.songDuration && ` · ${formatSongDuration(w.songDuration.durationMs)} song`}
              </p>
              {w.entry && <p className="entry">Start with “{w.entry}”</p>}
              <p>{w.description}</p>
              <div className="work-actions">
                <button className="text-link" onClick={() => onOpen(w)}>
                  {w.kind === 'artist' ? 'Share this song' : 'Share this film'}{' '}
                  <ArrowRight size={15} />
                </button>
                <button
                  className="icon-button"
                  aria-label={(saved.includes(w.id) ? 'Unsave ' : 'Save ') + w.name}
                  aria-pressed={saved.includes(w.id)}
                  onClick={() => onSave(w, result.mode)}
                >
                  {saved.includes(w.id) ? <Check size={18} /> : <Bookmark size={18} />}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {result.works.length > 0 && (
        <p className="bridge-next">
          Open a choice for an official place to watch or listen and a question to share. Keep the
          memory in your album.
        </p>
      )}
      {result.works.length > 0 && (
        <details className="evidence">
          <summary>Why these appeared</summary>
          {result.explanation && <p>{result.explanation}</p>}
          <p>
            <strong>Taste evidence:</strong> {result.evidence.source}.
          </p>
          <p>Input set: {result.evidence.signals.join(' · ')}.</p>
          <p>
            {result.mode === 'fixture'
              ? 'These fixed examples illustrate the experience. They do not establish a relationship with your favorites.'
              : 'Every displayed item is in the selected collection and was returned by Qloo. There is no verified attribution to an individual favorite, so no specific causal connection is claimed.'}
          </p>
          <p>
            <strong>Selection scope:</strong>{' '}
            {staticDemo
              ? 'Up to three sample choices in fixed catalogue order, filtered by the selected collection, confirmed playback limit and locally recorded exclusions. No taste ranking is calculated.'
              : 'Up to ten verified new candidates per format, in editorial order; one Qloo query per format. Separate rankings are never combined.'}
          </p>
          <p>
            <strong>About the works:</strong> the factual notes come from the linked source on each
            detail page. Artist affinity is distinct from song preference.
          </p>
          <small>
            Collection {result.evidence.collectionVersion} ·{' '}
            {new Date(result.evidence.at).toLocaleString()}
          </small>
        </details>
      )}
    </section>
  );
}
export function Detail({
  work,
  mode,
  feedback,
  note,
  saved,
  onClose,
  onSave,
  onFeedback,
  onNote,
}: {
  work: Work;
  mode: Mode;
  feedback: Feedback;
  note: string;
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
  onFeedback: (f: Feedback) => void;
  onNote: (v: string) => void;
}) {
  return (
    <Modal title={'Try ' + work.name + ' together'} onClose={onClose} wide>
      <div className="detail-grid">
        <div>
          <p className="eyebrow">
            A FIRST ENCOUNTER · {mode === 'fixture' ? 'SAMPLE CHOICE' : 'QLOO CHOICE'}
          </p>
          <h2>{work.name}</h2>
          {work.entry && <p className="entry">Start with “{work.entry}”</p>}
          <p>{work.description}</p>
          <p className="detail-meta">
            {work.language} {work.year && `· ${work.year}`}
          </p>
          <a
            href={work.destination}
            target="_blank"
            rel="noreferrer noopener"
            className="primary destination"
          >
            {work.destinationLabel}
            <ExternalLink size={15} />
          </a>
          <p className="availability">
            Opens the official destination. Access, subtitles and age ratings vary by region. Review
            the content before sharing; family suitability has not been assessed.
          </p>
          <a href={work.source} target="_blank" rel="noreferrer noopener" className="source-link">
            View factual source <ExternalLink size={12} />
          </a>
          <small className="checked">
            Link and basic facts checked {work.checked}.{' '}
            {work.runtime ? `Reviewed runtime: ${work.runtime} minutes.` : 'Duration not verified.'}{' '}
            Difficulty not verified.
          </small>
        </div>
      </div>
      <div className="feedback-block">
        <p className="eyebrow">AFTER YOU TRY IT</p>
        <h3>What happened?</h3>
        <fieldset>
          <legend>Did it hold their interest?</legend>
          <div className="feedback-options">
            {(
              [
                ['more', 'Want more like this'],
                ['no', 'Not for us'],
                ['untried', 'Haven’t tried it'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                aria-pressed={feedback.interest === value}
                onClick={() => onFeedback({ ...feedback, interest: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>How was following along?</legend>
          <div className="feedback-options">
            {(
              [
                ['comfortable', 'Comfortable'],
                ['help', 'Needed help'],
                ['difficult', 'Too difficult'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                aria-pressed={feedback.difficulty === value}
                onClick={() => onFeedback({ ...feedback, difficulty: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="hint">
          Interest and difficulty are kept separate. Only “Want more like this” adds a positive
          signal in live mode. “Not for us” excludes this item.
        </p>
      </div>
      <label className="detail-note">
        A note for this shared moment
        <textarea
          maxLength={800}
          value={note}
          onChange={(e) => onNote(e.target.value)}
          placeholder="What did you notice together?"
        />
      </label>
      <div className="dialog-actions">
        <span className="hint">Saved on this device only. Never sent to Qloo or Gemini.</span>
        <button className="secondary" onClick={onSave}>
          {saved ? <Check size={16} /> : <Bookmark size={16} />}{' '}
          {saved ? 'Saved · remove' : 'Save this choice'}
        </button>
      </div>
    </Modal>
  );
}
