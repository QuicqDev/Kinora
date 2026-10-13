import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import type {
  ActivityConstraint,
  ActivityPlan,
  Discovery,
  Favorite,
  Mode,
  Work,
} from '../shared/types';
import type { EditorialCollection } from '../shared/library';
import type { LocalData } from './storage';
import { Modal } from './Modal';
import { Search } from './Search';
import { Results } from './Results';
import { exampleFavorites } from '../shared/collections';
import { exampleListeners, resolveExample, type ExampleListener } from './example-listeners';
import { activityExamples, shortMoment } from '../shared/activity';
import { publishedWorks } from '../shared/library';
import type { BridgeDraft } from './bridge-draft';
import { noArguments, toolResult, useWebMCP } from './webmcp';
import { z } from 'zod';

export function StartingPoint({
  collection,
  mode,
  local,
  favorites,
  setFavorites,
  onClose,
  onOpen,
  onSave,
  initialExample,
  exampleIds,
  setExampleIds,
  draft,
  setDraft,
  initialMoment = false,
}: {
  collection: EditorialCollection;
  mode: Mode;
  local: LocalData;
  favorites: Favorite[];
  setFavorites: (v: Favorite[]) => void;
  onClose: () => void;
  onOpen: (w: Work, mode: Mode) => void;
  onSave: (w: Work, mode: Mode) => void;
  initialExample?: ExampleListener | 'fixture';
  exampleIds: string[];
  setExampleIds: (ids: string[]) => void;
  draft: BridgeDraft;
  setDraft: Dispatch<SetStateAction<BridgeDraft>>;
  initialMoment?: boolean;
}) {
  const [search, setSearch] = useState(false);
  const [phase, setPhase] = useState<'resolving' | 'ranking' | 'planning'>();
  const { brief, plan, result } = draft;
  const setBrief = (brief: string) => setDraft((d) => ({ ...d, brief }));
  const setPlan = (plan: ActivityPlan | undefined) => setDraft((d) => ({ ...d, plan }));
  const setResult = (result: Discovery | undefined) => setDraft((d) => ({ ...d, result }));
  const [error, setError] = useState('');
  const exampleUsed = favorites.some((f) => exampleIds.includes(f.id));
  const pending = useRef<AbortController | null>(null);
  const inputHeading = useRef<HTMLHeadingElement>(null);
  const activityPanel = useRef<HTMLDivElement>(null);
  const busy = !!phase;
  const webMCPStatus = useWebMCP(
    mode === 'live'
      ? [
          {
            name: 'heritage_plan_moment',
            description:
              'Ask Gemini to plan the visible activity brief against the reviewed catalogue. Requires three confirmed favorites and an editable request. Uses the same bounded, cancellable API as Plan our moment and consumes the existing provider budget. Displays a proposal or clarification in the page. Does not rank or confirm; the person must choose Use this plan and find choices. Never reads album notes.',
            inputSchema: z.toJSONSchema(noArguments),
            execute: async (input, options) => {
              noArguments.parse(input);
              if (
                busy ||
                pending.current ||
                result ||
                favorites.length !== 3 ||
                brief.trim().length < 5
              )
                throw Error(
                  'Wait for favorite confirmation and any active request. Open the editable request with three favorites before planning.',
                );
              if (plan) return toolResult(plan);
              const proposed = await planMoment(options?.signal);
              if (!proposed)
                throw Error('The plan did not finish. The request remains visible; try again.');
              return toolResult(proposed);
            },
          },
        ]
      : [],
  );
  useEffect(() => {
    if (plan) activityPanel.current?.scrollIntoView({ block: 'start' });
  }, [plan]);

  useEffect(() => {
    // StrictMode's discarded effect must not spend provider calls.
    let active = true;
    queueMicrotask(() => {
      if (active && initialExample) void find(initialExample, undefined, initialMoment);
    });
    return () => {
      active = false;
      pending.current?.abort();
    };
  }, []);

  function change(values: Favorite[]) {
    pending.current?.abort();
    pending.current = null;
    setPhase(undefined);
    setResult(undefined);
    setError('');
    setPlan(undefined);
    setFavorites(values);
  }
  function edit() {
    change(favorites);
    requestAnimationFrame(() => {
      inputHeading.current?.focus({ preventScroll: true });
      inputHeading.current?.closest('dialog')?.scrollTo(0, 0);
    });
  }
  async function planMoment(externalSignal?: AbortSignal) {
    externalSignal?.throwIfAborted();
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    const abort = () => controller.abort();
    externalSignal?.addEventListener('abort', abort, { once: true });
    setPhase('planning');
    setPlan(undefined);
    setError('');
    const timeout = setTimeout(() => controller.abort(), 130000);
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: collection.id,
          brief,
          excluded: [
            ...new Set([
              ...local.saved.filter((s) => s.stage === 'tried').map((s) => s.id),
              ...Object.entries(local.feedback)
                .filter(([, f]) => ['no', 'more'].includes(f.interest ?? ''))
                .map(([id]) => id),
              ...favorites.map((f) => f.id),
            ]),
          ].slice(0, 60),
        }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      if (!controller.signal.aborted && pending.current === controller) {
        setPlan(data);
        return data as ActivityPlan;
      }
    } catch {
      if (pending.current === controller)
        setError('The activity plan could not finish. Your request is kept; try again.');
    } finally {
      clearTimeout(timeout);
      externalSignal?.removeEventListener('abort', abort);
      if (pending.current === controller) {
        setPhase(undefined);
        pending.current = null;
      }
    }
  }
  async function find(
    example?: ExampleListener | 'fixture',
    activity?: ActivityConstraint,
    prepareMoment = false,
  ) {
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setPhase(example && example !== 'fixture' ? 'resolving' : 'ranking');
    setError('');
    setResult(undefined);
    let values = favorites;
    if (example) {
      setBrief(prepareMoment ? brief || shortMoment : '');
      setPlan(undefined);
      setFavorites([]);
      setExampleIds([]);
    }
    const timeout = setTimeout(() => controller.abort(), 180000);
    let resolving = !!example && example !== 'fixture';
    try {
      if (example) {
        if (example === 'fixture' && mode !== 'fixture') throw Error('Sample mode required');
        if (example !== 'fixture' && mode !== 'live') throw Error('Live mode required');
        values =
          example === 'fixture'
            ? exampleFavorites.slice(0, 3)
            : await resolveExample(example, controller.signal);
        controller.signal.throwIfAborted();
        setFavorites(values);
        setExampleIds(values.map((f) => f.id));
      }
      resolving = false;
      if (prepareMoment) return;
      setPhase('ranking');
      const response = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: collection.id,
          favorites: values,
          feedback: local.feedback,
          easier: false,
          activity,
          tried: local.saved.filter((s) => s.stage === 'tried').map((s) => s.id),
        }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      if (!controller.signal.aborted && pending.current === controller) setResult(data);
    } catch {
      if (pending.current === controller)
        setError(
          resolving
            ? 'The example favorites could not be confirmed. Try again or add favorites with search.'
            : 'Discovery could not finish. Your favorites are kept. Try again or browse the collection.',
        );
    } finally {
      clearTimeout(timeout);
      if (pending.current === controller) {
        setPhase(undefined);
        pending.current = null;
      }
    }
  }
  if (search)
    return (
      <Search
        mode={mode}
        favorites={favorites}
        onClose={() => setSearch(false)}
        onConfirm={(f) => {
          if (favorites.length < 3 && !favorites.some((x) => x.id === f.id))
            change([...favorites, f]);
          setSearch(false);
        }}
      />
    );
  return (
    <Modal
      title={result ? 'Your bridge to ' + collection.subtitle : 'Find your shared starting point'}
      onClose={onClose}
      wide
    >
      {result ? (
        <div className="bridge-reveal">
          <Results
            result={result}
            moment={{ brief, plan }}
            saved={local.saved.map((s) => s.id)}
            onOpen={(w) => onOpen(w, result.mode)}
            onSave={onSave}
            bridge={{
              collection: collection.subtitle,
              favorites: favorites.map((f) => f.name),
              example: exampleUsed,
            }}
            reveal
          />
          <div className="dialog-actions bridge-result-actions">
            <button className="secondary" onClick={edit}>
              <ArrowLeft size={16} /> Edit favorites or activity
            </button>
            <button className="text-link" onClick={onClose}>
              Back to exploring
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="eyebrow">THEIR FAVORITES → {collection.subtitle}</p>
          <h2 ref={inputHeading} tabIndex={-1}>
            What do they love?
          </h2>
          <p>
            Choose three films, artists or books. We’ll use their favorites to find a film or song
            from your heritage to share together.
          </p>
          {mode === 'unavailable' ? (
            <p className="error-box" role="status">
              Personalization is currently unavailable. You can still browse the collections and
              keep your memories.
            </p>
          ) : (
            <>
              {mode === 'fixture' && (
                <p className="sample-notice">
                  Sample preview · fixed choices, not personalized Qloo matches.
                </p>
              )}
              <div className="favorites">
                {favorites.map((f) => (
                  <div className="favorite" key={f.id}>
                    <span>
                      <strong>{f.name}</strong>
                      <small>{f.subtitle}</small>
                    </span>
                    <button
                      className="icon-button"
                      aria-label={'Remove ' + f.name}
                      onClick={() => change(favorites.filter((x) => x.id !== f.id))}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {favorites.length < 3 && !busy && (
                  <button className="add-favorite" onClick={() => setSearch(true)}>
                    <Plus size={18} /> Add a favorite{' '}
                    <span className="slot">{favorites.length}/3</span>
                  </button>
                )}
              </div>
              {mode === 'live' && (
                <div className="activity-brief" ref={activityPanel}>
                  <label htmlFor="family-brief">
                    <strong>What would fit your moment?</strong>{' '}
                    <span className="hint">Optional</span>
                  </label>
                  <p className="hint">
                    Tell us what you’re doing and any time limit. The agent will check the
                    collection before suggesting a plan.
                  </p>
                  <textarea
                    id="family-brief"
                    maxLength={500}
                    value={brief}
                    disabled={busy}
                    placeholder="We’re cooking together and want something to listen to."
                    onChange={(e) => {
                      setBrief(e.target.value);
                      setPlan(undefined);
                      setError('');
                    }}
                  />
                  <p className="hint">
                    This request goes to Gemini. Your album notes stay on this device.
                  </p>
                  {webMCPStatus === 'ready' && (
                    <p className="hint">
                      WebMCP connected · Your browser assistant can ask for a plan here. You confirm
                      before finding choices.
                    </p>
                  )}
                  {!busy && !brief && (
                    <div className="activity-examples">
                      {activityExamples(collection.id, publishedWorks).map((example) => (
                        <button
                          className="text-link"
                          key={example}
                          onClick={() => {
                            setBrief(example);
                            setPlan(undefined);
                          }}
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  )}
                  {plan && (
                    <div className="activity-proposal" role="status" aria-live="polite">
                      <p className="eyebrow">
                        {plan.status === 'ready'
                          ? 'A PLAN FOR YOUR MOMENT'
                          : 'LET’S ADJUST THE REQUEST'}
                      </p>
                      {plan.activity && (
                        <h3>
                          {plan.activity.kind === 'movie' ? 'Watch a film' : 'Listen to music'} ·{' '}
                          {plan.activity.maxMinutes === null
                            ? 'no time limit'
                            : `up to ${plan.activity.maxMinutes} minutes`}
                        </h3>
                      )}
                      <p>{plan.message}</p>
                      {plan.checks.length > 0 && (
                        <details>
                          <summary>What the agent checked</summary>
                          <ul>
                            {plan.checks.map((check, i) => (
                              <li key={i}>{check}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                      {plan.activity?.kind === 'artist' && (
                        <p className="hint">
                          Qloo ranks artists; the starting song is editorial. A time limit includes
                          only recordings with a verified duration. Allow extra time to open the
                          service and talk.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {busy ? (
                <div className="bridge-progress" role="status" aria-live="polite">
                  <span className="handwritten">Finding a little common ground.</span>
                  <p>
                    {phase === 'planning'
                      ? 'Checking which activity the collection can support…'
                      : phase === 'resolving'
                        ? 'Confirming the example favorites…'
                        : mode === 'fixture'
                          ? 'Opening the sample choices…'
                          : plan?.activity
                            ? `Qloo is ranking ${plan.activity.kind === 'movie' ? 'films' : 'artists'} that meet your confirmed plan…`
                            : 'Qloo is ranking films and artists from your chosen collection…'}
                  </p>
                  <button className="text-link" onClick={() => change(favorites)}>
                    Cancel and edit
                  </button>
                </div>
              ) : (
                <>
                  <div className="dialog-actions">
                    <button className="secondary" onClick={onClose}>
                      Keep browsing
                    </button>
                    <button
                      className="primary"
                      disabled={
                        favorites.length !== 3 ||
                        (!!brief.trim() && brief.trim().length < 5) ||
                        plan?.status === 'needs_input'
                      }
                      onClick={() =>
                        brief.trim() && mode === 'live'
                          ? plan?.status === 'ready'
                            ? find(undefined, plan.activity)
                            : planMoment()
                          : find()
                      }
                    >
                      {brief.trim() && mode === 'live'
                        ? plan?.status === 'ready'
                          ? 'Use this plan and find choices'
                          : plan?.status === 'needs_input'
                            ? 'Edit your request above'
                            : 'Plan our moment'
                        : 'Find our starting point'}{' '}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="example-listeners">
                    <p className="eyebrow">OR SEE THE BRIDGE WITH AN EXAMPLE</p>
                    {mode === 'live' ? (
                      exampleListeners.map((p) => (
                        <button key={p.id} className="example-listener" onClick={() => find(p.id)}>
                          <span>
                            <strong>{p.label}</strong>
                            <small>{p.names.join(' · ')}</small>
                          </span>
                          <ArrowRight size={18} />
                        </button>
                      ))
                    ) : (
                      <button className="secondary" onClick={() => find('fixture')}>
                        See a sample bridge <ArrowRight size={16} />
                      </button>
                    )}
                    <p className="hint">
                      {mode === 'live'
                        ? 'Made-up listener profiles using real artists. Qloo checks the names and ranks the choices; recent results may be reused.'
                        : 'An example of the flow. No Qloo request is made.'}
                    </p>
                  </div>
                </>
              )}
            </>
          )}
          {error && (
            <p role="alert" className="error-box">
              {error}
            </p>
          )}
        </>
      )}
    </Modal>
  );
}
