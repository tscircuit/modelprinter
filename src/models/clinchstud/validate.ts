import type { z } from "zod"

export interface ClinchStudShape {
  custom: true
  thread: string
  length: number
  fullThread: true
  headOuterDiameter: number
  headHeight: number
  neckDiameter: number
  neckLength: number
  serrations: number
  serrationDepth: number
}

export function validateClinchStudProps(
  p: ClinchStudShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.neckDiameter >= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["neckDiameter"],
      message: "Clinch capture neck must be narrower than nominal thread OD",
    })
  }
  if (p.headOuterDiameter <= majorDia + 1.5) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message:
        "Press-in serrated head diameter must exceed thread OD by >1.5 mm",
    })
  }
  if (p.neckLength >= p.length / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["neckLength"],
      message: "Clinch undercut neck length must leave usable thread length",
    })
  }
}
