import type { z } from "zod"

export interface ToeClampShape {
  length: number
  width: number
  height: number
  toeLength: number
  toeHeight: number
  mountSlotWidth: number
  mountSlotLength: number
  slotCenter: number
}

export function validateToeClampProps(
  p: ToeClampShape,
  ctx: z.RefinementCtx,
): void {
  if (p.toeLength >= p.length / 2 || p.toeHeight >= p.height - 5) {
    ctx.addIssue({
      code: "custom",
      path: ["toeLength"],
      message: "Low-profile clamping toe dimensions eliminate stepped body",
    })
  }
  if (p.mountSlotWidth >= p.width - 8) {
    ctx.addIssue({
      code: "custom",
      path: ["mountSlotWidth"],
      message: "Adjustment slot width breaks through clamp side walls",
    })
  }
  if (
    p.slotCenter - p.mountSlotLength / 2 <= p.toeLength + 2 ||
    p.slotCenter + p.mountSlotLength / 2 >= p.length - 4
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["slotCenter"],
      message: "Longitudinal bolt slot collides with toe step or rear heel",
    })
  }
}
