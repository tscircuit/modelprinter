import type { z } from "zod"

export interface WoodScrewShape {
  custom: true
  diameter: number
  coreDiameter: number
  length: number
  threadLength: number
  threadPitch: number
  rightHanded: boolean
  countersunk: true
  headOuterDiameter: number
  headAngle: number
  phillips: true
  coneTip: true
}

export function validateWoodScrewProps(
  p: WoodScrewShape,
  ctx: z.RefinementCtx,
): void {
  if (p.coreDiameter >= p.diameter) {
    ctx.addIssue({
      code: "custom",
      path: ["coreDiameter"],
      message: "Core diameter must be smaller than outer thread diameter",
    })
  }
  if (p.headOuterDiameter <= p.diameter) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message: "Countersunk head diameter must exceed shank diameter",
    })
  }
  const headHeight =
    (p.headOuterDiameter - p.diameter) /
    (2 * Math.tan((p.headAngle * Math.PI) / 360))
  if (p.threadLength + headHeight >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["threadLength"],
      message:
        "Threaded section overlaps countersunk head within overall length",
    })
  }
}
