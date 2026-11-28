import type { z } from "zod"

export interface SpokedWheelShape {
  outerDiameter: number
  rimWidth: number
  boreDiameter: number
  spokes: number
  keyway: true
  keyWidth: number
  hubWidth: number
}

export function validateSpokedWheelProps(
  p: SpokedWheelShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter * 0.4) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Hub bore leaves insufficient radial window for spokes",
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
