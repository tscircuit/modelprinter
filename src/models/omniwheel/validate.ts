import type { z } from "zod"

export interface OmniWheelShape {
  outerDiameter: number
  width: number
  boreDiameter: number
  rollers: number
  keyway: true
  keyWidth: number
  tangentialRollers: true
}

export function validateOmniWheelProps(
  p: OmniWheelShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Hub bore leaves insufficient radial room for rim rollers",
    })
  }
  if (p.keyWidth >= p.boreDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["keyWidth"],
      message: "Keyway width must be narrower than shaft bore",
    })
  }
}
