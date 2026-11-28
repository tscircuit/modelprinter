import type { z } from "zod"

export interface CartridgeBearingShape {
  boreDiameter: number
  outerDiameter: number
  length: number
  cylindricalFit: true
  locatingFlangeOuterDiameter: number
  flangeHeight: number
}

export function validateCartridgeBearingProps(
  p: CartridgeBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Shaft bore leaves insufficient cartridge housing wall",
    })
  }
  if (p.locatingFlangeOuterDiameter <= p.outerDiameter + 2) {
    ctx.addIssue({
      code: "custom",
      path: ["locatingFlangeOuterDiameter"],
      message: "Locating end flange OD must exceed cylindrical cartridge OD",
    })
  }
  if (p.flangeHeight >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeHeight"],
      message: "Locating flange height must be shorter than overall cartridge",
    })
  }
}
