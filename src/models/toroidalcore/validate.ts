import type { z } from "zod"

export interface ToroidalCoreShape {
  outerDiameter: number
  innerDiameter: number
  height: number
  edgeRadius: number
  roundedRectangle: true
}

export function validateToroidalCoreProps(
  p: ToroidalCoreShape,
  ctx: z.RefinementCtx,
): void {
  const radialWidth = (p.outerDiameter - p.innerDiameter) / 2
  if (radialWidth <= 1) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Toroidal core inner diameter must leave positive radial wall",
    })
    return
  }
  if (2 * p.edgeRadius >= Math.min(radialWidth, p.height)) {
    ctx.addIssue({
      code: "custom",
      path: ["edgeRadius"],
      message: "Edge coating radius exceeds toroidal cross-section bounds",
    })
  }
}
