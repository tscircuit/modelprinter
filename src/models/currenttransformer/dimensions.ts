import {
  type CurrentTransformerModelPropsInput,
  currentTransformerModelPropsSchema,
} from "./schema"

export function getCurrentTransformerDimensions(
  input: CurrentTransformerModelPropsInput = {},
) {
  const p = currentTransformerModelPropsSchema.parse(input)
  const coreRadialWall = (p.width - p.boreDiameter) / 2
  return {
    ...p,
    coreRadialWall,
    bottomZ: 0,
    topZ: p.height,
  }
}
