import {
  type BallScrewNutModelPropsInput,
  ballScrewNutModelPropsSchema,
} from "./schema"

export function getBallScrewNutDimensions(
  input: BallScrewNutModelPropsInput = {},
) {
  const p = ballScrewNutModelPropsSchema.parse(input)
  const radialWallThickness = (p.outerDiameter - p.boreDiameter) / 2
  return {
    ...p,
    radialWallThickness,
    bottomZ: 0,
    topZ: p.length,
  }
}
