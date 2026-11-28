import {
  type CircularBlankModelPropsInput,
  circularBlankModelPropsSchema,
} from "./schema"

export function getCircularBlankDimensions(
  input: CircularBlankModelPropsInput = {},
) {
  const p = circularBlankModelPropsSchema.parse(input)
  return {
    ...p,
    flatFaceDiameter: p.diameter - 2 * p.rimRadius,
    bottomZ: -p.thickness / 2,
    topZ: p.thickness / 2,
  }
}
