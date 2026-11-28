import type { RoundHeadScrewShape } from "./validate"

export function normalizeRoundHeadScrewProps<T extends RoundHeadScrewShape>(
  p: T,
) {
  return {
    ...p,
    thread: p.thread.toLowerCase(),
  }
}
