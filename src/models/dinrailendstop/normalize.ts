import type { DinRailEndStopShape } from "./validate"

export function normalizeDinRailEndStopProps<T extends DinRailEndStopShape>(
  p: T,
) {
  return {
    ...p,
    clampThread: p.clampThread.toLowerCase(),
  }
}
