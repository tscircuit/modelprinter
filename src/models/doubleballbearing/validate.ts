import type { z } from "zod"

export interface DoubleBallBearingShape {
  innerDiameter: number
  outerDiameter: number
  width: number
  rows: number
  contactAngle: number
  open: true
}

export function validateDoubleBallBearingProps(
  p: DoubleBallBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.outerDiameter <= p.innerDiameter + 4) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outer ring OD must exceed bore diameter by >4 mm",
    })
  }
  if (p.width < (p.outerDiameter - p.innerDiameter) * 0.4) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Double-row bearing width is too narrow for two ball tracks",
    })
  }
}
