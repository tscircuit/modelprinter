import type { z } from "zod"

export interface ConcreteScrewShape {
  custom: true
  diameter: number
  coreDiameter: number
  length: number
  threadPitch: number
  rightHanded: boolean
  hiLoThread: true
  lowCrestDiameter: number
  hexFlange: true
  acrossFlats: number
  flangeOuterDiameter: number
  headHeight: number
  notchedConeTip: true
  cuts: number
  cutLength: number
}

export function validateConcreteScrewProps(
  p: ConcreteScrewShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.coreDiameter >= p.lowCrestDiameter ||
    p.lowCrestDiameter >= p.diameter
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["lowCrestDiameter"],
      message:
        "Hi-Lo masonry thread requires coreDiameter < lowCrestDiameter < diameter",
    })
  }
  if (p.flangeOuterDiameter <= p.acrossFlats) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeOuterDiameter"],
      message: "Hex-flange bearing diameter must exceed across-flats width",
    })
  }
  if (p.cutLength >= p.length / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["cutLength"],
      message: "Tip notch cut length cannot exceed half of under-head length",
    })
  }
}
