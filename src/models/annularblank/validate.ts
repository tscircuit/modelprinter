import type { z } from "zod"

export interface AnnularBlankShape {
  outerDiameter: number
  innerDiameter: number
  thickness: number
  rimRadius: number
}

export function validateAnnularBlankProps(
  p: AnnularBlankShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner bore diameter leaves insufficient annular ring wall",
    })
  }
  if (2 * p.rimRadius >= p.thickness) {
    ctx.addIssue({
      code: "custom",
      path: ["rimRadius"],
      message: "Rim fillet radius exceeds half blank thickness",
    })
  }
  if (4 * p.rimRadius >= p.outerDiameter - p.innerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["rimRadius"],
      message: "Rim fillet radius consumes radial annular face width",
    })
  }
}
