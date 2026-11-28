import type { z } from "zod"

export interface IdlerSprocketShape {
  teeth: number
  pitch: number
  boreDiameter: number
  toothWidth: number
  rollerDiameter: number
  tipOuterDiameter: number
  rootOuterDiameter: number
  strands: number
  rollerPocket: true
  bearingBore: true
}

export function validateIdlerSprocketProps(
  p: IdlerSprocketShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.boreDiameter >= p.rootOuterDiameter - 8 ||
    p.rootOuterDiameter >= p.tipOuterDiameter - 4
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["rootOuterDiameter"],
      message:
        "Sprocket requires ordered bearing bore, root circle, and tip diameters",
    })
  }
  if (p.rollerDiameter >= p.pitch - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["rollerDiameter"],
      message: "Chain roller pocket diameter exceeds chain pitch",
    })
  }
}
