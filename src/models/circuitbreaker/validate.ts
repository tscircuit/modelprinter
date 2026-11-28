import type { z } from "zod"

export interface CircuitBreakerInputShape {
  width?: number
  height: number
  depth: number
  poles: 1 | 2 | 3 | 4
  th35x75Rail: true
  frontToggle: true
  topBottomTerminals: true
  stepped: true
}

export function validateCircuitBreakerProps(
  p: CircuitBreakerInputShape,
  ctx: z.RefinementCtx,
): void {
  const effectiveWidth = p.width ?? p.poles * 18
  if (effectiveWidth < p.poles * 17.5) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message:
        "Circuit breaker width must accommodate at least 17.5 mm per pole module",
    })
  }
  if (p.height <= 40) {
    ctx.addIssue({
      code: "custom",
      path: ["height"],
      message:
        "Circuit breaker height must exceed the 35 mm DIN-rail clip span",
    })
  }
  if (p.depth <= 25) {
    ctx.addIssue({
      code: "custom",
      path: ["depth"],
      message:
        "Circuit breaker depth must accommodate stepped nose and rail latch",
    })
  }
}
