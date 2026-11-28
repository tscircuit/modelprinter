import type { AntiBacklashNutShape } from "./validate"

export function normalizeAntiBacklashNutProps<T extends AntiBacklashNutShape>(
  p: T,
) {
  return {
    ...p,
    trapezoidalThread: p.trapezoidalThread.toLowerCase(),
  }
}
