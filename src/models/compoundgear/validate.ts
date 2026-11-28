import type { z } from "zod"

export interface CompoundGearShape {
  teethA: number
  teethB: number
  module: number
  width: number
  boreDiameter: number
  pressureAngleDeg: number
  keyway: true
  keyWidth: number
}

export function validateCompoundGearProps(
  p: CompoundGearShape,
  ctx: z.RefinementCtx,
): void {
  if (p.teethA === p.teethB) {
    ctx.addIssue({
      code: "custom",
      path: ["teethB"],
      message: "Compound gear stages must have distinct tooth counts",
    })
  }
  const minRootDia = Math.min(p.teethA, p.teethB) * p.module - 2.5 * p.module
  if (p.boreDiameter >= minRootDia - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Bore diameter encroaches on smaller stage tooth roots",
    })
  }
  if (p.keyWidth >= p.boreDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["keyWidth"],
      message: "Keyway width must be narrower than shaft bore diameter",
    })
  }
}
