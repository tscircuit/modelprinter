import type { z } from "zod"

export interface PillowBlockShape {
  boreDiameter: number
  length: number
  width: number
  height: number
  base2Slot: true
  slotWidth: number
  slotLength: number
  slotPitch: number
}

export function validatePillowBlockProps(
  p: PillowBlockShape,
  ctx: z.RefinementCtx,
): void {
  if (p.slotLength < p.slotWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["slotLength"],
      message: "Mounting slot length must be at least its width",
    })
  }
  if (p.slotWidth >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Mounting slot width must fit within the pedestal base width",
    })
  }
  if (p.slotPitch + p.slotLength >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["slotPitch"],
      message:
        "Slotted bolt centers plus slot length must stay inside base length",
    })
  }
  if (
    p.boreDiameter >= p.height * 0.75 ||
    p.boreDiameter >= p.slotPitch - p.slotLength
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message:
        "Shaft bore must fit inside the pedestal ring between the base slots",
    })
  }
}
