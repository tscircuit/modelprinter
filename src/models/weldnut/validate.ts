import type { z } from "zod"

export interface WeldNutShape {
  threadDiameter: number
  width: number
  height: number
  projections: number
  projectionDiameter: number
  projectionHeight: number
  projectionPitch: number
  squareBody: true
}

export function validateWeldNutProps(
  p: WeldNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= p.width - 3) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message: "Thread bore exceeds square weld nut wall",
    })
  }
  if (p.projectionPitch + p.projectionDiameter > p.width - 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["projectionPitch"],
      message: "Corner weld projections overhang square nut body",
    })
  }
}
