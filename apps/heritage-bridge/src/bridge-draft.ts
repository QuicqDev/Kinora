import type { ActivityPlan, CollectionId, Discovery } from '../shared/types';

// Kept in App state for this visit, never sent to storage or album notes.
export interface BridgeDraft {
  collection: CollectionId;
  brief: string;
  plan?: ActivityPlan;
  result?: Discovery;
}
export function startDraft(
  previous: BridgeDraft,
  collection: CollectionId,
  fresh = false,
): BridgeDraft {
  return !fresh && previous.collection === collection ? previous : { collection, brief: '' };
}
