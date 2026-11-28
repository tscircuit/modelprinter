import type { z } from "zod"

export interface CylindricalRollerBearingShape {
  innerDiameter: number
  outerDiameter: number
  width: number
  rows: number
  layout: "nu" | "nj" | "nup"
  closure: "open" | "shielded" | "sealed"
}

export function validateCylindricalRollerBearingProps(
  p: CylindricalRollerBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner bore leaves insufficient radial raceway section",
    })
  }
  if (p.width < 4 * p.rows) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Bearing axial width is too narrow for roller rows",
    })
  }
}
