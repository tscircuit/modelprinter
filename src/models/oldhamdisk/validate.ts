import type { z } from "zod"

export interface OldhamDiskShape {
  outerDiameter: number
  width: number
  tongueWidth: number
  tongueHeight: number
  orthogonalTongues: true
  floating: true
}

export function validateOldhamDiskProps(
  p: OldhamDiskShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.tongueHeight >= p.width - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["tongueHeight"],
      message: "Opposed drive tongues leave insufficient center disk web",
    })
  }
  if (p.tongueWidth >= p.outerDiameter * 0.6) {
    ctx.addIssue({
      code: "custom",
      path: ["tongueWidth"],
      message: "Drive tongue width exceeds valid proportion of disk OD",
    })
  }
}
