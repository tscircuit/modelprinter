import type { z } from "zod"

export interface MagneticBaseShape {
  baseLength: number
  baseWidth: number
  baseHeight: number
  armLength: number
  armDiameter: number
  jointDiameter: number
  clampBoreDiameter: number
}

export function validateMagneticBaseProps(
  p: MagneticBaseShape,
  ctx: z.RefinementCtx,
): void {
  if (p.armDiameter >= p.jointDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["armDiameter"],
      message:
        "Support arm rod diameter must be smaller than central locking joint",
    })
  }
  if (p.jointDiameter > Math.min(p.baseLength, p.baseWidth)) {
    ctx.addIssue({
      code: "custom",
      path: ["jointDiameter"],
      message: "Locking joint diameter exceeds magnetic base footprint",
    })
  }
  if (p.clampBoreDiameter >= p.jointDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["clampBoreDiameter"],
      message: "Indicator stem clamp bore exceeds locking knuckle capacity",
    })
  }
}
