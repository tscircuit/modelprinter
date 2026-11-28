import type { z } from "zod"

export interface EdgeClampShape {
  length: number
  width: number
  height: number
  jawTravel: number
  jawWidth: number
  jawHeight: number
  holes: number
  holeDiameter: number
  holePitch: number
  driveThreadDiameter: number
}

export function validateEdgeClampProps(
  p: EdgeClampShape,
  ctx: z.RefinementCtx,
): void {
  if (p.jawWidth > p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["jawWidth"],
      message: "Guided jaw width cannot exceed clamp body width",
    })
  }
  if (p.jawHeight >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["jawHeight"],
      message: "Guided jaw height must fit within clamp body height",
    })
  }
  if (p.holePitch + p.holeDiameter > p.length - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Mounting hole pitch breaks through clamp body length",
    })
  }
}
