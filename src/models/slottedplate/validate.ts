import type { z } from "zod"

export interface SlottedPlateShape {
  length: number
  width: number
  thickness: number
  slotLength: number
  slotWidth: number
  pitchX: number
  pitchY: number
  edgeX: number
  edgeY: number
}

export function validateSlottedPlateProps(
  p: SlottedPlateShape,
  ctx: z.RefinementCtx,
): void {
  if (p.slotWidth >= p.slotLength) {
    ctx.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Slot width must be smaller than elongated slot length",
    })
  }
  if (p.slotLength >= p.pitchX - 1 || p.slotWidth >= p.pitchY - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["slotLength"],
      message:
        "Slot size leaves insufficient web bridge between adjacent slots",
    })
  }
  if (
    2 * p.edgeX + p.slotLength > p.length ||
    2 * p.edgeY + p.slotWidth > p.width
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["edgeX"],
      message: "Edge margins leave no room for slot grid inside plate",
    })
  }
}
