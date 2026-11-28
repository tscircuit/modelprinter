import type { CircuitBreakerInputShape } from "./validate"

export function normalizeCircuitBreakerProps<
  T extends CircuitBreakerInputShape,
>(p: T) {
  return {
    ...p,
    width: p.width ?? p.poles * 18,
  }
}
