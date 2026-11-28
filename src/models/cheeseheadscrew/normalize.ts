import type { CheeseHeadScrewShape } from "./validate"

export function normalizeCheeseHeadScrewProps<T extends CheeseHeadScrewShape>(
  p: T,
) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
