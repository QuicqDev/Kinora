export function checkpoint(signal?: AbortSignal) {
  signal?.throwIfAborted();
}
export function requestSignal(parent?: AbortSignal, timeoutMs = 120_000) {
  const deadline = AbortSignal.timeout(timeoutMs);
  return parent ? AbortSignal.any([parent, deadline]) : deadline;
}
