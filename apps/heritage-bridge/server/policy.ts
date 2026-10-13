import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { collections } from '../shared/collections';
import { libraryVersion } from '../shared/library';
import { config } from './config';
import type { DiscoveryRequest, Favorite, Work } from '../shared/types';
import { entitySchema, type Envelope, ServiceError } from './qloo';
import type { PrivateState } from './state';
import { activitySchema, fitsActivity } from './planning';
const kind = z.enum(['movie', 'artist', 'book']);
export const connectionSchema = z
  .object({
    seedId: z.string().min(1).max(100),
    liked: z.literal(true),
    collection: z.enum(['hindi', 'tamil', 'mexican']),
    kind: z.enum(['movie', 'artist']),
    excluded: z.array(z.string().max(100)).max(60),
  })
  .strict();
export const favoriteSchema = z
  .object({
    id: z.string().max(100),
    name: z.string().min(1).max(180),
    kind,
    subtitle: z.string().max(250),
    qlooId: z.string().uuid().optional(),
    token: z.string().max(500).optional(),
  })
  .strict();
export const requestSchema = z
  .object({
    collection: z.enum(['hindi', 'tamil', 'mexican']),
    favorites: z
      .array(favoriteSchema)
      .length(3)
      .refine((xs) => new Set(xs.map((x) => x.id)).size === 3, 'Choose three different favorites'),
    feedback: z
      .record(
        z.string().max(100),
        z
          .object({
            interest: z.enum(['more', 'no', 'untried']).optional(),
            difficulty: z.enum(['comfortable', 'help', 'difficult']).optional(),
          })
          .strict(),
      )
      .refine((x) => Object.keys(x).length <= 60),
    easier: z.boolean(),
    tried: z.array(z.string().max(100)).max(60).optional(),
    activity: activitySchema.optional(),
  })
  .strict();
if (config.signingSecret && config.signingSecret.length < 32)
  throw new Error('HERITAGE_SIGNING_SECRET must contain at least 32 characters.');
const secret = config.signingSecret || randomBytes(32);
export function signFavorite(f: Favorite) {
  const data = JSON.stringify([f.id, f.name, f.kind, f.subtitle, f.qlooId]);
  return createHmac('sha256', secret).update(data).digest('hex');
}
export function verifyFavorite(f: Favorite) {
  if (!f.token || !f.qlooId) return false;
  const a = Buffer.from(signFavorite(f));
  const b = Buffer.from(f.token);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function cacheKey(input: DiscoveryRequest, mode: string) {
  return createHash('sha256')
    .update(
      JSON.stringify({
        mode,
        version: libraryVersion,
        collection: input.collection,
        easier: input.easier,
        activity: input.activity ?? null,
        tried: [...new Set(input.tried ?? [])].sort(),
        favorites: input.favorites
          .map((f) => ({
            id: f.id,
            name: f.name,
            kind: f.kind,
            subtitle: f.subtitle,
            qlooId: f.qlooId,
          }))
          .sort((a, b) => a.id.localeCompare(b.id)),
        feedback: Object.entries(input.feedback)
          .map(([id, f]) => [id, { interest: f.interest, difficulty: f.difficulty }] as const)
          .sort(([a], [b]) => a.localeCompare(b)),
      }),
    )
    .digest('hex');
}
export function filterPool(works: Work[], input: DiscoveryRequest) {
  return works.filter(
    (w) =>
      w.collection === input.collection &&
      w.metadataStatus === 'reviewed' &&
      (!input.activity || fitsActivity(w, input.activity)) &&
      !['no', 'more'].includes(input.feedback[w.id]?.interest ?? '') &&
      !(input.tried ?? []).includes(w.id),
  );
}
export function validateRanking(result: Envelope, pool: Work[]): Work[] {
  if (!['ok', 'partial', 'degraded'].includes(result.status)) return [];
  const allowed = new Map(pool.filter((w) => w.qlooId).map((w) => [w.qlooId, w]));
  const seen = new Set<string>();
  const output: Work[] = [];
  const scores = new Map<string, number>();
  for (const raw of result.results) {
    const parsed = entitySchema.safeParse(raw);
    if (!parsed.success) continue;
    const entity = parsed.data;
    const work = allowed.get(entity.entity_id);
    if (
      !work ||
      seen.has(work.id) ||
      entity.type !== `urn:entity:${work.kind}` ||
      entity.affinity === undefined
    )
      continue;
    seen.add(work.id);
    scores.set(entity.entity_id, entity.affinity);
    output.push(work);
  }
  // Affinities are only sorted within this one domain/query; never across domains.
  return output.sort((a, b) => (scores.get(b.qlooId!) ?? 0) - (scores.get(a.qlooId!) ?? 0));
}
export function candidates(result: Envelope, requested: 'movie' | 'artist' | 'book'): Favorite[] {
  const raw: unknown[] = [...result.results];
  const r = z
    .object({
      issues: z
        .array(
          z.object({
            candidates: z
              .array(
                z
                  .object({
                    id: z.string(),
                    name: z.string(),
                    type: z.string(),
                    release_year: z.union([z.number(), z.string()]).optional(),
                    description: z.string().optional(),
                  })
                  .passthrough(),
              )
              .optional(),
          }),
        )
        .optional(),
    })
    .safeParse(result.resolution);
  if (r.success)
    for (const issue of r.data.issues ?? [])
      for (const c of issue.candidates ?? [])
        raw.push({
          entity_id: c.id,
          name: c.name,
          type: c.type,
          properties: { release_year: c.release_year, description: c.description },
        });
  const seen = new Set<string>();
  return raw
    .flatMap((value) => {
      const p = entitySchema.safeParse(value);
      if (!p.success || p.data.type !== `urn:entity:${requested}` || seen.has(p.data.entity_id))
        return [];
      seen.add(p.data.entity_id);
      const f: Favorite = {
        id: p.data.entity_id,
        qlooId: p.data.entity_id,
        name: p.data.name,
        kind: requested,
        subtitle: String(
          p.data.properties?.release_year ??
            (typeof p.data.properties?.release_date === 'string'
              ? /^(\d{4})(?:-|$)/.exec(p.data.properties.release_date)?.[1]
              : undefined) ??
            p.data.properties?.description ??
            'Qloo match · confirm the intended entity',
        ).slice(0, 240),
      };
      f.token = signFavorite(f);
      return [f];
    })
    .slice(0, 8);
}
// Counts tool/model invocations; the harness can make multiple HTTP requests
// and bounded internal retries within one tool call.
export class Budget {
  private date = '';
  private used = 0;
  constructor(
    private limit: number,
    private state?: PrivateState,
  ) {}
  take() {
    if (this.state) {
      if (this.state.charge(this.limit) === undefined) throw new ServiceError('LOCAL_BUDGET');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (today !== this.date) {
      this.date = today;
      this.used = 0;
    }
    if (this.used >= this.limit) throw new ServiceError('LOCAL_BUDGET');
    this.used++;
  }
  get count() {
    return this.state?.count() ?? this.used;
  }
}
