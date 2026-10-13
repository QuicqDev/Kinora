import type { Collection, Favorite } from './types';
export const collections: Collection[] = [
  {
    id: 'hindi',
    name: 'Hindi',
    subtitle: 'Cinema & music',
    script: 'कहानियाँ',
    scope:
      'A small selection of Hindi-language films and listening entry points. One window into a much wider world.',
    version: '2026-10-04.2',
  },
  {
    id: 'tamil',
    name: 'Tamil',
    subtitle: 'Cinema & music',
    script: 'கதைகள்',
    scope:
      'A small selection of Tamil-language films and listening entry points, across generations.',
    version: '2026-10-04.2',
  },
  {
    id: 'mexican',
    name: 'Mexican',
    subtitle: 'Cinema & music',
    script: 'historias',
    scope: 'A small selection of Mexican films and music, with language checked at the work level.',
    version: '2026-10-04.2',
  },
];
export const exampleFavorites: Favorite[] = [
  {
    id: 'fixture-spiderverse',
    name: 'Spider-Man: Into the Spider-Verse',
    kind: 'movie',
    subtitle: '2018 · Animated film',
  },
  { id: 'fixture-aurora', name: 'AURORA', kind: 'artist', subtitle: 'Norwegian singer-songwriter' },
  {
    id: 'fixture-percy',
    name: 'The Lightning Thief',
    kind: 'book',
    subtitle: 'Rick Riordan · 2005',
  },
  { id: 'fixture-paddington', name: 'Paddington 2', kind: 'movie', subtitle: '2017 · Film' },
  { id: 'fixture-coldplay', name: 'Coldplay', kind: 'artist', subtitle: 'British band' },
  { id: 'fixture-hobbit', name: 'The Hobbit', kind: 'book', subtitle: 'J. R. R. Tolkien · 1937' },
];
