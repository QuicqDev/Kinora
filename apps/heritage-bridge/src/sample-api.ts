import { exampleFavorites } from '../shared/collections';
import { activityExamples, fitsActivity } from '../shared/activity';
import { libraryVersion } from '../shared/library';
import { demoLibrary as library, demoWorks as publishedWorks } from '../shared/demo-catalogue';
import type {
  ActivityPlan,
  CollectionId,
  Discovery,
  DiscoveryRequest,
  Favorite,
} from '../shared/types';

// Synthetic listeners, public catalogue facts. No captured provider replies or user records.
export const samplePop: Favorite[] = ['Taylor Swift', 'Billie Eilish', 'Olivia Rodrigo'].map(
  (name, i) => ({
    id: `sample-pop-${i}`,
    name,
    kind: 'artist',
    subtitle: 'Synthetic listener favorite · sample identity',
  }),
);
export const sampleFavorites = [
  ...exampleFavorites,
  ...samplePop,
  ...['Hans Zimmer', 'Ludovico Einaudi', 'Enya'].map((name, i): Favorite => ({
    id: `sample-calm-${i}`,
    name,
    kind: 'artist',
    subtitle: 'Synthetic listener favorite · sample identity',
  })),
];

export function samplePlan(collection: CollectionId, brief: string): ActivityPlan {
  const examples = activityExamples(collection, publishedWorks);
  if (!examples.includes(brief.trim()))
    return {
      status: 'needs_input',
      message:
        'This guided demo supports only the sample requests below. It cannot interpret a custom request. Choose a sample to continue; no Gemini call was made.',
      checks: ['Custom input was not interpreted or silently relaxed.'],
    };
  const activity = brief.includes('song')
    ? { kind: 'artist' as const, maxMinutes: 5 }
    : { kind: 'movie' as const, maxMinutes: Number(brief.match(/at most (\d+)/)?.[1]) };
  const pool = publishedWorks.filter(
    (w) => w.collection === collection && fitsActivity(w, activity),
  );
  return {
    status: pool.length ? 'ready' : 'needs_input',
    activity,
    eligibleCount: pool.length,
    message:
      'Sample activity plan, checked locally against the reviewed catalogue. This is a guided example, not a freshly generated Gemini plan.',
    checks: [
      `Selected collection: ${library.find((c) => c.id === collection)!.subtitle}.`,
      `Playback limit: ${activity.maxMinutes} minutes. ${pool.length} reviewed ${activity.kind === 'artist' ? 'starting recordings' : 'films'} fit before your exclusions.`,
      activity.kind === 'artist'
        ? 'Exact recording durations are compared in milliseconds. Unknown durations and over-limit works are excluded.'
        : 'Reviewed film runtimes are compared with the playback limit. Unknown durations and over-limit films are excluded.',
      'Playback excludes access time, ads and conversation. Sources are linked on each detail page.',
    ],
  };
}

export function sampleDiscovery(input: DiscoveryRequest): Discovery {
  const known =
    input.favorites.length === 3 &&
    new Set(input.favorites.map((f) => f.id)).size === 3 &&
    input.favorites.every((f) => sampleFavorites.some((s) => s.id === f.id && s.name === f.name));
  const pool = publishedWorks.filter(
    (w) =>
      w.collection === input.collection &&
      (!input.activity || fitsActivity(w, input.activity)) &&
      !input.tried?.includes(w.id) &&
      !['no', 'more'].includes(input.feedback[w.id]?.interest ?? ''),
  );
  const works = known ? pool.slice(0, 3) : [];
  return {
    mode: 'fixture',
    status: !known ? 'needs_input' : works.length ? 'ok' : 'empty',
    works,
    activity: input.activity,
    message: !known
      ? 'Choose three supported sample favorites. Custom personalization is unavailable in this demo.'
      : works.length
        ? 'Sample ranked choices: fixed editorial order within your selected collection and playback limit. Favorites do not change this order. No Qloo or Gemini request was made.'
        : 'No reviewed sample choices meet this plan after exclusions. The playback limit has not been relaxed.',
    explanation:
      'Positions 01–03 illustrate the ranking interface. These positions are editorial examples, not recorded or newly executed Qloo rankings.',
    evidence: {
      source: 'Static demo · public reviewed catalogue · editorial order',
      signals: input.favorites.map((f) => f.name),
      at: '2026-10-17T00:00:00Z',
      collectionVersion: library.find((c) => c.id === input.collection)?.version ?? libraryVersion,
    },
  };
}

// The static transport returns local Response objects. It never invokes fetch.
export const sampleRequest: typeof fetch = async (input, init) => {
  init?.signal?.throwIfAborted();
  const url = new URL(String(input), 'https://static.invalid');
  const body = init?.body ? JSON.parse(String(init.body)) : {};
  let data: unknown;
  if (url.pathname === '/api/status') data = { mode: 'fixture' };
  else if (url.pathname === '/api/search')
    data = {
      matches: sampleFavorites.filter(
        (f) =>
          f.kind === url.searchParams.get('kind') &&
          f.name.toLowerCase().includes((url.searchParams.get('q') ?? '').toLowerCase()),
      ),
    };
  else if (url.pathname === '/api/plan') data = samplePlan(body.collection, body.brief);
  else if (url.pathname === '/api/discover') data = sampleDiscovery(body);
  else
    return Response.json(
      { error: 'This action is unavailable in the static demo.' },
      { status: 400 },
    );
  return Response.json(data);
};
