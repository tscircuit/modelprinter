import type { z } from "zod"

export interface SplitTubeShape {
  outerDiameter: number
  wallThickness: number
  length: number
  gapWidth: number
  chordGap: true
}

export function validateSplitTubeProps(
  p: SplitTubeShape,
  ctx: z.RefinementCtx,
): void {
  const innerDiameter = p.outerDiameter - 2 * p.wallThickness
  if (innerDiameter <= 2) {
    ctx.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Wall thickness closes off hollow split tube bore",
    })
    return
  }
  if (p.gapWidth >= innerDiameter * 0.8) {
    ctx.addIssue({
      code: "custom",
      path: ["gapWidth"],
      message: "Longitudinal seam gap exceeds valid C-tube retention opening",
    })
  }
}
