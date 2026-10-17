import { clientRequest } from './client-api';
import { staticDemo } from './demo-mode';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  ExternalLink,
  Film,
  Music2,
} from 'lucide-react';
import {
  library,
  collectionWorks,
  albumWorks,
  publishedWorks,
  type EditorialCollection,
} from './catalogue';
import type { ChoiceOrigin, CollectionId, Favorite, Feedback, Mode, Work } from '../shared/types';
import { readLocal, writeLocal, emptyLocal, recordExperience, recoveryCopy } from './storage';
import { Modal } from './Modal';
import { Album } from './Album';
import { StartingPoint } from './StartingPoint';
import { Connection } from './Connection';
import { exampleListeners, type ExampleListener } from './example-listeners';
import { Link, navigate, usePath } from './navigation';
import { startDraft, type BridgeDraft } from './bridge-draft';
import { formatSongDuration } from '../shared/activity';
import { shortMoment } from '../shared/activity';
import {
  inspectCollection,
  inspectCollectionSchema,
  noArguments,
  prepareBridgeSchema,
  toolResult,
  useWebMCP,
} from './webmcp';
import { z } from 'zod';

export function App() {
  const path = usePath();
  const [clearAlbum, setClearAlbum] = useState(false);
  const [mode, setMode] = useState<Mode>(staticDemo ? 'fixture' : 'unavailable');
  const [local, setLocal] = useState(readLocal);
  const [storageError, setStorageError] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [exampleIds, setExampleIds] = useState<string[]>([]);
  const [targetCollection, setTargetCollection] = useState<CollectionId>(
    staticDemo ? 'mexican' : 'hindi',
  );
  const [recovery] = useState(recoveryCopy);
  const [personalize, setPersonalize] = useState<EditorialCollection>();
  const [initialExample, setInitialExample] = useState<ExampleListener | 'fixture'>();
  const [initialMoment, setInitialMoment] = useState(false);
  const [bridgeGeneration, setBridgeGeneration] = useState(0);
  const [bridgeDraft, setBridgeDraft] = useState<BridgeDraft>({ collection: 'hindi', brief: '' });
  const [origin, setOrigin] = useState<{ id: string; value: ChoiceOrigin }>();
  const [format, setFormat] = useState<'all' | 'movie' | 'artist'>('all');
  const [query, setQuery] = useState('');
  const main = useRef<HTMLElement>(null);
  const collection = library.find((c) => path === '/collections/' + c.slug);
  const work = albumWorks.find((w) => path === '/works/' + w.id);
  const home = path === '/' || path === '/explore';
  const webMCPStatus = useWebMCP([
    {
      name: 'heritage_inspect_collection',
      description: staticDemo
        ? 'Inspect the nine public sample collections for films or recordings within a playback limit. Returns reviewed durations and source links. Local catalogue feasibility only, with no Qloo or Gemini call. Never reads private album data.'
        : 'Inspect the public Hindi, Tamil or Mexican catalogue for films or starting songs within a playback limit. This is catalogue feasibility, not personalized ranking. Returns reviewed durations and work IDs; never reads private album data.',
      inputSchema: z.toJSONSchema(inspectCollectionSchema),
      annotations: { readOnlyHint: true },
      execute: async (input) => toolResult(inspectCollection(input)),
    },
    {
      name: 'heritage_prepare_bridge',
      description: staticDemo
        ? 'Prepare a visible static demo with synthetic pop favorites and a supported sample request. Replaces the active draft and results. No Qloo or Gemini call. Use heritage_plan_moment for a local catalogue check, then let the person confirm. Custom requests will receive an honest unsupported-input message.'
        : 'Open a visible, editable activity request. Replaces the active bridge draft and results. Choose current favorites or an explicitly requested synthetic pop/instrumental example (which resolves artist names through Qloo in the full live app). Does not run planning or ranking. Next use heritage_plan_moment, then let the person confirm the plan in the page. The brief will go to Gemini only when planning is requested.',
      inputSchema: z.toJSONSchema(prepareBridgeSchema),
      execute: async (input) => {
        const args = prepareBridgeSchema.parse(input);
        if (mode !== 'live' && !staticDemo)
          throw Error('Live activity planning is unavailable. Browse the collections instead.');
        if (args.favorites !== 'current') {
          setFavorites([]);
          setExampleIds([]);
        }
        setBridgeDraft({ collection: args.collection, brief: args.brief });
        setInitialExample(args.favorites === 'current' ? undefined : args.favorites);
        setInitialMoment(true);
        setBridgeGeneration((v) => v + 1);
        setPersonalize(library.find((c) => c.id === args.collection)!);
        return toolResult({
          status: 'prepared',
          next: staticDemo
            ? 'Sample request prepared. Use heritage_plan_moment for local duration checks, then let the person confirm fixed sample choices.'
            : 'The request is visible. Wait for three favorites to be confirmed, then call heritage_plan_moment or use Plan our moment. A person confirms the proposed plan before ranking.',
        });
      },
    },
    {
      name: 'heritage_resume_bridge',
      description:
        'Reopen the active bridge request, plan or results in this visit, without another provider call. Does not expose or change album notes.',
      inputSchema: z.toJSONSchema(noArguments),
      execute: async (input) => {
        noArguments.parse(input);
        if (!bridgeDraft.brief && !bridgeDraft.result)
          throw Error('No active bridge to resume. Prepare one first.');
        resumeBridge();
        return toolResult({ status: 'opened' });
      },
    },
  ]);
  useEffect(() => {
    const controller = new AbortController();
    clientRequest('/api/status', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((d) => {
        if (!controller.signal.aborted && ['fixture', 'live', 'unavailable'].includes(d.mode))
          setMode(d.mode);
      })
      .catch(() => {
        if (!controller.signal.aborted) setMode('unavailable');
      });
    return () => controller.abort();
  }, [path, personalize?.id]);
  useEffect(() => {
    setStorageError(!writeLocal(local));
  }, [local]);
  useEffect(() => {
    setPersonalize(undefined);
    setClearAlbum(false);
    setFormat('all');
    setQuery('');
    document.title =
      (work?.entry ||
        work?.name ||
        collection?.title ||
        (path === '/album' ? 'Our family album' : 'Explore')) + ' · Kinora';
    main.current?.focus();
    window.scrollTo(0, 0);
  }, [path, work, collection]);
  function open(w: Work, value: ChoiceOrigin) {
    setPersonalize(undefined);
    setOrigin({ id: w.id, value });
    navigate('/works/' + w.id);
  }
  function startBridge(
    collection: EditorialCollection,
    example?: ExampleListener | 'fixture',
    moment = false,
  ) {
    setBridgeDraft((d) =>
      moment
        ? { collection: collection.id, brief: shortMoment }
        : startDraft(d, collection.id, !!example),
    );
    setBridgeGeneration((v) => v + 1);
    setInitialMoment(moment);
    setInitialExample(example);
    setPersonalize(collection);
  }
  function resumeBridge() {
    setInitialExample(undefined);
    setInitialMoment(false);
    setPersonalize(library.find((c) => c.id === bridgeDraft.collection)!);
  }
  function save(w: Work, value: ChoiceOrigin = 'editorial') {
    setLocal((v) => ({
      ...v,
      saved: v.saved.some((s) => s.id === w.id)
        ? v.saved.filter((s) => s.id !== w.id)
        : [
            ...v.saved,
            {
              id: w.id,
              mode: value,
              at: new Date().toISOString(),
              note: v.notes[w.id] ?? v.notes[w.collection] ?? '',
              stage: 'want',
            },
          ],
    }));
  }
  function note(id: string, value: string) {
    setLocal((v) => ({
      ...v,
      notes: { ...v.notes, [id]: value },
      saved: v.saved.map((s) => (s.id === id ? { ...s, note: value } : s)),
    }));
  }
  function feedback(w: Work, value: Feedback) {
    setLocal((v) => ({ ...v, feedback: { ...v.feedback, [w.id]: value } }));
  }
  const saved = (w: Work) => local.saved.some((s) => s.id === w.id);
  const saveButton = (w: Work, value: ChoiceOrigin = 'editorial') => (
    <button
      className="save-work"
      aria-label={(saved(w) ? 'Remove from album: ' : 'Save to album: ') + (w.entry || w.name)}
      aria-pressed={saved(w)}
      onClick={() => save(w, value)}
    >
      {saved(w) ? <Check size={17} /> : <Bookmark size={17} />}
      <span>{saved(w) ? 'Saved' : 'Save'}</span>
    </button>
  );
  return (
    <div className={'page library-page' + (staticDemo ? ' judge-preview' : '')}>
      <a
        className="skip"
        href="#main"
        onClick={
          staticDemo
            ? (e) => {
                e.preventDefault();
                main.current?.focus();
                main.current?.scrollIntoView();
              }
            : undefined
        }
      >
        Skip to content
      </a>
      <header>
        <Link className="brand" href="/explore">
          <span className="bridge-mark" aria-hidden="true">
            <i />
            <i />
          </span>
          Kinora
        </Link>
        <nav aria-label="Main navigation">
          <Link aria-current={home ? 'page' : undefined} href="/explore">
            Explore
          </Link>
          <Link aria-current={path === '/album' ? 'page' : undefined} href="/album">
            <BookOpen size={17} />
            Our album <span className="album-count">{local.saved.length}</span>
          </Link>
        </nav>
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        {staticDemo && (
          <aside className="demo-banner" aria-label="About this demo">
            <strong>Interactive demo</strong>
            <span>Fixed sample data · No live AI calls</span>
            <details>
              <summary>About this demo</summary>
              <p>
                The full Kinora app integrates Qloo Insights API v2 for taste rankings and Gemini
                for activity planning. This hosted preview uses reviewed public catalogue facts and
                synthetic listeners. No live recommendations, API calls or LLM calls run here.
              </p>
            </details>
          </aside>
        )}
        {(bridgeDraft.result || bridgeDraft.brief) && (
          <button className="secondary resume-bridge" onClick={resumeBridge}>
            <ArrowLeft size={16} /> Back to my bridge
          </button>
        )}
        {recovery && (
          <p className="error-box" role="status">
            Some album records could not be read. Your readable memories were kept.{' '}
            <a
              href={'data:application/json;charset=utf-8,' + encodeURIComponent(recovery)}
              download="heritage-bridge-recovery.json"
            >
              Download the original album for recovery
            </a>
            .
          </p>
        )}
        {storageError && (
          <p role="alert" className="error-box">
            This browser couldn’t save your album. Keep this page open to retain your current notes.
          </p>
        )}
        {home && (
          <>
            <section className="library-intro">
              <div>
                <p className="eyebrow">
                  {staticDemo
                    ? 'A SHARED SONG. A FAMILY STORY.'
                    : 'FILMS, SONGS & THE STORIES BETWEEN US'}
                </p>
                <h1>
                  {staticDemo ? 'Connect your child' : 'Their favorites.'}
                  <br />
                  <em>{staticDemo ? 'with your culture.' : 'Your heritage.'}</em>
                </h1>
                <p className="lead">
                  {staticDemo
                    ? 'Find a film or song from your heritage through what they already love, then keep the memory together.'
                    : 'Start with films, artists or books your child loves. Find a film or song from your heritage to share. Keep the memory.'}
                </p>
                {staticDemo && (
                  <p className="demo-example">
                    <strong>Example favorites</strong>
                    <span>Taylor Swift · Billie Eilish · Olivia Rodrigo</span>
                    <small>Try a five-minute song to share, then save a family memory.</small>
                  </p>
                )}
                <div className="bridge-start">
                  <label htmlFor="heritage-choice">
                    {staticDemo
                      ? 'Choose a heritage for the sample'
                      : 'Which heritage would you like to share?'}
                  </label>
                  <select
                    id="heritage-choice"
                    value={targetCollection}
                    onChange={(e) => setTargetCollection(e.target.value as CollectionId)}
                  >
                    {library.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.subtitle}
                      </option>
                    ))}
                  </select>
                  <button
                    className="primary"
                    onClick={() =>
                      startBridge(
                        library.find((c) => c.id === targetCollection)!,
                        staticDemo ? 'pop' : undefined,
                        staticDemo,
                      )
                    }
                  >
                    {staticDemo ? 'Start the guided demo' : 'Find our starting point'}{' '}
                    <ArrowRight size={18} />
                  </button>
                </div>
                {!staticDemo && mode !== 'unavailable' && (
                  <div className="home-examples" aria-label="See an example bridge">
                    {(mode === 'live' || staticDemo) && (
                      <button
                        className="secondary moment-demo"
                        onClick={() =>
                          startBridge(
                            library.find((c) => c.id === targetCollection)!,
                            'pop',
                            true,
                          )
                        }
                      >
                        <span>
                          <strong>Try a five-minute listening plan</strong>
                          <small>
                            {staticDemo
                              ? '1. Sample favorites → 2. Checked plan → 3. Choices → 4. Album'
                              : 'Example pop tastes · editable situation · live agent + Qloo'}
                          </small>
                        </span>
                        <ArrowRight size={18} />
                      </button>
                    )}
                    <p className="eyebrow">
                      {mode === 'live' ? 'SEE IT WITH AN EXAMPLE LISTENER' : 'TAKE A LOOK FIRST'}
                    </p>
                    {mode === 'live' ? (
                      exampleListeners.map((p) => (
                        <button
                          className="example-listener"
                          key={p.id}
                          onClick={() =>
                            startBridge(
                              library.find((c) => c.id === targetCollection)!,
                              p.id,
                            )
                          }
                        >
                          <span>
                            <strong>{p.label}</strong>
                            <small>{p.names.join(' · ')}</small>
                          </span>
                          <ArrowRight size={18} />
                        </button>
                      ))
                    ) : (
                      <button
                        className="text-link"
                        onClick={() =>
                          startBridge(
                            library.find((c) => c.id === targetCollection)!,
                            'fixture',
                          )
                        }
                      >
                        See a sample bridge <ArrowRight size={16} />
                      </button>
                    )}
                    <p className="hint">
                      {mode === 'live'
                        ? 'Example tastes → your selected heritage. Ranked by Qloo; recent results may be reused.'
                        : 'Fixed example choices. This preview does not use Qloo.'}
                    </p>
                  </div>
                )}
                {staticDemo && (
                  <p className="demo-provider-role">
                    <strong>In the full app:</strong> Gemini checks the activity plan. Qloo Insights
                    API v2 ranks choices from their favorites.
                  </p>
                )}
                <a className="text-link browse-link" href="#collections">
                  {staticDemo
                    ? 'Or browse 90 films & songs across 9 collections'
                    : 'Browse the collections'}{' '}
                  <ArrowRight size={16} />
                </a>
                {!staticDemo && <p className="handwritten">For the stories you want to pass on.</p>}
              </div>
              <figure className="memory-illustration">
                <img
                  src={import.meta.env.BASE_URL + 'images/shared-memories.png'}
                  alt="An illustration of two generations sharing a cassette beside an open family album"
                />
                <figcaption>Something familiar. Something to share.</figcaption>
              </figure>
            </section>
            <section
              id="collections"
              className="collection-shelf"
              aria-labelledby="collections-title"
            >
              <div className="shelf-heading">
                <div>
                  <p className="eyebrow">THE COLLECTIONS</p>
                  <h2 id="collections-title">Start somewhere close to home.</h2>
                </div>
                <p>
                  {staticDemo ? 'Nine small collections.' : 'Three small collections.'}
                  <br />
                  Take them at your own pace.
                </p>
              </div>
              <div className="collection-covers">
                {library.map((c, i) => (
                  <article className={'collection-cover ' + c.id} key={c.id}>
                    <Link href={'/collections/' + c.slug}>
                      <div className="cover-top">
                        <span>COLLECTION 0{i + 1}</span>
                        <span>{c.workIds.length} things to discover</span>
                      </div>
                      <div className="cover-middle">
                        <span
                          className="cover-script"
                          lang={
                            {
                              hindi: 'hi',
                              tamil: 'ta',
                              mexican: 'es',
                              french: 'fr',
                              british: 'en',
                              usa: 'en',
                              japanese: 'ja',
                              korean: 'ko',
                              italian: 'it',
                            }[c.id]
                          }
                        >
                          {c.script}
                        </span>
                        <h3>{c.title}</h3>
                        <p>{c.subtitle}</p>
                      </div>
                      <div className="cover-bottom">
                        <span>Open the collection</span>
                        <ArrowRight size={21} />
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
              <p className="shelf-footnote">
                Chosen by hand, with official places to watch and listen. No favorites needed to
                begin.
              </p>
            </section>
            <section className="album-invitation">
              <BookOpen size={32} strokeWidth={1} />
              <div>
                <h2>Make a little room for memories.</h2>
                <p>
                  Save a film. Write down what a song reminded you of. Your album grows with you.
                </p>
              </div>
              <Link className="text-link" href="/album">
                Open our album <ArrowRight size={17} />
              </Link>
            </section>
          </>
        )}
        {collection && (
          <>
            <Link className="back-link" href="/explore">
              <ArrowLeft size={15} />
              All collections
            </Link>
            <section className="collection-opening">
              <div>
                <p className="eyebrow">
                  {collection.subtitle} · {collection.workIds.length} ENTRIES
                </p>
                <h1>{collection.title}</h1>
                <p className="collection-lead">{collection.introduction}</p>
                <p className="audience">{collection.audience}</p>
                <button
                  className="primary"
                  onClick={() =>
                    startBridge(collection, staticDemo ? 'pop' : undefined, staticDemo)
                  }
                >
                  {staticDemo ? 'Try a sample bridge' : 'Find my starting point'}{' '}
                  <ArrowRight size={16} />
                </button>
                <p className="hint">
                  Start with their favorites. Find something from your world to share.
                </p>
              </div>
              <label className="collection-memory">
                <span className="handwritten">A memory to bring along</span>
                <textarea
                  maxLength={800}
                  value={local.notes[collection.id] ?? ''}
                  onChange={(e) => note(collection.id, e.target.value)}
                  placeholder="A song your mum played. A film you watched every summer…"
                />
                <small>Just for your family. Kept on this device.</small>
              </label>
            </section>
            <div className="sequence-heading">
              <h2>A few good places to begin</h2>
              <span>In our suggested order</span>
            </div>
            <div className="collection-controls">
              <div className="feedback-options" role="group" aria-label="Collection format">
                {(
                  [
                    ['all', 'Everything'],
                    ['movie', 'Films'],
                    ['artist', 'Music'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    aria-pressed={format === value}
                    onClick={() => setFormat(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label>
                Find in this collection
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="A film, song or artist…"
                />
              </label>
            </div>
            <div className="editorial-works">
              {collectionWorks(collection)
                .filter(
                  (w) =>
                    (format === 'all' || w.kind === format) &&
                    [w.name, w.entry ?? '', ...(w.aliases ?? [])].some((name) =>
                      name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
                    ),
                )
                .map((w) => (
                  <article className={'editorial-work ' + w.kind} key={w.id}>
                    <div className="work-index">
                      <span>{String(collection.workIds.indexOf(w.id) + 1).padStart(2, '0')}</span>
                      {w.kind === 'movie' ? (
                        <Film size={21} strokeWidth={1} />
                      ) : (
                        <Music2 size={21} strokeWidth={1} />
                      )}
                    </div>
                    <div className="editorial-work-body">
                      <p className="eyebrow">
                        {w.kind === 'movie' ? 'WATCH' : 'LISTEN'} · {w.language}
                        {w.year ? ' · ' + w.year : ''}
                      </p>
                      <h3>
                        <Link href={'/works/' + w.id}>{w.entry || w.name}</Link>
                      </h3>
                      {w.entry && (
                        <p className="artist-credit">
                          {w.id === 'hindi-udit' ? 'Udit Narayan & Lata Mangeshkar' : w.name}
                        </p>
                      )}
                      <p>{w.description}</p>
                      <div className="editorial-actions">
                        <Link className="text-link" href={'/works/' + w.id}>
                          Explore this {w.kind === 'movie' ? 'film' : 'song'}{' '}
                          <ArrowRight size={16} />
                        </Link>
                        {saveButton(w)}
                      </div>
                    </div>
                  </article>
                ))}
            </div>
            {!collectionWorks(collection).some(
              (w) =>
                (format === 'all' || w.kind === format) &&
                [w.name, w.entry ?? '', ...(w.aliases ?? [])].some((name) =>
                  name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
                ),
            ) && (
              <p role="status" className="hint">
                No entries match. Try another name or choose Everything.
              </p>
            )}
            <details className="curator-note">
              <summary>About this collection</summary>
              <p>{collection.rationale}</p>
              <small>
                Edition {collection.version} · Sources reviewed {collection.reviewed}. Content
                suitability and access vary; check each work before sharing.
              </small>
            </details>
          </>
        )}
        {work &&
          (() => {
            const c = library.find((c) => c.id === work.collection)!;
            const f = local.feedback[work.id] ?? {};
            const choiceOrigin = origin?.id === work.id ? origin.value : 'editorial';
            return (
              <>
                <Link className="back-link" href={'/collections/' + c.slug}>
                  <ArrowLeft size={15} />
                  {c.title}
                </Link>
                <article className="work-page">
                  <div className="work-page-main">
                    <p className="eyebrow">
                      {work.kind === 'movie' ? 'A FILM TO SHARE' : 'A SONG TO SHARE'} ·{' '}
                      {work.language}
                      {work.year ? ' · ' + work.year : ''}
                    </p>
                    <h1>{work.entry || work.name}</h1>
                    {work.entry && (
                      <p className="work-credit">
                        {work.id === 'hindi-udit' ? 'Udit Narayan & Lata Mangeshkar' : work.name}
                      </p>
                    )}
                    <p className="work-description">{work.description}</p>
                    {work.runtime && (
                      <p className="hint">
                        Running time: {work.runtime} minutes in the cited edition.
                      </p>
                    )}
                    {work.songDuration && (
                      <p className="hint">
                        Song duration: {formatSongDuration(work.songDuration.durationMs)} (rounded
                        up to the next second). Edition: {work.songDuration.edition}.{' '}
                        <a
                          href={work.songDuration.source}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Duration source
                        </a>{' '}
                        · checked {work.songDuration.checked}. Allow extra time for access, ads and
                        conversation.
                      </p>
                    )}
                    <div className="conversation-card">
                      <span className="handwritten">A question to share</span>
                      <p>
                        {work.conversation ??
                          (work.kind === 'movie'
                            ? 'What did this story remind you of in your own life?'
                            : 'Who would you want to share this song with, and why?')}
                      </p>
                    </div>
                    <p className="shared-step">
                      {work.kind === 'movie'
                        ? 'Watch together, then share what stayed with you.'
                        : 'Listen together, then share what it brought to mind.'}{' '}
                      Save it to your album to keep a memory.
                    </p>
                    <div className="destination-row">
                      <a
                        className="primary destination"
                        href={work.destination}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {work.destinationLabel}
                        <ExternalLink size={16} />
                      </a>
                      {saveButton(work, choiceOrigin)}
                    </div>
                    <p className="availability">
                      Opens the official destination. Access, subtitles and age ratings vary by
                      region. Review the content before sharing.
                    </p>
                    <a
                      className="source-link"
                      href={work.source}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      View factual source <ExternalLink size={12} />
                    </a>
                    <small className="checked">
                      Basic facts and link reviewed {work.checked}. Difficulty and family
                      suitability have not been assessed.
                    </small>
                    {work.sourceReferences?.map((url) => (
                      <a
                        className="source-link"
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Additional factual source <ExternalLink size={12} />
                      </a>
                    ))}
                    {work.releaseYears && (
                      <p className="hint">
                        Sources list different production, premiere or distribution years (
                        {work.releaseYears.join(', ')}). The collection shows the earlier documented
                        year.
                      </p>
                    )}
                  </div>
                  <aside className="moment-note">
                    <p className="handwritten">Leave a little memory here.</p>
                    <label htmlFor="work-note">A note for this shared moment</label>
                    <textarea
                      id="work-note"
                      maxLength={800}
                      value={
                        local.notes[work.id] ??
                        local.saved.find((s) => s.id === work.id)?.note ??
                        ''
                      }
                      onChange={(e) => note(work.id, e.target.value)}
                      placeholder="What did it remind you of? What did you notice together?"
                    />
                    <small>
                      Your words stay on this device. They’re never sent to Qloo or Gemini.
                    </small>
                  </aside>
                </article>
                <section className="feedback-block">
                  <div className="encounter-record">
                    <p className="handwritten">Another page in your story.</p>
                    <h2>Have you shared this one?</h2>
                    <div
                      className="feedback-options"
                      role="group"
                      aria-label="Shared experience status"
                    >
                      <button
                        aria-pressed={local.saved.find((s) => s.id === work.id)?.stage === 'want'}
                        onClick={() =>
                          setLocal((v) => recordExperience(v, work, choiceOrigin, 'want'))
                        }
                      >
                        Want to try
                      </button>
                      <button
                        aria-pressed={local.saved.find((s) => s.id === work.id)?.stage === 'tried'}
                        onClick={() =>
                          setLocal((v) => recordExperience(v, work, choiceOrigin, 'tried'))
                        }
                      >
                        Tried together
                      </button>
                    </div>
                    <p className="hint">
                      Your own record of watching or listening together. Saving and liking never
                      mark it as tried.
                    </p>
                  </div>
                  <p className="eyebrow">AFTER YOU TRY IT</p>
                  <h2>How did it go?</h2>
                  <fieldset>
                    <legend>Did it hold your interest?</legend>
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
                          aria-pressed={f.interest === value}
                          onClick={() => feedback(work, { ...f, interest: value })}
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
                          aria-pressed={f.difficulty === value}
                          onClick={() => feedback(work, { ...f, difficulty: value })}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <p className="hint">
                    {staticDemo
                      ? 'Interest and difficulty are recorded locally in this demo. Feedback does not change the fixed sample order.'
                      : 'Interest and difficulty are separate. Only “Want more like this” adds a positive taste signal.'}
                  </p>
                </section>
                {!staticDemo && publishedWorks.some((w) => w.id === work.id) && (
                  <Connection
                    key={work.id}
                    work={work}
                    mode={mode}
                    local={local}
                    onLike={() => feedback(work, { ...f, interest: 'more' })}
                    onOpen={open}
                    onSave={save}
                  />
                )}
              </>
            );
          })()}
        {path === '/album' && (
          <section className="album-page">
            {staticDemo && (
              <p className="sample-notice">
                Demo album · Your saves and notes stay in this browser. Start with a synthetic
                sample memory or save a choice from your bridge.
              </p>
            )}
            {staticDemo && !local.saved.length && (
              <button
                className="secondary"
                onClick={() =>
                  setLocal((v) => ({
                    ...v,
                    notes: {
                      ...v.notes,
                      'mexican-natalia':
                        'Sample memory: This song made us think about the places we call home.',
                    },
                    saved: [
                      {
                        id: 'mexican-natalia',
                        mode: 'fixture',
                        at: '2026-10-17T00:00:00Z',
                        note: 'Sample memory: This song made us think about the places we call home.',
                        stage: 'tried',
                        triedAt: '2026-10-17T00:00:00Z',
                      },
                    ],
                  }))
                }
              >
                Add a sample album page
              </button>
            )}
            <Album local={local} works={albumWorks} onOpen={open} />
            <Link className="text-link" href="/explore">
              Find something to share <ArrowRight size={16} />
            </Link>
            <button className="clear-album" onClick={() => setClearAlbum(true)}>
              Clear this device’s album and notes
            </button>
          </section>
        )}
        {!home && !collection && !work && path !== '/album' && (
          <section className="not-found">
            <h1>This page isn’t in the album.</h1>
            <Link href="/explore">Explore the collections</Link>
          </section>
        )}
      </main>
      <footer>
        <span className="handwritten">A bridge, one shared moment at a time.</span>
        <span>
          Kinora · Made for the stories between us{' '}
          {staticDemo && (
            <>
              {' '}
              · <a href={import.meta.env.BASE_URL + 'licenses.txt'}>Licenses &amp; credits</a>
            </>
          )}
        </span>
        <details className="browser-assistant">
          <summary>
            Browser assistant ·{' '}
            {webMCPStatus === 'ready'
              ? 'WebMCP connected'
              : webMCPStatus === 'checking'
                ? 'checking support'
                : 'WebMCP unavailable here'}
          </summary>
          <p>
            {staticDemo
              ? 'A compatible browser assistant can inspect public catalogue facts, prepare a sample request, show local duration checks and reopen the sample bridge. You confirm before fixed sample choices appear. No Qloo or Gemini call runs. Album notes are not exposed as tools.'
              : 'A compatible browser assistant can inspect the collection, prepare a request, ask for a plan and reopen your bridge. You confirm the plan before Qloo ranks choices. Album notes are not exposed as tools.'}
          </p>
          {webMCPStatus !== 'ready' && (
            <p>
              Use the regular controls in this browser. WebMCP requires a browser with the
              experimental API enabled.
            </p>
          )}
        </details>
      </footer>
      {clearAlbum && (
        <Modal title="Clear this device’s album?" onClose={() => setClearAlbum(false)}>
          <h2>Clear this device’s album?</h2>
          <p>
            This removes saved choices, memories and feedback from this browser. It cannot be
            undone.
          </p>
          <div className="dialog-actions">
            <button className="secondary" onClick={() => setClearAlbum(false)}>
              Keep my album
            </button>
            <button
              className="primary"
              onClick={() => {
                setLocal(emptyLocal);
                setClearAlbum(false);
              }}
            >
              Clear album and notes
            </button>
          </div>
        </Modal>
      )}
      {personalize && (
        <StartingPoint
          key={bridgeGeneration}
          draft={bridgeDraft}
          setDraft={setBridgeDraft}
          initialMoment={initialMoment}
          exampleIds={exampleIds}
          setExampleIds={setExampleIds}
          initialExample={initialExample}
          collection={personalize}
          mode={mode}
          local={local}
          favorites={favorites}
          setFavorites={setFavorites}
          onClose={() => setPersonalize(undefined)}
          onOpen={open}
          onSave={save}
        />
      )}
    </div>
  );
}
