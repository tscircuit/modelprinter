import {
  type ShelfSplitSleeveModelPropsInput,
  shelfSplitSleeveModelPropsSchema,
} from "./schema"

export function getShelfSplitSleeveDimensions(
  input: ShelfSplitSleeveModelPropsInput = {},
) {
  const p = shelfSplitSleeveModelPropsSchema.parse(input)
  return {
    ...p,
    ridgeInnerDiameter: p.innerDiameter - 2 * p.ridgeHeight,
    bottomZ: 0,
    topZ: p.height,
  }
}
