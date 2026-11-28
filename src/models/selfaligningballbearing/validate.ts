import type { z } from "zod"

export interface SelfAligningBallBearingShape {
  innerDiameter: number
  outerDiameter: number
  width: number
  rows: number
  closure: "open" | "sealed"
  sphericalOuter: true
}

export function validateSelfAligningBallBearingProps(
  p: SelfAligningBallBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 8) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner bore leaves insufficient spherical outer raceway section",
    })
  }
  if (p.width < 6) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Bearing width is too narrow for dual self-aligning ball rows",
    })
  }
}
