import type { z } from "zod"

export interface PlateNutShape {
  custom: true
  thread: string
  width: number
  length: number
  stripThickness: number
  holePitch: number
  rivetHoleDiameter: number
  nutOuterDiameter: number
  nutHeight: number
  flat: true
}

export function validatePlateNutProps(
  p: PlateNutShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.nutOuterDiameter <= majorDia + 1 || p.nutOuterDiameter > p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["nutOuterDiameter"],
      message:
        "Nut barrel OD must exceed thread diameter and fit within plate width",
    })
  }
  if (p.holePitch - p.rivetHoleDiameter <= p.nutOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Rivet holes overlap central threaded barrel",
    })
  }
  if (p.holePitch + p.rivetHoleDiameter >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Rivet holes exceed nut plate length",
    })
  }
}
