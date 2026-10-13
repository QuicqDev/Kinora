import { createHash } from 'node:crypto';
import type { Favorite, Work } from '../shared/types';
import { candidates } from './policy';
import { config } from './config';
import { checkpoint } from './execution';
import { Qloo, ServiceError, type Envelope } from './qloo';
import type { PrivateState } from './state';

export const normalizeName = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
export const identityKey = (work: Work) =>
  'identity:' +
  createHash('sha256')
    .update(
      JSON.stringify([
        config.qlooServer,
        work.id,
        work.name,
        work.kind,
        work.year,
        work.source,
        work.aliases,
        work.releaseYears,
      ]),
    )
    .digest('hex');
export function catalogueMatch(reply: Envelope, work: Work): Favorite | undefined {
  if (!['ok', 'needs_input', 'partial'].includes(reply.status)) return undefined;
  const names = [work.name, ...(work.aliases ?? [])].map(normalizeName);
  const matches = candidates(reply, work.kind).filter(
    (f) =>
      names.includes(normalizeName(f.name)) &&
      (work.kind === 'artist' ||
        [work.year, ...(work.releaseYears ?? [])].some((year) => f.subtitle === String(year))),
  );
  return matches.length === 1 ? matches[0] : undefined;
}
export class IdentityResolver {
  private cache = new Map<string, { value: Work; until: number }>();
  private pending = new Map<string, Promise<Work | undefined>>();
  constructor(
    private qloo: Pick<Qloo, 'call'>,
    private charge: () => void,
    private state?: PrivateState,
  ) {}
  resolve(work: Work, signal?: AbortSignal): Promise<Work | undefined> {
    checkpoint(signal);
    const key = identityKey(work);
    const cached = this.cache.get(key);
    if (cached && cached.until > Date.now()) return Promise.resolve(cached.value);
    // Cancellable jobs must not share another browser's cancellation signal.
    if (signal) return this.lookup(key, work, signal);
    const existing = this.pending.get(key);
    if (existing) return existing;
    const job = this.lookup(key, work).finally(() => this.pending.delete(key));
    this.pending.set(key, job);
    return job;
  }
  private async lookup(key: string, work: Work, signal?: AbortSignal) {
    checkpoint(signal);
    const persisted = this.state?.get(key) as { reply?: Envelope } | undefined;
    if (persisted?.reply) {
      const match = catalogueMatch(persisted.reply, work);
      if (match?.qlooId) {
        const value = { ...work, qlooId: match.qlooId };
        // Preserve the persisted expiry; do not renew it just by reading.
        return value;
      }
      return undefined;
    }
    checkpoint(signal);
    this.charge();
    const reply = await this.qloo.call(
      'qloo_describe',
      { entity: work.name, type: work.kind },
      signal,
    );
    checkpoint(signal);
    if (reply.status === 'error')
      throw new ServiceError(reply.error?.code ?? 'QLOO_ERROR', reply.error?.retryable);
    this.state?.set(key, { reply }, 7 * 24 * 60 * 60_000);
    const match = catalogueMatch(reply, work);
    if (!match?.qlooId) return undefined;
    // Ambiguity is resolved by the catalogue's sourced name AND release year.
    // Multiple matching identities remain unresolved; popularity never breaks ties.
    const value = { ...work, qlooId: match.qlooId };
    this.cache.set(key, { value, until: Date.now() + 7 * 24 * 60 * 60_000 });
    return value;
  }
}
