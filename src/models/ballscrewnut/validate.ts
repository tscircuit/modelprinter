import type { z } from "zod"

export interface BallScrewNutShape {
  boreDiameter: number
  pitch: number
  outerDiameter: number
  length: number
  flangeOuterDiameter: number
  gothicArch: true
  handedness: "right" | "left"
  externalTube: true
  face4Hole: true
  pcd: number
  holeDiameter: number
}

export function validateBallScrewNutProps(
  p: BallScrewNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Bore diameter leaves insufficient nut raceway wall thickness",
    })
  }
  if (p.pcd - p.holeDiameter <= p.outerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pcd"],
      message: "Flange bolt circle collides with nut cylinder OD",
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
