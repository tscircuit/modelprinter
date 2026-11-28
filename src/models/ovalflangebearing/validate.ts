import type { z } from "zod"

export interface OvalFlangeBearingShape {
  boreDiameter: number
  length: number
  width: number
  depth: number
  face2Hole: true
  holePitch: number
  holeDiameter: number
}

export function validateOvalFlangeBearingProps(
  p: OvalFlangeBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.width - 8) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Shaft bore exceeds oval flange housing minor width",
    })
  }
  if (p.holePitch + p.holeDiameter >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Two-hole mounting pitch exceeds oval flange length",
    })
  }
  if (p.holePitch - p.holeDiameter <= p.boreDiameter + 8) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Mounting holes collide with central bearing boss",
    })
  }
}
