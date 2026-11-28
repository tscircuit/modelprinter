import type { z } from "zod"

export interface BellowsCouplerShape {
  boreDiameter: number
  outerDiameter: number
  length: number
  folds: number
  bellowsWallThickness: number
  splitClamp: true
}

export function validateBellowsCouplerProps(
  p: BellowsCouplerShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message:
        "Shaft bore leaves insufficient split-clamp hub and bellows convolution depth",
    })
  }
  if (p.bellowsWallThickness >= 1.5) {
    ctx.addIssue({
      code: "custom",
      path: ["bellowsWallThickness"],
      message:
        "Metal bellows foil wall thickness exceeds flexible diaphragm limit",
    })
  }
  if (p.folds * 2 >= p.length - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["folds"],
      message:
        "Bellows convolution count leaves insufficient end clamp hub length",
    })
  }
}
