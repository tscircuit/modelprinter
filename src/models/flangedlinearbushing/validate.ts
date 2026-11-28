import type { z } from "zod"

export interface FlangedLinearBushingShape {
  innerDiameter: number
  outerDiameter: number
  length: number
  flangeOuterDiameter: number
  closedRecirculating: true
  round4Hole: true
  pitchCircleDiameter: number
  holeDiameter: number
}

export function validateFlangedLinearBushingProps(
  p: FlangedLinearBushingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.outerDiameter <= p.innerDiameter + 3) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Bushing barrel OD requires >1.5 mm radial ball-track wall",
    })
  }
  if (p.pitchCircleDiameter - p.holeDiameter <= p.outerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchCircleDiameter"],
      message: "Flange bolt circle intersects cylindrical bushing barrel",
    })
  }
  if (p.pitchCircleDiameter + p.holeDiameter >= p.flangeOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchCircleDiameter"],
      message: "Flange bolt circle exceeds flange outer diameter",
    })
  }
}
