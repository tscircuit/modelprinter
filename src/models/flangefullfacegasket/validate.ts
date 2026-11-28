import type { z } from "zod"

export interface FlangeFullFaceGasketShape {
  innerDiameter: number
  outerDiameter: number
  thickness: number
  holes: number
  flat: true
  boltCircleDiameter: number
  holeDiameter: number
}

export function validateFlangeFullFaceGasketProps(
  p: FlangeFullFaceGasketShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boltCircleDiameter - p.holeDiameter <= p.innerDiameter + 2) {
    ctx.addIssue({
      code: "custom",
      path: ["boltCircleDiameter"],
      message: "Bolt holes encroach on central fluid bore sealing land",
    })
  }
  if (p.boltCircleDiameter + p.holeDiameter >= p.outerDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["boltCircleDiameter"],
      message: "Bolt holes break out of gasket outer perimeter",
    })
  }
}
