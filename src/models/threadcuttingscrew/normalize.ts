import type { ThreadCuttingScrewShape } from "./validate"

export function normalizeThreadCuttingScrewProps<
  T extends ThreadCuttingScrewShape,
>(p: T) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
