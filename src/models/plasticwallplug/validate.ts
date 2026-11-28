import type { z } from "zod"

export interface PlasticWallPlugShape {
  outerDiameter: number
  length: number
  boreDiameter: number
  slots: number
  slotLength: number
  ribs: number
  ribHeight: number
  ribPitch: number
  flangeOuterDiameter: number
  flangeHeight: number
  unset: true
}

export function validatePlasticWallPlugProps(
  p: PlasticWallPlugShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.boreDiameter >= p.outerDiameter - 1.5 ||
    p.outerDiameter >= p.flangeOuterDiameter - 1
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message:
        "Wall plug requires ordered pilot bore, shank, and collar diameters",
    })
  }
  if (
    p.slotLength >= p.length - p.flangeHeight - 3 ||
    (p.ribs - 1) * p.ribPitch >= p.length - p.flangeHeight
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["ribPitch"],
      message: "Expansion slots or annular ribs exceed wall plug shank length",
    })
  }
}
