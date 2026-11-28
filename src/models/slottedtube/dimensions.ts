import {
  type SlottedTubeModelPropsInput,
  slottedTubeModelPropsSchema,
} from "./schema"

export function getSlottedTubeDimensions(
  input: SlottedTubeModelPropsInput = {},
) {
  const p = slottedTubeModelPropsSchema.parse(input)
  const innerDiameter = p.outerDiameter - 2 * p.wallThickness
  const totalSlots = p.rows * p.around
  return {
    ...p,
    innerDiameter,
    totalSlots,
    bottomZ: 0,
    topZ: p.length,
  }
}
