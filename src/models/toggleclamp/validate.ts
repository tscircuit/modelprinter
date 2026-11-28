import type { z } from "zod"

export interface ToggleClampShape {
  baseWidth: number
  baseLength: number
  baseThickness: number
  holes: number
  holeDiameter: number
  pitchX: number
  pitchY: number
  armLength: number
  armWidth: number
  armHeight: number
  pivotHeight: number
  handleLength: number
  padOuterDiameter: number
  vertical: boolean
  closed: boolean
}

export function validateToggleClampProps(
  p: ToggleClampShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.pitchX + p.holeDiameter > p.baseWidth - 2 ||
    p.pitchY + p.holeDiameter > p.baseLength - 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchX"],
      message: "Base mounting holes break through flanged foot",
    })
  }
  if (p.pivotHeight <= p.baseThickness + p.armHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["pivotHeight"],
      message: "Linkage pivot height must clear base plate and clamping arm",
    })
  }
}
