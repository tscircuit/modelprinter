import {
  type GridGratingModelPropsInput,
  gridGratingModelPropsSchema,
} from "./schema"

export function getGridGratingDimensions(
  input: GridGratingModelPropsInput = {},
) {
  const p = gridGratingModelPropsSchema.parse(input)
  return {
    ...p,
    cellOpeningWidth: p.bearingBarPitch - p.bearingBarThickness,
    cellOpeningLength: p.crossBarPitch - p.crossBarThickness,
    bottomZ: 0,
    topZ: p.bearingBarHeight,
  }
}
