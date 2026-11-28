import type { z } from "zod"

export interface TensionerPulleyShape {
  outerDiameter: number
  width: number
  armLength: number
  pivotDiameter: number
  bearingBore: number
  springHoleDiameter: number
  pivotBore: true
}

export function validateTensionerPulleyProps(
  p: TensionerPulleyShape,
  ctx: z.RefinementCtx,
): void {
  if (p.bearingBore >= p.outerDiameter - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["bearingBore"],
      message: "Idler bearing bore leaves insufficient pulley rim thickness",
    })
  }
  if (p.armLength <= p.outerDiameter / 2 + p.pivotDiameter / 2 + 5) {
    ctx.addIssue({
      code: "custom",
      path: ["armLength"],
      message: "Tensioner swing arm is too short to clear idler pulley rim",
    })
  }
}
