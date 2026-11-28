import type { z } from "zod"

export interface WormWheelShape {
  teeth: number
  axialModule: number
  boreDiameter: number
  width: number
  axialPressureAngle: number
  rightHand: boolean
  starts: number
  wormPitchDiameter: number
  keyway: true
  keyWidth: number
}

export function validateWormWheelProps(
  p: WormWheelShape,
  ctx: z.RefinementCtx,
): void {
  const pitchDiameter = p.teeth * p.axialModule
  const rootDiameter = pitchDiameter - 2.5 * p.axialModule
  if (p.boreDiameter + p.keyWidth + 2 >= rootDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Keyed shaft bore leaves insufficient rim below worm-wheel root",
    })
  }
  if (p.keyWidth >= p.boreDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["keyWidth"],
      message: "Keyway width must be smaller than shaft bore diameter",
    })
  }
}
