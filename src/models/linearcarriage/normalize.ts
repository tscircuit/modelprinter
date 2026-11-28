import type { LinearCarriageShape } from "./validate"

export function normalizeLinearCarriageProps<T extends LinearCarriageShape>(
  p: T,
) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
