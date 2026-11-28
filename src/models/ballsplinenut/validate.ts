import type { z } from "zod"

export interface BallSplineNutShape {
  boreDiameter: number
  outerDiameter: number
  length: number
  flangeOuterDiameter: number
  raceCount: number
  face4Hole: true
  pcd: number
  holeDiameter: number
  internalReturn: true
}

export function validateBallSplineNutProps(
  p: BallSplineNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Spline bore leaves insufficient carriage cylinder wall",
    })
  }
  if (p.pcd - p.holeDiameter <= p.outerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pcd"],
      message: "Flange bolt circle collides with carriage cylinder OD",
    })
  }
  if (p.pcd + p.holeDiameter >= p.flangeOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pcd"],
      message: "Flange bolt circle exceeds flange outer diameter",
    })
  }
}
