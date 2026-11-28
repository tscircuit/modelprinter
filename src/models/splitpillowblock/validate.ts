import type { z } from "zod"

export interface SplitPillowBlockShape {
  boreDiameter: number
  length: number
  width: number
  height: number
  slotPitch: number
  slotWidth: number
  slotLength: number
  base2Slot: true
}

export function validateSplitPillowBlockProps(
  p: SplitPillowBlockShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.height - 20) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Bearing seat bore exceeds split pedestal cap/base wall",
    })
  }
  if (p.slotWidth >= p.slotLength || p.slotWidth >= p.width - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Mounting slot dimensions exceed base foot geometry",
    })
  }
  if (p.slotPitch + p.slotLength > p.length - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["slotPitch"],
      message: "Slotted base bolts break through pedestal ends",
    })
  }
}
