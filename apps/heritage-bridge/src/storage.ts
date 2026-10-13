import { z } from 'zod';
import type { Feedback, ChoiceOrigin, Work } from '../shared/types';
const schema = z.object({
  notes: z.record(z.string(), z.string().max(800)),
  saved: z
    .array(
      z.object({
        id: z.string(),
        mode: z.enum(['fixture', 'live', 'unavailable', 'editorial']),
        at: z.string(),
        note: z.string().max(800),
        stage: z.enum(['want', 'tried']).optional(),
        triedAt: z.string().datetime().optional(),
      }),
    )
    .max(60),
  feedback: z.record(
    z.string(),
    z.object({
      interest: z.enum(['more', 'no', 'untried']).optional(),
      difficulty: z.enum(['comfortable', 'help', 'difficult']).optional(),
    }),
  ),
});
export interface LocalData {
  notes: Record<string, string>;
  saved: {
    id: string;
    mode: ChoiceOrigin;
    at: string;
    note: string;
    stage?: 'want' | 'tried';
    triedAt?: string;
  }[];
  feedback: Record<string, Feedback>;
}
export const emptyLocal: LocalData = { notes: {}, saved: [], feedback: {} };
let pendingRecovery: string | undefined;
export function recoveryCopy(): string | undefined {
  try {
    return pendingRecovery ?? localStorage.getItem('heritage-bridge.v1.recovery') ?? undefined;
  } catch {
    return pendingRecovery;
  }
}
export function readLocal(): LocalData {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem('heritage-bridge.v1');
    if (!raw) return { notes: {}, saved: [], feedback: {} };
    const value = JSON.parse(raw);
    const parsed = schema.safeParse(value);
    if (parsed.success) return parsed.data;
    pendingRecovery = raw;
    const data: LocalData = { notes: {}, saved: [], feedback: {} };
    if (value && typeof value === 'object') {
      for (const [id, note] of Object.entries(value.notes ?? {}))
        if (typeof note === 'string' && note.length <= 800) data.notes[id] = note;
      const seen = new Set<string>();
      for (const record of Array.isArray(value.saved) ? value.saved : []) {
        const entry = schema.shape.saved.element.safeParse(record);
        if (entry.success && !seen.has(entry.data.id) && data.saved.length < 60) {
          seen.add(entry.data.id);
          data.saved.push(entry.data);
        }
      }
      for (const [id, feedback] of Object.entries(value.feedback ?? {})) {
        const entry = schema.shape.feedback.valueType.safeParse(feedback);
        if (entry.success) data.feedback[id] = entry.data;
      }
    }
    return data;
  } catch {
    if (raw) pendingRecovery = raw;
    return { notes: {}, saved: [], feedback: {} };
  }
}
export function writeLocal(value: LocalData) {
  try {
    if (pendingRecovery) {
      localStorage.setItem('heritage-bridge.v1.recovery', pendingRecovery);
      pendingRecovery = undefined;
    }
    localStorage.setItem('heritage-bridge.v1', JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function recordExperience(
  data: LocalData,
  work: Work,
  origin: ChoiceOrigin,
  stage: 'want' | 'tried',
  now = new Date().toISOString(),
): LocalData {
  const current = data.saved.find((s) => s.id === work.id);
  const entry = {
    ...(current ?? { id: work.id, mode: origin, at: now, note: data.notes[work.id] ?? '' }),
    stage,
    triedAt: stage === 'tried' ? (current?.triedAt ?? now) : undefined,
  };
  return {
    ...data,
    saved: current ? data.saved.map((s) => (s.id === work.id ? entry : s)) : [...data.saved, entry],
  };
}
