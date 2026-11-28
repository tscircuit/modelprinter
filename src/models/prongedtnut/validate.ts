import type { z } from "zod"

export interface ProngedTNutShape {
  threadDiameter: number
  barrelOuterDiameter: number
  length: number
  flangeOuterDiameter: number
  flangeHeight: number
  prongs: number
  prongLength: number
  prongWidth: number
  pointedTip: true
}

export function validateProngedTNutProps(
  p: ProngedTNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= p.barrelOuterDiameter - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message: "Thread bore exceeds pronged T-nut barrel wall",
    })
  }
  if (p.barrelOuterDiameter >= p.flangeOuterDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["barrelOuterDiameter"],
      message:
        "Barrel outer diameter leaves insufficient circular flange width",
    })
  }
  if (
    p.flangeHeight >= p.length - 2 ||
    p.prongLength > p.length - p.flangeHeight
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["prongLength"],
      message: "Axial prong height exceeds barrel projection above flange",
    })
  }
}
