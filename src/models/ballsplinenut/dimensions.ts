import {
  type BallSplineNutModelPropsInput,
  ballSplineNutModelPropsSchema,
} from "./schema"

export function getBallSplineNutDimensions(
  input: BallSplineNutModelPropsInput = {},
) {
  const p = ballSplineNutModelPropsSchema.parse(input)
  const radialWallThickness = (p.outerDiameter - p.boreDiameter) / 2
  return {
    ...p,
    radialWallThickness,
    bottomZ: 0,
    topZ: p.length,
  }
}
