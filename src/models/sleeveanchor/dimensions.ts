import {
  type SleeveAnchorModelPropsInput,
  sleeveAnchorModelPropsSchema,
} from "./schema"

export function getSleeveAnchorDimensions(
  input: SleeveAnchorModelPropsInput = {},
) {
  const p = sleeveAnchorModelPropsSchema.parse(input)
  return {
    ...p,
    unslottedSleeveLength: p.sleeveLength - p.slotLength,
    bottomZ: 0,
    topZ: p.length,
  }
}
