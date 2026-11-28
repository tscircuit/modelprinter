import type { z } from "zod"

export interface AngularContactBearingShape {
  innerDiameter: number
  outerDiameter: number
  width: number
  contactAngle: number
  rows: number
  open: true
}

export function validateAngularContactBearingProps(
  p: AngularContactBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.outerDiameter <= p.innerDiameter + 4) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outer ring diameter must exceed bore by >4 mm for raceways",
    })
  }
  if (p.contactAngle < 12 || p.contactAngle > 45) {
    ctx.addIssue({
      code: "custom",
      path: ["contactAngle"],
      message: "Angular-contact bearing angle must be within [12, 45] degrees",
    })
  }
}
