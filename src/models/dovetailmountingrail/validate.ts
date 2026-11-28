import type { z } from "zod"

export interface DovetailMountingRailShape {
  baseWidth: number
  baseThickness: number
  length: number
  headWidth: number
  neckWidth: number
  dovetailHeight: number
  dovetailAngle: number
  holes: number
  holeDiameter: number
  holePitch: number
  endMargin: number
  counterboreDiameter: number
  counterboreDepth: number
}

export function validateDovetailMountingRailProps(
  p: DovetailMountingRailShape,
  ctx: z.RefinementCtx,
): void {
  if (p.neckWidth >= p.headWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["neckWidth"],
      message:
        "Dovetail neck width must be narrower than upper dovetail head width",
    })
  }
  if (p.headWidth > p.baseWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["headWidth"],
      message: "Dovetail head width cannot exceed rail base flange width",
    })
  }
  if ((p.holes - 1) * p.holePitch + 2 * p.endMargin > p.length + 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Bolt hole span plus end margins exceeds rail length",
    })
  }
  if (
    p.counterboreDiameter <= p.holeDiameter ||
    p.counterboreDepth >= p.baseThickness + p.dovetailHeight - 3
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["counterboreDiameter"],
      message: "Counterbore geometry invalid for rail thickness",
    })
  }
}
