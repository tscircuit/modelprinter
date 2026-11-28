import type { z } from "zod"

export interface DrillPressViseShape {
  jawWidth: number
  jawHeight: number
  maxOpening: number
  bodyLength: number
  bodyWidth: number
  height: number
  mountSlots: number
  slotWidth: number
  slotLength: number
  pitchX: number
  pitchY: number
}

export function validateDrillPressViseProps(
  p: DrillPressViseShape,
  ctx: z.RefinementCtx,
): void {
  if (p.jawWidth > p.bodyWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["jawWidth"],
      message: "Jaw width cannot exceed outer vise body width",
    })
  }
  if (p.jawHeight >= p.height - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["jawHeight"],
      message: "Jaw height leaves insufficient lower guide rail thickness",
    })
  }
  if (p.maxOpening >= p.bodyLength - 30) {
    ctx.addIssue({
      code: "custom",
      path: ["maxOpening"],
      message: "Maximum jaw opening exceeds vise frame length",
    })
  }
  if (
    p.pitchX + p.slotLength > p.bodyLength ||
    p.pitchY + p.slotWidth > p.bodyWidth
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchX"],
      message: "Table mounting slots break through vise base envelope",
    })
  }
}
