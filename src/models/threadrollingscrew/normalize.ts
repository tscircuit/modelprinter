import type { ThreadRollingScrewShape } from "./validate"

export function normalizeThreadRollingScrewProps<
  T extends ThreadRollingScrewShape,
>(p: T) {
  return { ...p, thread: p.thread.toLowerCase() }
}
