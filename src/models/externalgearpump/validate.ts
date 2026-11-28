import type { z } from "zod"

export interface ExternalGearPumpShape {
  portNominal: number
  width: number
  length: number
  height: number
  shaftOuterDiameter: number
  flangeWidth: number
  flangeThickness: number
  holePitch: number
  holeDiameter: number
  frontFlange: boolean
}

export function validateExternalGearPumpProps(
  p: ExternalGearPumpShape,
  ctx: z.RefinementCtx,
): void {
  if (p.flangeWidth < p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeWidth"],
      message: "Front mounting flange width must be at least housing width",
    })
  }
  if (p.holePitch + p.holeDiameter > p.flangeWidth - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Flange mounting holes break through flange outer edge",
    })
  }
  if (p.flangeThickness >= p.length - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeThickness"],
      message: "Flange thickness leaves insufficient gear chamber length",
    })
  }
}
