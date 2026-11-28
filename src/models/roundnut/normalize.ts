import type { RoundNutShape } from "./validate"

export function normalizeRoundNutProps<T extends RoundNutShape>(p: T) {
  return { ...p, thread: p.thread.toLowerCase() }
}
