import {
  type SplinedShaftModelPropsInput,
  splinedShaftModelPropsSchema,
} from "./schema"

export function getSplinedShaftDimensions(
  input: SplinedShaftModelPropsInput = {},
) {
  const p = splinedShaftModelPropsSchema.parse(input)
  return {
    ...p,
    toothRadialHeight: (p.outerDiameter - p.rootDiameter) / 2,
    startZ: 0,
    endZ: p.length,
  }
}
