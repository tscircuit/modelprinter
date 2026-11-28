import {
  type FlangedBallBearingModelPropsInput,
  flangedBallBearingModelPropsSchema,
} from "./schema"

export function getFlangedBallBearingDimensions(
  input: FlangedBallBearingModelPropsInput = {},
) {
  const p = flangedBallBearingModelPropsSchema.parse(input)
  return {
    ...p,
    flangeRadialOverhang: (p.flangeOuterDiameter - p.outerDiameter) / 2,
    pilotLength: p.width - p.flangeThickness,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
