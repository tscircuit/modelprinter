import type { z } from "zod"

export interface ThumbNutShape {
  threadDiameter: number
  outerDiameter: number
  height: number
  knurlPitch: number
  chamfer: number
  boreStyle: "through" | "blind"
  knurlStyle: "straightknurl" | "diamondknurl"
}

export function validateThumbNutProps(
  p: ThumbNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= p.outerDiameter - 3) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message: "Thread bore leaves insufficient knurled thumb collar wall",
    })
  }
  if (2 * p.chamfer >= p.height - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["chamfer"],
      message: "End chamfers consume knurled grip band height",
    })
  }
  if (p.knurlPitch >= p.outerDiameter / 3) {
    ctx.addIssue({
      code: "custom",
      path: ["knurlPitch"],
      message: "Knurl pitch is too coarse for thumb nut diameter",
    })
  }
}
