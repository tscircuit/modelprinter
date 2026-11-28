import type { z } from "zod"

export interface RoundFlangeBearingShape {
  boreDiameter: number
  outerDiameter: number
  depth: number
  pitchCircleDiameter: number
  face4Hole: true
  holeDiameter: number
}

export function validateRoundFlangeBearingProps(
  p: RoundFlangeBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter + 12 >= p.pitchCircleDiameter - p.holeDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchCircleDiameter"],
      message: "Bolt circle collides with central bearing insert boss",
    })
  }
  if (p.pitchCircleDiameter + p.holeDiameter >= p.outerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchCircleDiameter"],
      message: "Bolt circle holes exceed circular flange outer diameter",
    })
  }
}
