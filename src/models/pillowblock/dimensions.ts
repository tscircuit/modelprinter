import {
  type PillowBlockModelPropsInput,
  pillowBlockModelPropsSchema,
} from "./schema"

export function getPillowBlockDimensions(
  input: PillowBlockModelPropsInput = {},
) {
  const p = pillowBlockModelPropsSchema.parse(input)
  const shaftCenterHeight = p.height * 0.52
  const baseThickness = Math.max(8, p.height * 0.22)
  return {
    ...p,
    shaftCenterHeight,
    baseThickness,
    leftSlotX: -p.slotPitch / 2,
    rightSlotX: p.slotPitch / 2,
    bottomZ: 0,
    topZ: p.height,
  }
}
