import type { z } from "zod"

export interface ExternalToothWasherShape {
  custom: true
  innerDiameter: number
  bodyOuterDiameter: number
  outerDiameter: number
  thickness: number
  teeth: number
  toothWidth: number
  twistAngle: number
}

export function validateExternalToothWasherProps(
  p: ExternalToothWasherShape,
  ctx: z.RefinementCtx,
): void {
  if (p.bodyOuterDiameter <= p.innerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["bodyOuterDiameter"],
      message: "Central ring outer diameter must exceed inner bore diameter",
    })
  }
  if (p.outerDiameter <= p.bodyOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Tooth tip outer diameter must exceed central ring diameter",
    })
  }
  const rootCircumference = Math.PI * p.bodyOuterDiameter
  if (p.teeth * p.toothWidth >= rootCircumference) {
    ctx.addIssue({
      code: "custom",
      path: ["toothWidth"],
      message:
        "Total tooth root width must be smaller than the central ring circumference",
    })
  }
}
