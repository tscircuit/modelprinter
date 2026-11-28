import type { z } from "zod"

export interface MecanumWheelShape {
  outerDiameter: number
  width: number
  boreDiameter: number
  rollers: number
  rollerAngleDeg: number
  keyway: true
  keyWidth: number
  handedness: "right" | "left"
}

export function validateMecanumWheelProps(
  p: MecanumWheelShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Hub bore leaves insufficient radial room for 45-deg rollers",
    })
  }
  if (p.rollerAngleDeg <= 15 || p.rollerAngleDeg >= 75) {
    ctx.addIssue({
      code: "custom",
      path: ["rollerAngleDeg"],
      message: "Mecanum roller skew angle must lie between 15 and 75 degrees",
    })
  }
  if (p.keyWidth >= p.boreDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["keyWidth"],
      message: "Keyway width must be narrower than hub bore",
    })
  }
}
