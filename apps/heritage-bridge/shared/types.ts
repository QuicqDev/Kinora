export const liveCollectionIds = ['hindi', 'tamil', 'mexican'] as const;
export const collectionIds = [
  ...liveCollectionIds,
  'french',
  'british',
  'usa',
  'japanese',
  'korean',
  'italian',
] as const;
export type LiveCollectionId = (typeof liveCollectionIds)[number];
export type CollectionId = (typeof collectionIds)[number];
export type Kind = 'movie' | 'artist' | 'book';
export type Mode = 'fixture' | 'live' | 'unavailable';
export type ChoiceOrigin = Mode | 'editorial';
export interface ConnectionRequest {
  seedId: string;
  liked: true;
  collection: CollectionId;
  kind: 'movie' | 'artist';
  excluded: string[];
}
export type Status = 'ok' | 'empty' | 'needs_input' | 'partial' | 'degraded' | 'error';
export interface Favorite {
  id: string;
  name: string;
  kind: Kind;
  subtitle: string;
  qlooId?: string;
  token?: string;
}
export interface Collection {
  id: CollectionId;
  name: string;
  subtitle: string;
  script: string;
  scope: string;
  version: string;
}
export interface Work {
  id: string;
  collection: CollectionId;
  name: string;
  kind: 'movie' | 'artist';
  year?: number;
  aliases?: string[];
  releaseYears?: number[];
  sourceReferences?: string[];
  runtime?: number;
  songDuration?: {
    durationMs: number;
    title: string;
    artist: string;
    edition: string;
    source: string;
    destination: string;
    checked: string;
  };
  conversation?: string;
  language?: string;
  entry?: string;
  description: string;
  source?: string;
  destination?: string;
  destinationLabel?: string;
  checked?: string;
  qlooId?: string;
  metadataStatus: 'reviewed' | 'pending';
  color: string;
}
export interface Feedback {
  interest?: 'more' | 'no' | 'untried';
  difficulty?: 'comfortable' | 'help' | 'difficult';
}
export interface DiscoveryRequest {
  collection: CollectionId;
  favorites: Favorite[];
  feedback: Record<string, Feedback>;
  easier: boolean;
  tried?: string[];
  activity?: ActivityConstraint;
}
export interface ActivityConstraint {
  kind: 'movie' | 'artist';
  maxMinutes: number | null;
}
export interface ActivityPlan {
  status: 'ready' | 'needs_input';
  message: string;
  activity?: ActivityConstraint;
  eligibleCount?: number;
  checks: string[];
}
export interface Discovery {
  activity?: ActivityConstraint;
  mode: Mode;
  status: Status;
  message: string;
  works: Work[];
  evidence: { source: string; signals: string[]; at: string; collectionVersion: string };
  explanation?: string;
}
