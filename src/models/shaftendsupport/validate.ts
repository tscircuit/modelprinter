import type { z } from "zod"

export interface ShaftEndSupportShape {
  boreDiameter: number
  width: number
  height: number
  depth: number
  base2Hole: true
  holePitch: number
  holeDiameter: number
  clampThread: string
}

export function validateShaftEndSupportProps(
  p: ShaftEndSupportShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= Math.min(p.width, p.height) - 8) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Shaft bore exceeds upright SK-style support cheeks",
    })
  }
  if (p.holePitch + p.holeDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Base mounting hole pitch exceeds support foot width",
    })
  }
}
