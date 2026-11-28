import {
  type ShoulderWasherModelPropsInput,
  shoulderWasherModelPropsSchema,
} from "./schema"

export function getShoulderWasherDimensions(
  input: ShoulderWasherModelPropsInput = {},
) {
  const p = shoulderWasherModelPropsSchema.parse(input)
  const overallHeight = p.flangeHeight + p.bossLength
  const bossWallThickness = (p.bossOuterDiameter - p.innerDiameter) / 2
  const flangeRadialWidth = (p.outerDiameter - p.bossOuterDiameter) / 2
  return {
    ...p,
    overallHeight,
    bossWallThickness,
    flangeRadialWidth,
    bottomZ: 0,
    topZ: overallHeight,
  }
}
