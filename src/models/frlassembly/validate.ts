import type { z } from "zod"

export interface FrlAssemblyShape {
  portNominal: number
  width: number
  height: number
  depth: number
  bowlOuterDiameter: number
  holes: number
  holePitch: number
  holeDiameter: number
  backRail: boolean
}

export function validateFrlAssemblyProps(
  p: FrlAssemblyShape,
  ctx: z.RefinementCtx,
): void {
  if (p.bowlOuterDiameter * 3 > p.width || p.bowlOuterDiameter > p.depth) {
    ctx.addIssue({
      code: "custom",
      path: ["bowlOuterDiameter"],
      message: "Twin bowls collide across 3-module FRL width or depth",
    })
  }
  if (p.holePitch + p.holeDiameter > p.width - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Rear rail mounting hole pitch exceeds FRL assembly width",
    })
  }
}
