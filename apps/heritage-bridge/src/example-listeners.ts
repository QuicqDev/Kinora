import type { Favorite } from '../shared/types';

export const exampleListeners = [
  { id: 'pop', label: 'Pop favorites', names: ['Taylor Swift', 'Billie Eilish', 'Olivia Rodrigo'] },
  {
    id: 'instrumental',
    label: 'Cinematic & calm',
    names: ['Hans Zimmer', 'Ludovico Einaudi', 'Enya'],
  },
] as const;
export type ExampleListener = (typeof exampleListeners)[number]['id'];

// Reuse signed search identities; never guess an ambiguous match.
export async function resolveExample(
  id: ExampleListener,
  signal: AbortSignal,
  request: typeof fetch = fetch,
): Promise<Favorite[]> {
  const profile = exampleListeners.find((p) => p.id === id)!;
  const favorites: Favorite[] = [];
  for (const name of profile.names) {
    signal.throwIfAborted();
    const response = await request(`/api/search?q=${encodeURIComponent(name)}&kind=artist`, {
      signal,
    });
    if (!response.ok) throw Error('Example search unavailable');
    const data = await response.json();
    const matches = Array.isArray(data.matches)
      ? data.matches.filter(
          (f: Favorite) => f.kind === 'artist' && f.name?.toLowerCase() === name.toLowerCase(),
        )
      : [];
    if (matches.length !== 1) throw Error('Example identity needs confirmation');
    favorites.push(matches[0]);
  }
  signal.throwIfAborted();
  return favorites;
}
