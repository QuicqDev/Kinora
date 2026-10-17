import type { CollectionId, LiveCollectionId, Work } from './types';
import { expansion } from './reviewed-expansion';
import songDurations from './song-durations.json';
// Original short summaries, not copied descriptions. No artwork is redistributed.
// "reviewed" means source + destination identity, NOT family suitability or Qloo coverage.
const reviewed: Work[] = [
  {
    id: 'hindi-iqbal',
    collection: 'hindi',
    name: 'Iqbal',
    kind: 'movie',
    year: 2005,
    language: 'Hindi',
    description:
      'An aspiring cricketer seeks a way onto the field. A sports drama about ambition and the people who help it along.',
    source: 'https://www.zee5.com/movies/details/iqbal/0-0-2383',
    destination: 'https://www.zee5.com/movies/details/iqbal/0-0-2383',
    destinationLabel: 'View on ZEE5',
    checked: '2026-10-04',
    metadataStatus: 'reviewed',
    color: 'sage',
  },
  {
    id: 'hindi-ddlj',
    collection: 'hindi',
    name: 'Dilwale Dulhania Le Jayenge',
    kind: 'movie',
    year: 1995,
    language: 'Hindi',
    description:
      'Raj and Simran meet on a European trip. Their love story unfolds around family expectations and a marriage already arranged.',
    source: 'https://www.yashrajfilms.com/movies/dilwale-dulhania-le-jayenge',
    destination: 'https://www.yashrajfilms.com/movies/dilwale-dulhania-le-jayenge',
    destinationLabel: 'Official trailer & film page',
    checked: '2026-10-04',
    metadataStatus: 'reviewed',
    color: 'ochre',
  },
  {
    id: 'hindi-udit',
    collection: 'hindi',
    name: 'Udit Narayan',
    kind: 'artist',
    language: 'Hindi / Punjabi phrases',
    entry: 'Mehndi Laga Ke Rakhna',
    description:
      'Begin with this duet by Udit Narayan and Lata Mangeshkar from Dilwale Dulhania Le Jayenge.',
    source:
      'https://www.yashrajfilms.com/music/dilwale-dulhania-le-jayenge/mehndi-laga-ke-rakhna-song-lyrics',
    destination: 'https://www.youtube.com/watch?v=7iqNZrEHrLc',
    destinationLabel: 'Listen · official YRF lyric video',
    checked: '2026-10-04',
    metadataStatus: 'reviewed',
    color: 'indigo',
  },
  {
    id: 'tamil-meiyazhagan',
    collection: 'tamil',
    name: 'Meiyazhagan',
    kind: 'movie',
    year: 2024,
    language: 'Tamil',
    description:
      'Returning to his hometown after years away, a man reconnects with a relative he struggles to remember.',
    source: 'https://www.netflix.com/hk-en/title/81713677',
    destination: 'https://www.youtube.com/watch?v=YGJOcMtnG1Q',
    destinationLabel: 'Watch official Netflix trailer',
    checked: '2026-10-04',
    metadataStatus: 'reviewed',
    color: 'sage',
  },
  {
    id: 'tamil-mandela',
    collection: 'tamil',
    name: 'Mandela',
    kind: 'movie',
    year: 2021,
    language: 'Tamil',
    description:
      'A village barber becomes the focus of rival political groups when an election comes down to his vote.',
    source: 'https://www.netflix.com/ad-en/title/81272107',
    destination: 'https://www.netflix.com/title/81272107',
    destinationLabel: 'View film on Netflix',
    checked: '2026-10-04',
    metadataStatus: 'reviewed',
    color: 'ochre',
  },
  {
    id: 'tamil-harris',
    collection: 'tamil',
    name: 'Harris Jayaraj',
    kind: 'artist',
    language: 'Tamil',
    entry: 'Nenjukkul Peidhidum',
    description:
      'A listening entry from Vaaranam Aayiram, composed by Harris Jayaraj with vocals by Hariharan, Devan Ekambaram and V.V. Prassanna.',
    source: 'https://www.youtube.com/watch?v=FzLpP8VBC6E',
    destination: 'https://www.youtube.com/watch?v=FzLpP8VBC6E',
    destinationLabel: 'Listen · official Sony Music video',
    checked: '2026-10-04',
    metadataStatus: 'reviewed',
    color: 'indigo',
  },
  {
    id: 'mexican-seduction',
    collection: 'mexican',
    name: 'The Great Seduction',
    kind: 'movie',
    year: 2023,
    language: 'Spanish',
    description:
      'A fishing town tries to convince a visiting doctor to stay. A community comedy about a town working together, with a few complications.',
    source: 'https://www.netflix.com/title/81552473',
    destination: 'https://www.netflix.com/title/81552473',
    destinationLabel: 'View film on Netflix',
    checked: '2026-10-04',
    metadataStatus: 'reviewed',
    color: 'ochre',
  },
  {
    id: 'mexican-here',
    collection: 'mexican',
    name: 'I’m No Longer Here',
    kind: 'movie',
    year: 2019,
    language: 'Spanish; includes English',
    description:
      'A teenager from Monterrey is forced to leave home after a gang misunderstanding. Cumbia, migration and belonging shape his story. Includes mature themes.',
    source: 'https://www.netflix.com/st/title/81025595',
    destination: 'https://www.netflix.com/title/81025595',
    destinationLabel: 'View film on Netflix',
    checked: '2026-10-04',
    metadataStatus: 'reviewed',
    color: 'sage',
  },
  {
    id: 'mexican-natalia',
    collection: 'mexican',
    name: 'Natalia Lafourcade',
    kind: 'artist',
    language: 'Spanish',
    entry: 'Hasta la Raíz',
    description: 'Start with the official lyric video for Hasta la Raíz.',
    source: 'https://www.natalialafourcade.com.mx/en/videos/hasta-la-raiz-lyrics-a9mb7',
    destination: 'https://www.youtube.com/watch?v=tLetf-h4Y-w',
    destinationLabel: 'Listen · official artist lyric video',
    checked: '2026-10-04',
    metadataStatus: 'reviewed',
    color: 'indigo',
  },
];
// Frozen candidates for coverage research; never silently promoted to recommendations.
const queue: Record<LiveCollectionId, { movies: string[]; artists: string[] }> = {
  hindi: {
    movies: [
      'Taare Zameen Par',
      'Swades',
      'Lagaan',
      'Dangal',
      'The Lunchbox',
      'Queen',
      'English Vinglish',
      'Chak De! India',
      'Secret Superstar',
      'Piku',
    ],
    artists: [
      'A. R. Rahman',
      'Shreya Ghoshal',
      'Arijit Singh',
      'Lata Mangeshkar',
      'Kishore Kumar',
      'Asha Bhosle',
      'Shankar Mahadevan',
    ],
  },
  tamil: {
    movies: [
      'Kaaka Muttai',
      'Abhiyum Naanum',
      'Mozhi',
      'Rhythm',
      'Anjali',
      'Pasanga',
      'Saivam',
      'Kandukondain Kandukondain',
      'Oh My Kadavule',
      'Kannathil Muthamittal',
    ],
    artists: [
      'A. R. Rahman',
      'Ilaiyaraaja',
      'Anirudh Ravichander',
      'Sid Sriram',
      'Dhee',
      'Chinmayi',
      'S. P. Balasubrahmanyam',
    ],
  },
  mexican: {
    movies: [
      'Macario',
      'Temporada de patos',
      'Güeros',
      'Roma',
      'Los lobos',
      'Tótem',
      'La misma luna',
      'La leyenda de la Nahuala',
      'El Jeremías',
      'Cilantro y perejil',
    ],
    artists: [
      'Julieta Venegas',
      'Café Tacvba',
      'Lila Downs',
      'Carla Morrison',
      'Zoé',
      'Los Ángeles Azules',
      'Silvana Estrada',
    ],
  },
};
const reviewedMore: Record<string, Partial<Work>> = {
  'hindi:Chak De! India': {
    year: 2007,
    language: 'Hindi',
    description:
      'A former player coaches the Indian women’s hockey team. An ensemble sports story about working toward a shared goal.',
    source: 'https://www.yashrajfilms.com/movies/chak-de-india',
    destination: 'https://www.yashrajfilms.com/movies/chak-de-india',
    destinationLabel: 'Official trailer & film page',
  },
  'hindi:Lata Mangeshkar': {
    language: 'Hindi / Punjabi phrases',
    entry: 'Mehndi Laga Ke Rakhna',
    description:
      'An editorial introduction to Lata Mangeshkar through her duet with Udit Narayan from Dilwale Dulhania Le Jayenge.',
    source:
      'https://www.yashrajfilms.com/music/dilwale-dulhania-le-jayenge/mehndi-laga-ke-rakhna-song-lyrics',
    destination: 'https://www.youtube.com/watch?v=7iqNZrEHrLc',
    destinationLabel: 'Listen · official YRF lyric video',
  },
  'hindi:Shreya Ghoshal': {
    language: 'Hindi',
    entry: 'Saans',
    description:
      'Begin with Saans from Jab Tak Hai Jaan, performed by Shreya Ghoshal and Mohit Chauhan, with music by A. R. Rahman.',
    source: 'https://www.yashrajfilms.com/music/jab-tak-hai-jaan/saans-song-lyrics',
    destination: 'https://music.apple.com/us/song/1452223832',
    destinationLabel: 'Listen on Apple Music',
  },
  'tamil:Oh My Kadavule': {
    year: 2020,
    language: 'Tamil',
    description:
      'A romantic comedy starring Ashok Selvan, Ritika Singh and Vani Bhojan. Begin with the official trailer and decide together whether to explore further.',
    source: 'https://www.zee5.com/videos/details/oh-my-kadavule-trailer/0-0-144531',
    destination: 'https://www.youtube.com/watch?v=5lUWBM2uYaQ',
    destinationLabel: 'Watch official Sony Music trailer',
  },
  'tamil:A. R. Rahman': {
    language: 'Tamil',
    entry: 'Munbe Vaa',
    description:
      'Start with Munbe Vaa, composed by A. R. Rahman and sung by Shreya Ghoshal and Naresh Iyer.',
    source: 'https://music.apple.com/us/song/1706006701',
    destination: 'https://music.apple.com/us/song/1706006701',
    destinationLabel: 'Listen on Apple Music',
  },
  'tamil:Dhee': {
    language: 'Tamil',
    entry: 'Enjoy Enjaami',
    description:
      'Begin with Enjoy Enjaami, performed by Dhee and Arivu and produced by Santhosh Narayanan. An editorial entry into Tamil independent music.',
    source: 'https://www.youtube.com/watch?v=eYq7WapuDLU',
    destination: 'https://www.youtube.com/watch?v=eYq7WapuDLU',
    destinationLabel: 'Listen · official maajja music video',
  },
  'mexican:Roma': {
    year: 2018,
    language: 'Spanish / Mixtec',
    description:
      'Alfonso Cuarón’s drama follows a domestic worker and the family she works for in 1970s Mexico City. Includes mature themes; review before sharing.',
    source: 'https://www.netflix.com/title/80240715',
    destination: 'https://www.netflix.com/title/80240715',
    destinationLabel: 'View film on Netflix',
  },
  'mexican:Julieta Venegas': {
    language: 'Spanish',
    entry: 'Limón y Sal',
    description: 'Start with the official music video for Limón y Sal.',
    source: 'https://www.youtube.com/watch?v=tIpzfs5tBJU',
    destination: 'https://www.youtube.com/watch?v=tIpzfs5tBJU',
    destinationLabel: 'Listen · official artist music video',
  },
  'mexican:Carla Morrison': {
    language: 'Spanish',
    entry: 'Disfruto',
    description:
      'Begin with Carla Morrison’s official video for Disfruto. A single, editorially chosen listening entry leaves room to explore the artist together.',
    source: 'https://www.youtube.com/watch?v=_ruEj-XK1lA',
    destination: 'https://www.youtube.com/watch?v=_ruEj-XK1lA',
    destinationLabel: 'Listen · official artist music video',
  },
};
export const catalog: Work[] = [
  ...reviewed,
  ...Object.entries(queue).flatMap(([collection, items]) =>
    [
      ...items.movies.map((name) => ({ name, kind: 'movie' as const })),
      ...items.artists.map((name) => ({ name, kind: 'artist' as const })),
    ].map((w, i): Work => {
      const more = expansion[`${collection}:${w.name}`] ?? reviewedMore[`${collection}:${w.name}`];
      return {
        ...w,
        collection: collection as CollectionId,
        id: `${collection}-candidate-${i + 1}`,
        description:
          'Candidate awaiting source and destination review. Not eligible for recommendations.',
        metadataStatus: more ? 'reviewed' : 'pending',
        color: w.kind === 'artist' ? 'indigo' : 'sage',
        ...more,
        ...(more ? { checked: more.checked ?? '2026-10-04' } : {}),
      };
    }),
  ),
].map((work) => {
  const id = work.destination?.match(/^https:\/\/music\.apple\.com\/us\/song\/(\d+)$/)?.[1];
  const songDuration = id ? (songDurations as Record<string, Work['songDuration']>)[id] : undefined;
  return work.kind === 'artist' && songDuration ? { ...work, songDuration } : work;
});
export function eligibleCatalog(collection: CollectionId) {
  return catalog.filter(
    (w) =>
      w.collection === collection && w.metadataStatus === 'reviewed' && w.source && w.destination,
  );
}
export function coverage() {
  return (['hindi', 'tamil', 'mexican'] as const).map((id) => ({
    collection: id,
    candidates: catalog.filter((w) => w.collection === id).length,
    reviewed: eligibleCatalog(id).length,
    films: catalog.filter((w) => w.collection === id && w.kind === 'movie').length,
    artists: catalog.filter((w) => w.collection === id && w.kind === 'artist').length,
    qlooStatus: 'not-tested',
    resolved: null,
  }));
}
