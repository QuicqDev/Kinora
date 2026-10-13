import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { activityExamples, durationMs, fitsActivity } from '../shared/activity';
import { library, publishedWorks } from '../shared/library';

export interface PageTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint: boolean };
  execute: (input: unknown, options?: { signal?: AbortSignal }) => Promise<unknown>;
}
export interface ModelContext {
  registerTool: (tool: PageTool, options?: { signal: AbortSignal }) => void | Promise<void>;
  unregisterTool?: (name: string) => void;
}
export const noArguments = z.object({}).strict();
export const prepareBridgeSchema = z
  .object({
    collection: z.enum(['hindi', 'tamil', 'mexican']),
    brief: z.string().trim().min(5).max(500),
    favorites: z.enum(['current', 'pop', 'instrumental']),
  })
  .strict();
export const inspectCollectionSchema = z
  .object({
    collection: z.enum(['hindi', 'tamil', 'mexican']),
    kind: z.enum(['movie', 'artist']),
    maxMinutes: z.number().int().min(1).max(360).nullable(),
  })
  .strict();
export const toolResult = (data: unknown) => ({
  content: [{ type: 'text', text: JSON.stringify(data) }],
});

export function inspectCollection(input: unknown) {
  const args = inspectCollectionSchema.parse(input);
  const collection = library.find((c) => c.id === args.collection)!;
  return {
    collection: collection.subtitle,
    examples: activityExamples(collection.id, publishedWorks),
    works: publishedWorks
      .filter((w) => w.collection === args.collection && fitsActivity(w, args))
      .map((w) => ({
        id: w.id,
        name: w.name,
        startingSong: w.entry,
        durationMs: durationMs(w),
        edition: w.songDuration?.edition,
        durationSource: w.songDuration?.source ?? (w.runtime ? w.source : undefined),
        path: '/works/' + w.id,
      })),
    note: 'Reviewed catalogue, not personalized ranking. Unknown durations are excluded when a limit is set. Qloo ranks artists, not individual songs. Playback excludes access, ads and conversation.',
  };
}

// Current API lives on Document. Older preview browsers use Navigator and explicit cleanup.
export function modelContextFor(
  documentValue: object,
  navigatorValue: object,
): ModelContext | undefined {
  for (const value of [documentValue, navigatorValue]) {
    const context = (value as { modelContext?: ModelContext }).modelContext;
    if (typeof context?.registerTool === 'function') return context;
  }
}

export function registerPageTools(context: ModelContext, tools: PageTool[]) {
  const controller = new AbortController();
  const registered: string[] = [];
  const clear = () => {
    for (const name of registered.splice(0)) {
      try {
        context.unregisterTool?.(name);
      } catch {
        /* Already removed by the signal. */
      }
    }
  };
  const ready = (async () => {
    try {
      for (const tool of tools) {
        if (controller.signal.aborted) return;
        await context.registerTool(tool, { signal: controller.signal });
        registered.push(tool.name);
        if (controller.signal.aborted) clear();
      }
    } catch (error) {
      controller.abort();
      clear();
      throw error;
    }
  })();
  return {
    ready,
    dispose() {
      controller.abort();
      clear();
    },
  };
}

export function useWebMCP(tools: PageTool[]) {
  const latest = useRef(tools);
  latest.current = tools;
  const names = tools.map((t) => t.name).join('|');
  const [status, setStatus] = useState<'checking' | 'ready' | 'unsupported' | 'error'>('checking');
  useEffect(() => {
    const context = modelContextFor(document, navigator);
    if (!context) {
      setStatus('unsupported');
      return;
    }
    let active = true;
    // Delay registration through StrictMode's discarded first effect.
    let registration: ReturnType<typeof registerPageTools> | undefined;
    queueMicrotask(() => {
      if (!active) return;
      registration = registerPageTools(
        context,
        latest.current.map((tool) => ({
          ...tool,
          execute: async (input, options) => {
            options?.signal?.throwIfAborted();
            const current = latest.current.find((t) => t.name === tool.name);
            if (!active || !current)
              throw Error('This action is no longer available. Refresh the tool list.');
            return current.execute(input, options);
          },
        })),
      );
      void registration.ready
        .then(() => {
          if (active) setStatus('ready');
        })
        .catch(() => {
          if (active) setStatus('error');
        });
    });
    return () => {
      active = false;
      registration?.dispose();
    };
  }, [names]);
  return status;
}
