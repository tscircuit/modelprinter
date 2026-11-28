import type { RoundBeltPulleyShape } from "./validate"

export function normalizeRoundBeltPulleyProps<T extends RoundBeltPulleyShape>(
  p: T,
) {
  return {
    ...p,
    setScrewThread: p.setScrewThread.toLowerCase(),
  }
}
