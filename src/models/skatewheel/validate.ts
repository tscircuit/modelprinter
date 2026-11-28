import type { z } from "zod"

export interface SkateWheelShape {
  outerDiameter: number
  width: number
  boreDiameter: number
  bearingBore: true
  bearingSeatDiameter: number
}

export function validateSkateWheelProps(
  p: SkateWheelShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.bearingSeatDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Axle bore must be smaller than recessed bearing seat diameter",
    })
  }
  if (p.bearingSeatDiameter >= p.outerDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["bearingSeatDiameter"],
      message:
        "Bearing seat recess leaves insufficient polyurethane tread wall",
    })
  }
}
