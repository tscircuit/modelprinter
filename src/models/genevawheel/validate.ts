import type { z } from "zod"

export interface GenevaWheelShape {
  outerDiameter: number
  width: number
  boreDiameter: number
  slots: number
  keyway: true
  keyWidth: number
  slotWidth: number
  lockRadius: number
}

export function validateGenevaWheelProps(
  p: GenevaWheelShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Shaft bore leaves insufficient radial slot root web",
    })
  }
  if (p.keyWidth >= p.boreDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["keyWidth"],
      message: "Keyway width must be narrower than shaft bore diameter",
    })
  }
  if (p.slotWidth >= p.outerDiameter * 0.25) {
    ctx.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Drive-pin slot width exceeds Geneva wheel petal width",
    })
  }
  if (p.lockRadius >= p.outerDiameter * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["lockRadius"],
      message: "Concave dwell locking arc radius exceeds wheel outer radius",
    })
  }
}
