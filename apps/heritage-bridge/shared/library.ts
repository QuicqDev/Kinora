import { catalog } from './catalogue-data';
import type { CollectionId, Work } from './types';

export const libraryVersion = '2026-10-13.1';
export interface EditorialCollection {
  id: CollectionId;
  slug: string;
  title: string;
  subtitle: string;
  script: string;
  introduction: string;
  audience: string;
  rationale: string;
  workIds: string[];
  version: string;
  reviewed: string;
}
export const library: EditorialCollection[] = [
  {
    id: 'hindi',
    slug: 'hindi-stories-to-pass-on',
    title: 'Stories to pass on',
    subtitle: 'Hindi cinema & music',
    script: 'कहानियाँ',
    introduction:
      'A cricket field, a train journey, a wedding song. Start with Hindi films and music that leave plenty to talk about together.',
    audience: 'For an evening of sporting ambition, family expectations or familiar film songs.',
    rationale:
      'Begin with Iqbal’s sporting ambition, pause for a duet, then explore the film behind it. The wider shelf follows school, travel, family and personal ambition, with eight listening entries for a shorter shared moment. This sequence is an editorial invitation, not a taste ranking.',
    workIds: ['hindi-iqbal', 'hindi-udit', 'hindi-ddlj', 'hindi-candidate-8', 'hindi-candidate-12'],
    version: libraryVersion,
    reviewed: '2026-10-04',
  },
  {
    id: 'tamil',
    slug: 'a-first-tamil-film-night',
    title: 'A first Tamil film night',
    subtitle: 'Tamil cinema & music',
    script: 'கதைகள்',
    introduction:
      'Homecomings, village life and songs to linger with. A small shelf of Tamil cinema and music, ready to explore at your own pace.',
    audience: 'For people drawn to homecoming stories, everyday communities and music-led detours.',
    rationale:
      'Meiyazhagan opens with a return home. Songs provide a change of pace between village politics, childhood stories, family change and romance. The order is editorial; the works have not been age-suitability assessed.',
    workIds: [
      'tamil-meiyazhagan',
      'tamil-harris',
      'tamil-mandela',
      'tamil-candidate-9',
      'tamil-candidate-11',
      'tamil-candidate-15',
    ],
    version: libraryVersion,
    reviewed: '2026-10-04',
  },
  {
    id: 'mexican',
    slug: 'mexican-stories-of-home',
    title: 'The places we carry',
    subtitle: 'Mexican cinema & music',
    script: 'historias',
    introduction:
      'A town trying to hold together, music carried across a border, and songs worth sitting with. Mexican stories of home, movement and belonging.',
    audience:
      'For viewers and listeners curious about community, migration and personal stories. Some films include mature themes.',
    rationale:
      'A community comedy opens the collection, followed by Natalia Lafourcade. The wider shelf moves through family, migration, folklore and growing up, with eight listening entries. These are editorial choices, not a definition of Mexican culture.',
    workIds: [
      'mexican-seduction',
      'mexican-natalia',
      'mexican-here',
      'mexican-candidate-4',
      'mexican-candidate-11',
      'mexican-candidate-14',
    ],
    version: libraryVersion,
    reviewed: '2026-10-04',
  },
];
for (const collection of library) {
  const extra = catalog.filter(
    (w) =>
      w.collection === collection.id &&
      w.metadataStatus === 'reviewed' &&
      !collection.workIds.includes(w.id),
  );
  collection.workIds.push(...extra.map((w) => w.id));
  collection.reviewed = '2026-10-06';
}
export function collectionWorks(collection: EditorialCollection): Work[] {
  return collection.workIds.flatMap((id) => {
    const work = catalog.find(
      (w) => w.id === id && w.metadataStatus === 'reviewed' && w.source && w.destination,
    );
    return work ? [work] : [];
  });
}
export const publishedWorks = library.flatMap(collectionWorks);
// Keep older reviewed album entries readable, even when omitted from the current editorial edition.
export const albumWorks = catalog.filter((w) => w.metadataStatus === 'reviewed');
export function validateLibrary(collections = library) {
  const errors: string[] = [];
  const slugs = new Set<string>();
  for (const c of collections) {
    if (slugs.has(c.slug)) errors.push(`Duplicate slug: ${c.slug}`);
    slugs.add(c.slug);
    if (!c.introduction || !c.rationale || !c.version || !c.reviewed)
      errors.push(`Incomplete collection: ${c.id}`);
    if (!c.workIds.length) errors.push(`Empty collection: ${c.id}`);
    const destinations = new Set<string>();
    const ids = new Set<string>();
    for (const id of c.workIds) {
      const w = catalog.find((w) => w.id === id);
      if (ids.has(id)) errors.push(`Duplicate work: ${id}`);
      ids.add(id);
      if (
        !w ||
        w.collection !== c.id ||
        w.metadataStatus !== 'reviewed' ||
        !w.checked ||
        !w.source ||
        !w.destination ||
        !w.language ||
        !w.destinationLabel
      ) {
        errors.push(`Unreviewed or invalid work: ${id}`);
        continue;
      }
      if (destinations.has(w.destination)) errors.push(`Duplicate destination in ${c.id}: ${id}`);
      destinations.add(w.destination);
      for (const url of [w.source, w.destination]) {
        try {
          if (new URL(url).protocol !== 'https:') errors.push(`Unsafe URL: ${id}`);
        } catch {
          errors.push(`Invalid URL: ${id}`);
        }
      }
      if (
        w.songDuration &&
        (w.kind !== 'artist' ||
          !w.entry ||
          !Number.isInteger(w.songDuration.durationMs) ||
          w.songDuration.durationMs <= 0 ||
          w.songDuration.destination !== w.destination ||
          !w.songDuration.source.startsWith('https://itunes.apple.com/lookup?') ||
          !w.songDuration.edition ||
          !w.songDuration.checked)
      )
        errors.push(`Invalid song duration: ${id}`);
    }
  }
  return errors;
}
