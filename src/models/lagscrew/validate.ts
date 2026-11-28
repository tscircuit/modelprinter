import type { z } from "zod"

export interface LagScrewShape {
  custom: true
  diameter: number
  coreDiameter: number
  length: number
  threadLength: number
  threadPitch: number
  rightHanded: boolean
  acrossFlats: number
  headHeight: number
  hexHead: true
  hexDrive: true
  coneTip: true
}

export function validateLagScrewProps(
  p: LagScrewShape,
  ctx: z.RefinementCtx,
): void {
  if (p.coreDiameter >= p.diameter) {
    ctx.addIssue({
      code: "custom",
      path: ["coreDiameter"],
      message: "Core diameter must be smaller than outer lag-thread diameter",
    })
  }
  if (p.acrossFlats <= p.diameter) {
    ctx.addIssue({
      code: "custom",
      path: ["acrossFlats"],
      message: "Hex head across-flats must exceed shank diameter",
    })
  }
  if (p.threadLength > p.length + 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["threadLength"],
      message: "Threaded section length cannot exceed under-head length",
    })
  }
}
