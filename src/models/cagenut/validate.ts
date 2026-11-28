import type { z } from "zod"

export interface CageNutShape {
  threadDiameter: number
  nutWidth: number
  nutHeight: number
  cageWidth: number
  cageHeight: number
  wallThickness: number
  earSpan: number
  opposedEars: true
}

export function validateCageNutProps(
  p: CageNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= p.nutWidth - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message: "Thread bore exceeds captive square nut width",
    })
  }
  if (
    p.nutWidth + 2 * p.wallThickness > p.cageWidth ||
    p.nutHeight + 2 * p.wallThickness > p.cageHeight
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["cageWidth"],
      message: "Spring cage envelope cannot enclose captive square nut",
    })
  }
  if (p.earSpan <= p.cageWidth + 1) {
    ctx.addIssue({
      code: "custom",
      path: ["earSpan"],
      message: "Snap-in ear span must project beyond cage body width",
    })
  }
}
