import type { z } from "zod"

export interface EyeHookShape {
  height: number
  width: number
  bodyDiameter: number
  throatOpening: number
  bendRadius: number
  eyeInnerDiameter: number
  eyeOuterDiameter: number
  noLatch: true
}

export function validateEyeHookProps(
  p: EyeHookShape,
  ctx: z.RefinementCtx,
): void {
  if (p.eyeInnerDiameter >= p.eyeOuterDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["eyeInnerDiameter"],
      message: "Top suspension eye ID must leave positive eye ring wall",
    })
  }
  if (p.throatOpening + p.bodyDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["throatOpening"],
      message: "Hook throat opening plus shank diameter exceeds hook width",
    })
  }
}
