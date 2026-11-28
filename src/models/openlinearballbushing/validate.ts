import type { z } from "zod"

export interface OpenLinearBallBushingShape {
  innerDiameter: number
  outerDiameter: number
  length: number
  openRecirculating: true
  openingAngle: number
  circlipGrooves: number
}

export function validateOpenLinearBallBushingProps(
  p: OpenLinearBallBushingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.outerDiameter <= p.innerDiameter + 3) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message:
        "Open linear ball bushing requires >1.5 mm radial wall for ball tracks",
    })
  }
  if (p.openingAngle < 30 || p.openingAngle > 120) {
    ctx.addIssue({
      code: "custom",
      path: ["openingAngle"],
      message: "Support-rail clearance slot angle must be within [30, 120] deg",
    })
  }
}
