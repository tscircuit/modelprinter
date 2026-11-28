import type { z } from "zod"

export interface VRollerBearingShape {
  boreDiameter: number
  outerDiameter: number
  width: number
  grooveAngle: number
  grooveDepth: number
  vGroove: true
  boreMount: true
}

export function validateVRollerBearingProps(
  p: VRollerBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.outerDiameter - 2 * p.grooveDepth - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message:
        "V-groove root diameter leaves insufficient inner bearing ring wall",
    })
  }
  const mouthWidth =
    2 * p.grooveDepth * Math.tan((p.grooveAngle * Math.PI) / 360)
  if (mouthWidth >= p.width - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveAngle"],
      message: "V-groove mouth width exceeds outer ring axial width",
    })
  }
}
