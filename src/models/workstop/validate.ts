import type { z } from "zod"

export interface WorkStopShape {
  baseLength: number
  baseWidth: number
  baseThickness: number
  armLength: number
  armDiameter: number
  tipDiameter: number
  tipLength: number
  mountHoles: number
  holeDiameter: number
  holePitch: number
}

export function validateWorkStopProps(
  p: WorkStopShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitch + p.holeDiameter > p.baseLength - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Base mounting hole pitch breaks through work stop base length",
    })
  }
  if (p.holeDiameter >= p.baseWidth - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Mounting hole diameter exceeds base width margin",
    })
  }
  if (p.tipDiameter > p.armDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["tipDiameter"],
      message: "Contact tip diameter cannot exceed adjustable arm diameter",
    })
  }
}
