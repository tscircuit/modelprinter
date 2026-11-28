import type { TrussHeadScrewShape } from "./validate"

export function normalizeTrussHeadScrewProps<T extends TrussHeadScrewShape>(
  p: T,
) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
