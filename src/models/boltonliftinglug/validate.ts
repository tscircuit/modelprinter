import type { z } from "zod"

export interface BoltOnLiftingLugShape {
  baseWidth: number
  baseDepth: number
  baseThickness: number
  height: number
  lugWidth: number
  lugThickness: number
  eyeDiameter: number
  eyeZ: number
  topRadius: number
  mounts: number
  holeDiameter: number
  pitchX: number
  pitchY: number
  gussets: number
  gussetThickness: number
  gussetHeight: number
}

export function validateBoltOnLiftingLugProps(
  p: BoltOnLiftingLugShape,
  ctx: z.RefinementCtx,
): void {
  if (p.eyeDiameter >= 2 * p.topRadius - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["eyeDiameter"],
      message: "Shackle eye diameter leaves insufficient upper lug ligament",
    })
  }
  if (
    p.pitchX > p.baseWidth - p.holeDiameter - 4 ||
    p.pitchY > p.baseDepth - p.holeDiameter - 4
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchX"],
      message: "Base mounting holes break through flange perimeter",
    })
  }
  if (p.gussetHeight > p.height - p.baseThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["gussetHeight"],
      message: "Side gusset height exceeds upright lug web",
    })
  }
}
