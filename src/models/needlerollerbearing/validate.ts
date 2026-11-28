import type { z } from "zod"

export interface NeedleRollerBearingShape {
  innerDiameter: number
  outerDiameter: number
  width: number
  rows: number
  innerRing: number
  closure: "open" | "sealed"
}

export function validateNeedleRollerBearingProps(
  p: NeedleRollerBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 3) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner diameter leaves insufficient radial needle section",
    })
  }
  if (p.width < 5 * p.rows) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Bearing width is too short for slender needle rollers",
    })
  }
}
