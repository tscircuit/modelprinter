import type { z } from "zod"

export interface RoundBeltPulleyShape {
  outerDiameter: number
  boreDiameter: number
  width: number
  grooveRadius: number
  semicircularGroove: true
  setScrew: true
  setScrewThread: string
}

export function validateRoundBeltPulleyProps(
  p: RoundBeltPulleyShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.grooveRadius >= p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveRadius"],
      message: "Semicircular belt groove width exceeds pulley rim width",
    })
  }
  if (p.outerDiameter - 2 * p.grooveRadius <= p.boreDiameter + 4) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Groove root collides with central shaft bore",
    })
  }
}
