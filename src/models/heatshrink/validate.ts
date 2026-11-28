import type { z } from "zod"

export interface HeatShrinkShape {
  innerDiameter: number
  outerDiameter: number
  length: number
  squareEnds: true
  unshrunk: true
}

export function validateHeatShrinkProps(
  p: HeatShrinkShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 0.1) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outer diameter must exceed inner diameter with positive wall",
    })
  }
}
