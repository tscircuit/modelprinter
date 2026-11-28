import type { z } from "zod"

export interface FinishingWasherShape {
  custom: true
  innerDiameter: number
  outerDiameter: number
  height: number
  stripThickness: number
  cup: true
  seatAngleDeg: number
  rimWidth: number
}

export function validateFinishingWasherProps(
  p: FinishingWasherShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter + 2 * p.rimWidth >= p.outerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["rimWidth"],
      message:
        "Inner bore plus flat outer rim width must fit inside outer diameter",
    })
  }
  if (p.stripThickness >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["stripThickness"],
      message: "Formed strip thickness must be smaller than raised cup height",
    })
  }
}
