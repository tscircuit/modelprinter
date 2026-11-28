import type { z } from "zod"

export interface TSlotJoinPlateShapeOutput {
  length: number
  width: number
  thickness: number
  slotCount: number
  slot: [number, number]
  pitch: number
}

export function validateTSlotJoinPlateProps(
  props: TSlotJoinPlateShapeOutput,
  context: z.RefinementCtx,
) {
  const [slotWidth, slotLength] = props.slot
  if (!Number.isFinite(props.length * props.width * props.thickness)) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Plate envelope dimensions must be finite",
    })
    return
  }
  if (slotLength < slotWidth) {
    context.addIssue({
      code: "custom",
      path: ["slot"],
      message: "Slot length must be at least its width",
    })
    return
  }
  if (slotWidth >= props.width) {
    context.addIssue({
      code: "custom",
      path: ["slot"],
      message: "Slot width must leave material at both width edges",
    })
  }
  if (props.pitch <= slotLength) {
    context.addIssue({
      code: "custom",
      path: ["pitch"],
      message:
        "Slot pitch must exceed overall slot length to leave separating ligaments",
    })
  }
  const totalSpan = (props.slotCount - 1) * props.pitch + slotLength
  if (!Number.isFinite(totalSpan) || totalSpan >= props.length) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Collinear slot array must leave material at both plate ends",
    })
  }
}
