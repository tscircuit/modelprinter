import type { z } from "zod"

export interface FlangedBallBearingShape {
  innerDiameter: number
  outerDiameter: number
  width: number
  flangeOuterDiameter: number
  rows: number
  flangeThickness: number
  closure: "open" | "shielded" | "sealed"
}

export function validateFlangedBallBearingProps(
  p: FlangedBallBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner bore leaves insufficient radial bearing section",
    })
  }
  if (p.outerDiameter >= p.flangeOuterDiameter - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeOuterDiameter"],
      message: "Outer locating flange must project radially beyond outer ring",
    })
  }
  if (p.flangeThickness >= p.width - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeThickness"],
      message: "Flange axial thickness exceeds bearing width",
    })
  }
}
