import { albumWorks, library, publishedWorks, type EditorialCollection } from './library';
import { extraDemoLibrary, extraDemoWorks } from './demo-expansion';

// The expanded shelves are reviewed editorial samples, with no claim of live Qloo identity coverage.
export const demoLibrary = [...library, ...extraDemoLibrary];
export const demoWorks = [...publishedWorks, ...extraDemoWorks];
export const demoAlbumWorks = [...albumWorks, ...extraDemoWorks];
export function demoCollectionWorks(collection: EditorialCollection) {
  return collection.workIds.flatMap((id) => demoWorks.filter((w) => w.id === id));
}
