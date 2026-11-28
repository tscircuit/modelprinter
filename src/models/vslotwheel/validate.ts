import type { z } from "zod"

export interface VSlotWheelShape {
  outerDiameter: number
  width: number
  boreDiameter: number
  includedAngleDeg: number
  dualBevel: true
  bearingSeatDiameter: number
  axleBore: true
}

export function validateVSlotWheelProps(
  p: VSlotWheelShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.bearingSeatDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Through axle bore must be smaller than bearing seat recess",
    })
  }
  if (p.bearingSeatDiameter >= p.outerDiameter - 3) {
    ctx.addIssue({
      code: "custom",
      path: ["bearingSeatDiameter"],
      message: "Bearing seat recess leaves insufficient V-bevel tire wall",
    })
  }
  if (p.includedAngleDeg <= 30 || p.includedAngleDeg >= 150) {
    ctx.addIssue({
      code: "custom",
      path: ["includedAngleDeg"],
      message: "Dual-bevel included angle must lie between 30 and 150 degrees",
    })
  }
}
