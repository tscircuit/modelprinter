import {
  type SteppedShaftModelPropsInput,
  steppedShaftModelPropsSchema,
} from "./schema"

export function getSteppedShaftDimensions(
  input: SteppedShaftModelPropsInput = {},
) {
  const p = steppedShaftModelPropsSchema.parse(input)
  const centerLength = p.length - 2 * p.endLength
  const shoulderStepHeight = (p.diameter - p.endDiameter) / 2
  return {
    ...p,
    centerLength,
    shoulderStepHeight,
    bottomZ: 0,
    topZ: p.length,
  }
}
