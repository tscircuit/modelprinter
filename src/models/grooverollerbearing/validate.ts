import type { z } from "zod"

export interface GrooveRollerBearingShape {
  boreDiameter: number
  outerDiameter: number
  width: number
  grooveRadius: number
  grooveDepth: number
  uGroove: true
  boreMount: true
}

export function validateGrooveRollerBearingProps(
  p: GrooveRollerBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter - 2 * p.grooveDepth - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message:
        "U-groove root diameter leaves insufficient inner bearing ring wall",
    })
  }
  if (2 * p.grooveRadius >= p.width - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveRadius"],
      message: "U-groove mouth span exceeds outer ring axial width",
    })
  }
  if (p.grooveDepth > p.grooveRadius + 2) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message: "U-groove depth exceeds semicircular track profile bounds",
    })
  }
}
