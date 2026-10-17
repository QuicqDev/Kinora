import { staticDemo } from './demo-mode';
import * as live from '../shared/library';
import * as demo from '../shared/demo-catalogue';
import { collections as liveCollections } from '../shared/collections';
export type { EditorialCollection } from '../shared/library';
export const library = staticDemo ? demo.demoLibrary : live.library;
export const publishedWorks = staticDemo ? demo.demoWorks : live.publishedWorks;
export const albumWorks = staticDemo ? demo.demoAlbumWorks : live.albumWorks;
export const collectionWorks = staticDemo ? demo.demoCollectionWorks : live.collectionWorks;
export const collections = staticDemo
  ? library.map((c) => ({
      id: c.id,
      name: c.id === 'usa' ? 'US' : c.id[0].toUpperCase() + c.id.slice(1),
    }))
  : liveCollections;
