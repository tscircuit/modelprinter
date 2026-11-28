import type { FillisterHeadScrewShape } from "./validate"

export function normalizeFillisterHeadScrewProps<
  T extends FillisterHeadScrewShape,
>(p: T) {
  return { ...p, thread: p.thread.toLowerCase() }
}
