import type { z } from "zod"

export interface RollerCatchShape {
  width: number
  depth: number
  height: number
  rollerDiameter: number
  rollerGap: number
  strikeWidth: number
  holeDiameter: number
  holePitch: number
}

export function validateRollerCatchProps(
  p: RollerCatchShape,
  ctx: z.RefinementCtx,
): void {
  if (p.rollerGap >= p.strikeWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["rollerGap"],
      message:
        "Roller pinch gap must be narrower than strike tongue width for retention",
    })
  }
  if (p.holePitch + p.holeDiameter > p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Mounting hole pitch breaks through catch housing width",
    })
  }
  if (2 * p.rollerDiameter + p.rollerGap > p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["rollerDiameter"],
      message: "Opposed rollers and gap exceed catch housing width",
    })
  }
}
