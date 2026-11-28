import type { z } from "zod"

export interface QuarterTurnFastenerShape {
  shankDiameter: number
  length: number
  headOuterDiameter: number
  headHeight: number
  slotWidth: number
  slotDepth: number
  crossPinDiameter: number
  crossPinLength: number
  pinOffset: number
  slotted: true
}

export function validateQuarterTurnFastenerProps(
  p: QuarterTurnFastenerShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.crossPinDiameter >= p.shankDiameter - 2 ||
    p.crossPinLength <= p.shankDiameter + 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["crossPinDiameter"],
      message:
        "Transverse cam cross-pin proportions are invalid for stud shank",
    })
  }
  if (
    p.pinOffset <= p.crossPinDiameter / 2 + 0.5 ||
    p.pinOffset >= p.length - 3
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pinOffset"],
      message: "Cross-pin offset breaks through stud tip or panel head",
    })
  }
  if (p.slotDepth >= p.headHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["slotDepth"],
      message: "Drive slot cuts completely through fastener head",
    })
  }
}
