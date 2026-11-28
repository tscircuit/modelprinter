import type { z } from "zod"

export interface ShoulderWasherShape {
  custom: true
  innerDiameter: number
  outerDiameter: number
  flangeHeight: number
  bossOuterDiameter: number
  bossLength: number
  round: true
}

export function validateShoulderWasherProps(
  p: ShoulderWasherShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.bossOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["bossOuterDiameter"],
      message: "Tubular shoulder boss OD must exceed inner bore diameter",
    })
  }
  if (p.bossOuterDiameter >= p.outerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Flange outer diameter must exceed shoulder boss OD",
    })
  }
}
