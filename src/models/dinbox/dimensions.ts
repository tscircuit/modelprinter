import { type DinBoxModelPropsInput, dinBoxModelPropsSchema } from "./schema"

export function getDinBoxDimensions(input: DinBoxModelPropsInput = {}) {
  const p = dinBoxModelPropsSchema.parse(input)
  const innerWidth = p.width - 2 * p.wallThickness
  const innerHeight = p.height - 2 * p.wallThickness
  const railSlotWidth = 35.4
  const railSlotDepth = 7.5
  return {
    ...p,
    innerWidth,
    innerHeight,
    railSlotWidth,
    railSlotDepth,
    bottomZ: 0,
    topZ: p.depth,
  }
}
