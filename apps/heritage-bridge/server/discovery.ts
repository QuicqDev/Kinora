import type { ConnectionRequest, Discovery, DiscoveryRequest, Work } from '../shared/types';
import { library, libraryVersion, publishedWorks } from '../shared/library';
import { checkpoint, requestSignal } from './execution';
import { collections, exampleFavorites } from '../shared/collections';
import { eligibleCatalog } from './catalog';
import { config, mode } from './config';
import {
  Budget,
  cacheKey,
  candidates,
  filterPool,
  validateRanking,
  verifyFavorite,
} from './policy';
import { Qloo, ServiceError, type Envelope } from './qloo';
import { GeminiAgent, type DiscoveryAgent } from './gemini';
import path from 'node:path';
import { appRoot } from './config';
import { PrivateState } from './state';
import { IdentityResolver, identityKey, normalizeName } from './identity';
import { ActivityPlanner, type planRequestSchema } from './planning';
import type { z } from 'zod';
export class DiscoveryService {
  private cache = new Map<string, { until: number; data: Discovery }>();
  private identities: IdentityResolver;
  budget: Budget;
  constructor(
    public qloo: Pick<Qloo, 'call'> = new Qloo(),
    private agent: DiscoveryAgent = new GeminiAgent(),
    private getMode: () => ReturnType<typeof mode> = mode,
    private state = config.mode === 'live' && qloo instanceof Qloo
      ? new PrivateState(path.join(config.stateDir, 'heritage.sqlite'))
      : undefined,
  ) {
    this.budget = new Budget(config.dailyBudget, state);
    this.identities = new IdentityResolver(qloo, this.charge, state);
  }
  private charge = () => this.budget.take();
  async plan(input: z.infer<typeof planRequestSchema>, parent?: AbortSignal) {
    const signal = requestSignal(parent, config.requestTimeout);
    checkpoint(signal);
    if (this.getMode() !== 'live') throw new ServiceError('MISSING_KEYS');
    const pool = publishedWorks.filter(
      (w) => w.collection === input.collection && !input.excluded.includes(w.id),
    );
    return new ActivityPlanner().plan(
      input.brief,
      input.collection,
      pool,
      () => {
        checkpoint(signal);
        this.charge();
      },
      signal,
    );
  }
  private async resolveEligible(work: Work, signal: AbortSignal, onTransient?: () => void) {
    checkpoint(signal);
    try {
      return await this.identities.resolve(work, signal);
    } catch (error) {
      checkpoint(signal);
      if (error instanceof ServiceError && ['QLOO_TIMEOUT', 'QLOO_UPSTREAM'].includes(error.code)) {
        onTransient?.();
        return undefined;
      }
      throw error;
    }
  }
  async warm(collection?: string, parent?: AbortSignal) {
    const signal = requestSignal(parent, config.requestTimeout);
    const works = publishedWorks.filter((w) => !collection || w.collection === collection);
    const matched: string[] = [];
    for (const work of works) if (await this.resolveEligible(work, signal)) matched.push(work.id);
    return {
      reviewed: works.length,
      matched: matched.length,
      unresolved: works.filter((w) => !matched.includes(w.id)).map((w) => w.id),
    };
  }
  async close() {
    this.state?.close();
    if (this.qloo instanceof Qloo) await this.qloo.close();
  }
  async search(query: string, kind: 'movie' | 'artist' | 'book', parent?: AbortSignal) {
    const signal = requestSignal(parent, config.requestTimeout);
    checkpoint(signal);
    if (this.getMode() === 'fixture')
      return {
        status: 'ok',
        mode: 'fixture',
        matches: exampleFavorites.filter(
          (f) => f.kind === kind && f.name.toLowerCase().includes(query.toLowerCase()),
        ),
      };
    if (this.getMode() === 'unavailable') throw new ServiceError('MISSING_KEYS');
    const key = 'search:' + JSON.stringify([config.qlooServer, query.trim(), kind]);
    let result = this.state?.get(key) as Envelope | undefined;
    if (!result) {
      // Reuse a recent real describe response from the private coverage audit.
      // User confirmation is still required, including every ambiguous candidate.
      const work = publishedWorks.find(
        (w) => w.kind === kind && normalizeName(w.name) === normalizeName(query),
      );
      if (work)
        result = (this.state?.get(identityKey(work)) as { reply?: Envelope } | undefined)?.reply;
    }
    if (!result) {
      checkpoint(signal);
      this.charge();
      result = await this.qloo.call('qloo_describe', { entity: query, type: kind }, signal);
      checkpoint(signal);
      if (result.status !== 'error') this.state?.set(key, result, config.cacheMs);
    }
    if (result.status === 'error')
      throw new ServiceError(result.error?.code ?? 'QLOO_ERROR', result.error?.retryable);
    return { status: result.status, mode: 'live', matches: candidates(result, kind) };
  }
  async discover(input: DiscoveryRequest, parent?: AbortSignal): Promise<Discovery> {
    const signal = requestSignal(parent, config.requestTimeout);
    const charge = () => {
      checkpoint(signal);
      this.charge();
    };
    checkpoint(signal);
    const current = this.getMode();
    const key = JSON.stringify([
      'insights-novel-v2',
      config.qlooServer,
      config.model,
      cacheKey(input, current),
    ]);
    const active = library.find((c) => c.id === input.collection)!;
    const evidence = {
      source:
        current === 'fixture'
          ? 'Editorial fixture · no Qloo call'
          : input.activity
            ? `Qloo · bounded ${input.activity.kind} ranking after activity planning`
            : 'Qloo · separate bounded film and artist rankings',
      signals: input.favorites.map((f) => f.name),
      at: new Date().toISOString(),
      collectionVersion: libraryVersion,
    };
    const result = (
      status: Discovery['status'],
      message: string,
      works: Work[] = [],
      extra: Partial<Discovery> = {},
    ): Discovery => ({
      mode: current,
      status,
      message,
      works,
      evidence,
      activity: input.activity,
      ...extra,
    });
    if (current === 'unavailable')
      return result('error', 'Live discovery is not connected yet. Your favorites are preserved.');
    if (current === 'live' && !input.favorites.every(verifyFavorite))
      return result(
        'needs_input',
        'Confirm your favorites in live search before discovering. If the server restarted, search and confirm them again.',
      );
    if (
      current === 'fixture' &&
      !input.favorites.every((f) => exampleFavorites.some((x) => x.id === f.id))
    )
      return result('needs_input', 'Choose three preview favorites to explore fixture mode.');
    if (input.easier)
      return result(
        'empty',
        'We do not yet have verified difficulty metadata for these works. Your interest is kept; try without the easier-to-follow filter.',
      );
    const cached = this.cache.get(key);
    if (cached && cached.until > Date.now()) return cached.data;
    const persisted = this.state?.get('discovery:' + key) as Discovery | undefined;
    if (persisted) return persisted;
    // Fixture favorites use catalogue IDs; live favorites are excluded by verified Qloo IDs below.
    const pool = filterPool(publishedWorks, input).filter(
      (w) => !input.favorites.some((f) => f.id === w.id),
    );
    const expected = input.activity ? (input.activity.kind === 'movie' ? 2 : 1) : 3;
    if (!pool.length)
      return result(
        'empty',
        input.activity
          ? 'No new reviewed choices meet this plan. Edit the activity or time limit; it has not been relaxed.'
          : 'You have excluded every reviewed choice. Update your feedback or revisit the collection.',
      );
    if (current === 'fixture') {
      const choices = [
        ...pool.filter((w) => w.kind === 'movie').slice(0, 2),
        ...pool.filter((w) => w.kind === 'artist').slice(0, 1),
      ];
      return result(
        choices.length === expected ? 'ok' : choices.length ? 'partial' : 'empty',
        choices.length
          ? 'These are fixed editorial examples, not personalized recommendations. Changing favorites does not change the preview ranking.'
          : 'You have excluded every reviewed preview choice. Update your feedback to try again.',
        choices,
      );
    }
    let status: Discovery['status'] = 'ok';
    let needsCorrection = false;
    const notes: string[] = [];
    const ranked: Work[] = [];
    const transient = new Set<string>();
    try {
      const resolved: Work[] = [];
      const likes: Work[] = [];
      // Ignore foreign/unknown likes before the seven additional signal limit.
      for (const [id, feedback] of Object.entries(input.feedback)) {
        if (feedback.interest !== 'more') continue;
        const work = publishedWorks.find((w) => w.id === id && w.collection === input.collection);
        if (!work) continue;
        const verified = await this.resolveEligible(work, signal, () => transient.add(work.id));
        if (
          verified &&
          !input.favorites.some((f) => f.qlooId === verified.qlooId) &&
          !likes.some((w) => w.qlooId === verified.qlooId)
        )
          likes.push(verified);
        if (likes.length === 7) break;
      }
      const signals = [
        ...new Set([...input.favorites.map((f) => f.qlooId!), ...likes.map((w) => w.qlooId!)]),
      ];
      evidence.signals = [...input.favorites.map((f) => f.name), ...likes.map((w) => w.name)];
      // Backfill excluded/unresolved identities, but use only one query of <=10 options per domain.
      for (const kind of ['movie', 'artist'] as const) {
        let count = 0;
        for (const work of pool.filter((w) => w.kind === kind)) {
          if (count === 10) break;
          const verified = await this.resolveEligible(work, signal, () => transient.add(work.id));
          if (!verified) {
            status = 'partial';
            notes.push(
              transient.has(work.id)
                ? `Identity lookup temporarily unavailable: ${work.name}. Retry to refresh.`
                : `Identity not verified: ${work.name}.`,
            );
          } else if (!signals.includes(verified.qlooId!)) {
            resolved.push(verified);
            count++;
          }
        }
      }
      if (!resolved.length)
        return result(
          'empty',
          'No new eligible works have verified Qloo identities. You can revisit every work in the collections.',
        );
      if (transient.size && status === 'ok') {
        status = 'partial';
        notes.push('Some liked-work lookups were temporarily unavailable. Retry to refresh.');
      }
      const kinds = (['movie', 'artist'] as const).filter((kind) =>
        resolved.some((w) => w.kind === kind),
      );
      const rank = async (kind: 'movie' | 'artist') => {
        const options = resolved.filter((w) => w.kind === kind).slice(0, 10);
        charge();
        const reply: Envelope = await this.qloo.call(
          'qloo_rank',
          {
            option_type: kind,
            options: options.map((w) => w.qlooId),
            signals,
          },
          signal,
        );
        checkpoint(signal);
        if (reply.status === 'error')
          throw new ServiceError(reply.error?.code ?? 'QLOO_ERROR', reply.error?.retryable);
        if (reply.status === 'needs_input') {
          status = 'partial';
          needsCorrection = true;
          notes.push('Some ranking inputs need correction.');
          return [];
        }
        if (reply.status === 'degraded') status = 'degraded';
        else if (reply.status === 'partial' && status === 'ok') status = 'partial';
        const valid = validateRanking(reply, options).slice(0, kind === 'movie' ? 2 : 1);
        ranked.push(...valid);
        return valid;
      };
      const agentResult = input.activity
        ? {
            works: await rank(input.activity.kind),
            explanation:
              'The confirmed activity determines the format and eligible pool. Qloo ranks taste within that pool.',
          }
        : await this.agent.rank(
            kinds,
            rank,
            charge,
            { collection: active.title, favorites: evidence.signals },
            signal,
          );
      checkpoint(signal);
      const works = [
        ...agentResult.works.filter((w) => w.kind === 'movie'),
        ...agentResult.works.filter((w) => w.kind === 'artist'),
      ];
      if (works.length < expected && status === 'ok') status = 'partial';
      const data = result(
        works.length ? status : needsCorrection ? 'needs_input' : 'empty',
        works.length
          ? ('Qloo returned these eligible choices. ' + notes.join(' ')).trim()
          : needsCorrection
            ? 'Qloo could not resolve a ranking input. Search and confirm your favorites again.'
            : 'Qloo returned no eligible choices. Try different favorites.',
        works,
        { explanation: agentResult.explanation },
      );
      if (this.cache.size >= 100) this.cache.delete(this.cache.keys().next().value!);
      if (!transient.size && data.status !== 'degraded') {
        this.cache.set(key, { until: Date.now() + config.cacheMs, data });
        this.state?.set('discovery:' + key, data, config.cacheMs);
      }
      return data;
    } catch (error) {
      checkpoint(signal);
      const code = error instanceof ServiceError ? error.code : 'SERVICE_FAILURE';
      console.warn('Discovery stopped:', code);
      return result(
        ranked.length ? 'degraded' : 'error',
        ranked.length
          ? 'Some Qloo choices arrived, but the full discovery could not finish. Showing only validated results.'
          : code === 'LOCAL_BUDGET'
            ? 'Personalization is paused for today. Your collections and album still work; try again tomorrow.'
            : 'Live discovery could not finish. Your choices are preserved; you can retry. No sample results have been substituted.',
        ranked,
      );
    }
  }

  async connect(input: ConnectionRequest, parent?: AbortSignal): Promise<Discovery> {
    const signal = requestSignal(parent, config.requestTimeout);
    const charge = () => {
      checkpoint(signal);
      this.charge();
    };
    checkpoint(signal);
    const current = this.getMode();
    const seed = publishedWorks.find((w) => w.id === input.seedId);
    const collection = library.find((c) => c.id === input.collection)!;
    const evidence = {
      source:
        current === 'fixture'
          ? 'Example interaction · no Qloo call'
          : `Qloo · bounded ${input.kind} ranking`,
      signals: seed ? [seed.name] : [],
      at: new Date().toISOString(),
      collectionVersion: collection.version,
    };
    const result = (
      status: Discovery['status'],
      message: string,
      works: Work[] = [],
    ): Discovery => ({ mode: current, status, message, works, evidence });
    if (!seed || input.liked !== true)
      return result(
        'needs_input',
        'Choose a published work you explicitly like before exploring a connection.',
      );
    if (current === 'unavailable')
      return result(
        'error',
        'Taste connections are unavailable. The curated collections and your album remain available.',
      );
    const options = publishedWorks
      .filter(
        (w) =>
          w.collection === input.collection &&
          w.kind === input.kind &&
          w.id !== seed.id &&
          !input.excluded.includes(w.id),
      )
      .slice(0, 10);
    if (!options.length)
      return result(
        'empty',
        'There are no eligible choices in this collection and format. Try another collection or format.',
      );
    if (current === 'fixture')
      return result(
        'ok',
        'Example only: these are editorial entries, not verified taste connections to the work you like. No Qloo request was made.',
        options.slice(0, 2),
      );
    const key =
      'connection:' +
      JSON.stringify([
        'insights-novel-v2',
        config.qlooServer,
        config.model,
        seed.id,
        input.collection,
        input.kind,
        [...input.excluded].sort(),
        collection.version,
      ]);
    const cached = this.cache.get(key);
    if (cached && cached.until > Date.now()) return cached.data;
    const persisted = this.state?.get(key) as Discovery | undefined;
    if (persisted) return persisted;
    const transient = new Set<string>();
    try {
      const verifiedSeed = await this.identities.resolve(seed, signal);
      if (!verifiedSeed)
        return result(
          'needs_input',
          'The liked work could not be matched unambiguously with Qloo. No connection was inferred.',
        );
      const resolved: Work[] = [];
      for (const w of options) {
        const match = await this.resolveEligible(w, signal, () => transient.add(w.id));
        if (match && match.qlooId !== verifiedSeed.qlooId) resolved.push(match);
      }
      if (!resolved.length)
        return result(
          'empty',
          'No target entries have a verified Qloo identity. Try another collection.',
        );
      let status: Discovery['status'] = resolved.length === options.length ? 'ok' : 'partial';
      let called = false;
      const ranked: Work[] = [];
      await this.agent.rank(
        [input.kind],
        async (kind) => {
          if (called || kind !== input.kind) throw new ServiceError('INVALID_TARGET');
          called = true;
          charge();
          const reply = await this.qloo.call(
            'qloo_rank',
            {
              option_type: input.kind,
              options: resolved.map((w) => w.qlooId),
              signals: [verifiedSeed.qlooId],
            },
            signal,
          );
          checkpoint(signal);
          if (reply.status === 'error') throw new ServiceError(reply.error?.code ?? 'QLOO_ERROR');
          if (reply.status === 'needs_input') {
            status = 'needs_input';
            return [];
          }
          if (reply.status === 'degraded') status = 'degraded';
          else if (reply.status === 'partial') status = 'partial';
          ranked.push(...validateRanking(reply, resolved).slice(0, 2));
          return ranked;
        },
        charge,
        { collection: collection.title, favorites: [seed.name] },
        signal,
      );
      checkpoint(signal);
      const data = result(
        ranked.length
          ? status
          : (status as Discovery['status']) === 'needs_input'
            ? status
            : 'empty',
        ranked.length
          ? `Qloo ranked eligible ${input.kind === 'artist' ? 'artists' : 'films'} using your explicit like for ${seed.name}. Listening entries are editorial; artist affinity does not predict a specific song.`
          : 'Qloo returned no verified connection for this target.',
        ranked,
      );
      if (transient.size)
        data.message += ' Some identity lookups were temporarily unavailable; retry to refresh.';
      if (this.cache.size >= 100) this.cache.delete(this.cache.keys().next().value!);
      if (!transient.size && data.status !== 'degraded') {
        this.cache.set(key, { until: Date.now() + config.cacheMs, data });
        this.state?.set(key, data, config.cacheMs);
      }
      return data;
    } catch (error) {
      checkpoint(signal);
      return result(
        'error',
        error instanceof ServiceError && error.code === 'LOCAL_BUDGET'
          ? 'The daily discovery limit has been reached. Your album and collections are still available; try again tomorrow.'
          : 'The taste connection could not finish. Your album and the editorial collections are still available. No example replaced the live response.',
      );
    }
  }
}
