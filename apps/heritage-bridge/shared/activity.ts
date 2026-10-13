import type { ActivityConstraint, CollectionId, Work } from './types';

// Film runtimes are minutes; song durations belong to the exact linked recording.
export function durationMs(work: Work): number | undefined {
  if (work.kind === 'movie') return work.runtime === undefined ? undefined : work.runtime * 60000;
  return work.entry && work.songDuration && work.songDuration.destination === work.destination
    ? work.songDuration.durationMs
    : undefined;
}
export function fitsActivity(work: Work, activity: ActivityConstraint) {
  const duration = durationMs(work);
  return (
    work.kind === activity.kind &&
    (activity.maxMinutes === null ||
      (duration !== undefined && duration <= activity.maxMinutes * 60000))
  );
}
export function formatSongDuration(ms: number) {
  const seconds = Math.ceil(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
export const shortMoment = 'We want a song lasting at most 5 minutes to share together.';
export function activityExamples(collection: CollectionId, works: Work[]) {
  const pool = works.filter((w) => w.collection === collection);
  const times = pool
    .filter((w) => w.kind === 'movie' && w.runtime)
    .map((w) => w.runtime!)
    .sort((a, b) => a - b);
  const limit = times.length
    ? Math.ceil(times[Math.min(1, times.length - 1)] / 10) * 10
    : undefined;
  return [
    ...(pool.some((w) => fitsActivity(w, { kind: 'artist', maxMinutes: 5 })) ? [shortMoment] : []),
    ...(limit ? [`We want a film for tonight, with at most ${limit} minutes.`] : []),
  ];
}
