import type { z } from "zod"

export interface SelfDrillingScrewShape {
  custom: true
  diameter: number
  coreDiameter: number
  threadPitch: number
  rightHanded: boolean
  length: number
  threadLength: number
  hexFlange: true
  acrossFlats: number
  headHeight: number
  flangeOuterDiameter: number
  drillLength: number
  flutes: number
  pointAngle: number
}

export function validateSelfDrillingScrewProps(
  p: SelfDrillingScrewShape,
  ctx: z.RefinementCtx,
): void {
  if (p.coreDiameter >= p.diameter) {
    ctx.addIssue({
      code: "custom",
      path: ["coreDiameter"],
      message: "Core diameter must be smaller than outer tapping diameter",
    })
  }
  if (p.flangeOuterDiameter <= p.acrossFlats) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeOuterDiameter"],
      message: "Hex-flange bearing diameter must exceed hex across-flats width",
    })
  }
  if (p.threadLength + p.drillLength > p.length + 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["threadLength"],
      message:
        "Combined thread length and fluted drill point exceed under-head length",
    })
  }
}
