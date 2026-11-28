import type { z } from "zod"

export interface WaveSpringWasherShape {
  innerDiameter: number
  outerDiameter: number
  stripThickness: number
  freeHeight: number
  waves: number
  sinusoidal: true
  freeState: true
}

export function validateWaveSpringWasherProps(
  p: WaveSpringWasherShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 3) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner bore leaves insufficient annular wave ring width",
    })
  }
  if (p.stripThickness >= p.freeHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["freeHeight"],
      message: "Free wave height must exceed flat strip gauge thickness",
    })
  }
}
