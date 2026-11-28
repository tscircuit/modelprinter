import {
  type TSlotFloorBracketModelPropsInput,
  tSlotFloorBracketModelPropsSchema,
} from "./schema"

export function getTSlotFloorBracketDimensions(
  input: TSlotFloorBracketModelPropsInput = {},
) {
  const p = tSlotFloorBracketModelPropsSchema.parse(input)
  return {
    ...p,
    gussetDepth: p.depth - p.thickness,
    gussetHeight: p.height - p.thickness,
    floorZ: 0,
    topZ: p.height,
  }
}
