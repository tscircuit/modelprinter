import type { z } from "zod"

export interface FlatBeltPulleyShape {
  outerDiameter: number
  boreDiameter: number
  width: number
  flatRim: true
  keyway: true
  keyWidth: number
}

export function validateFlatBeltPulleyProps(
  p: FlatBeltPulleyShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter - 8) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Shaft bore leaves insufficient flat pulley rim wall",
    })
  }
  if (p.keyWidth >= p.boreDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["keyWidth"],
      message: "Keyway width must be narrower than shaft bore diameter",
    })
  }
}
