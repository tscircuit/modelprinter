import type { z } from "zod"

export interface LedHeatsinkShape {
  outerDiameter: number
  height: number
  baseThickness: number
  seatOuterDiameter: number
  fins: number
  finThickness: number
  holes: 2
  holeDiameter: number
  holePitch: number
}

export function validateLedHeatsinkProps(
  p: LedHeatsinkShape,
  ctx: z.RefinementCtx,
): void {
  if (p.seatOuterDiameter >= p.outerDiameter - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["seatOuterDiameter"],
      message: "Emitter seat OD must leave radial room for cooling fins",
    })
  }
  if (p.fins * p.finThickness >= Math.PI * p.seatOuterDiameter * 0.8) {
    ctx.addIssue({
      code: "custom",
      path: ["fins"],
      message: "Radial fins crowd out airflow channels around central seat",
    })
  }
  if (p.holePitch + p.holeDiameter >= p.seatOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Emitter mounting holes exceed central seat diameter",
    })
  }
}
