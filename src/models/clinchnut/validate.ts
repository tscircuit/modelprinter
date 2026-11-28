import type { z } from "zod"

export interface ClinchNutShape {
  threadDiameter: number
  outerDiameter: number
  height: number
  neckDiameter: number
  neckHeight: number
  flangeOuterDiameter: number
  flangeHeight: number
  serrations: number
  serrationDepth: number
}

export function validateClinchNutProps(
  p: ClinchNutShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.threadDiameter >= p.neckDiameter - 0.5 ||
    p.neckDiameter >= p.outerDiameter ||
    p.outerDiameter >= p.flangeOuterDiameter
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["neckDiameter"],
      message:
        "Clinch nut requires strictly increasing thread, neck, body, and flange diameters",
    })
  }
  if (p.neckHeight + p.flangeHeight >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["height"],
      message: "Neck and flange heights leave no rear barrel body",
    })
  }
  if (p.serrationDepth >= (p.flangeOuterDiameter - p.neckDiameter) / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["serrationDepth"],
      message: "Serration depth cuts through clinch collar neck",
    })
  }
}
