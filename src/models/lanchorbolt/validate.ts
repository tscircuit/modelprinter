import type { z } from "zod"

export interface LAnchorBoltShape {
  threadDiameter: number
  length: number
  legLength: number
  bendRadius: number
  threadLength: number
  bendAngle: number
}

export function validateLAnchorBoltProps(
  p: LAnchorBoltShape,
  ctx: z.RefinementCtx,
): void {
  if (p.bendRadius < p.threadDiameter / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["bendRadius"],
      message: "Centerline bend radius kinks round anchor rod",
    })
  }
  if (p.threadLength + p.bendRadius >= p.length - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["threadLength"],
      message: "Threaded end and elbow radius exceed vertical anchor height",
    })
  }
  if (p.legLength <= p.bendRadius + p.threadDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["legLength"],
      message: "Horizontal hook leg is shorter than bend elbow",
    })
  }
}
