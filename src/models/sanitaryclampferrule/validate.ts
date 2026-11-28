import type { z } from "zod"

export interface SanitaryClampFerruleShape {
  tubeOuterDiameter: number
  tubeInnerDiameter: number
  flangeOuterDiameter: number
  length: number
  din32676: true
  seriesC: true
}

export function validateSanitaryClampFerruleProps(
  p: SanitaryClampFerruleShape,
  ctx: z.RefinementCtx,
): void {
  if (p.tubeInnerDiameter >= p.tubeOuterDiameter - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["tubeInnerDiameter"],
      message: "Sanitary tube inner bore exceeds weld neck outer diameter",
    })
  }
  if (p.tubeOuterDiameter >= p.flangeOuterDiameter - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeOuterDiameter"],
      message: "Tri-clamp flange diameter leaves no V-band clamping bevel",
    })
  }
  if (p.length < 10) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message: "Ferrule weld neck length is too short for clamp clearance",
    })
  }
}
