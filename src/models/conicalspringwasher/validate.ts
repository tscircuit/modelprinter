import type { z } from "zod"

export interface ConicalSpringWasherShape {
  innerDiameter: number
  outerDiameter: number
  stripThickness: number
  freeHeight: number
  conical: true
  freeState: true
}

export function validateConicalSpringWasherProps(
  p: ConicalSpringWasherShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 3) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner bore leaves insufficient Belleville disc frustum width",
    })
  }
  if (p.stripThickness >= p.freeHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["freeHeight"],
      message: "Free conical height must exceed flat strip gauge thickness",
    })
  }
}
