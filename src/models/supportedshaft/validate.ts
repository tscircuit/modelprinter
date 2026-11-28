import type { z } from "zod"

export interface SupportedShaftShape {
  shaftDiameter: number
  length: number
  baseWidth: number
  baseHeight: number
  holePitch: number
  holeDiameter: number
  shaftCenterHeight: number
  baseHoles: boolean
}

export function validateSupportedShaftProps(
  p: SupportedShaftShape,
  ctx: z.RefinementCtx,
): void {
  if (p.shaftCenterHeight < p.baseHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["shaftCenterHeight"],
      message:
        "Shaft centerline height must sit at or above aluminum support rail deck",
    })
  }
  if (p.shaftDiameter >= p.baseWidth - 2 * p.holeDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["shaftDiameter"],
      message: "Shaft diameter obstructs flange mounting bolt clearance",
    })
  }
  if (p.holePitch >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Rail mounting hole pitch must be shorter than rail length",
    })
  }
}
