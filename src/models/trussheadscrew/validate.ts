import type { z } from "zod"

export interface TrussHeadScrewShape {
  custom: true
  thread: string
  length: number
  fullThread: true
  headOuterDiameter: number
  headHeight: number
  sphericalCap: true
  phillips: true
}

export function validateTrussHeadScrewProps(
  p: TrussHeadScrewShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.headOuterDiameter <= majorDia + 2) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message: "Truss head diameter must exceed thread diameter by >2 mm",
    })
  }
  if (p.headHeight >= p.headOuterDiameter / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["headHeight"],
      message:
        "Low-profile spherical-cap truss head height must be less than head radius",
    })
  }
}
