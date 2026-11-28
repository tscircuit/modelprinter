import type { FlangedTimingPulleyShape } from "./validate"

export function normalizeFlangedTimingPulleyProps<
  T extends FlangedTimingPulleyShape,
>(p: T) {
  return {
    ...p,
    setScrewThread: p.setScrewThread.toLowerCase(),
  }
}
