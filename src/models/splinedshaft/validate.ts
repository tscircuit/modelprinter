import type { z } from "zod"

export interface SplinedShaftShape {
  outerDiameter: number
  rootDiameter: number
  length: number
  teeth: number
  toothWidth: number
  endChamfer: number
  straightSided: true
}

export function validateSplinedShaftProps(
  p: SplinedShaftShape,
  ctx: z.RefinementCtx,
): void {
  if (p.rootDiameter >= p.outerDiameter - 1.5) {
    ctx.addIssue({
      code: "custom",
      path: ["rootDiameter"],
      message: "Spline root diameter leaves insufficient radial tooth height",
    })
  }
  if (p.teeth * p.toothWidth >= Math.PI * p.rootDiameter * 0.85) {
    ctx.addIssue({
      code: "custom",
      path: ["toothWidth"],
      message: "Spline teeth overlap around root circle circumference",
    })
  }
  if (2 * p.endChamfer >= p.length / 4) {
    ctx.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message: "End chamfers consume splined engagement length",
    })
  }
}
