import {
  type DoubleBallBearingModelPropsInput,
  doubleBallBearingModelPropsSchema,
} from "./schema"

export function getDoubleBallBearingDimensions(
  input: DoubleBallBearingModelPropsInput = {},
) {
  const p = doubleBallBearingModelPropsSchema.parse(input)
  const pitchDiameter = (p.innerDiameter + p.outerDiameter) / 2
  const rowAxialSpacing = p.width * 0.45
  return {
    ...p,
    pitchDiameter,
    rowAxialSpacing,
    bottomZ: 0,
    topZ: p.width,
  }
}
