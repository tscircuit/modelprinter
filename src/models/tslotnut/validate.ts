import type { z } from "zod"

export interface TSlotNutShape {
  threadDiameter: number
  width: number
  length: number
  height: number
  topWidth: number
  topHeight: number
  endStyle: "flatends" | "roundedends"
  boreStyle: "through" | "blind"
}

export function validateTSlotNutProps(
  p: TSlotNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.topWidth >= p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["topWidth"],
      message: "Raised neck width leaves no T-slot retention flange",
    })
  }
  if (p.topHeight >= p.height - 1.5) {
    ctx.addIssue({
      code: "custom",
      path: ["topHeight"],
      message: "Raised neck height leaves insufficient lower flange thickness",
    })
  }
  if (p.threadDiameter >= p.topWidth - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message: "Thread diameter exceeds raised T-slot neck width",
    })
  }
}
