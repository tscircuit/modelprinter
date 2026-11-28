import {
  type LinearBallBushingModelPropsInput,
  linearBallBushingModelPropsSchema,
} from "./schema"

export function getLinearBallBushingDimensions(
  input: LinearBallBushingModelPropsInput = {},
) {
  const p = linearBallBushingModelPropsSchema.parse(input)
  const radialWallThickness = (p.outerDiameter - p.innerDiameter) / 2
  const grooveDepth = Math.min(0.5, radialWallThickness * 0.15)
  const grooveDiameter = p.outerDiameter - 2 * grooveDepth
  const grooveSpan = p.circlipGrooves === 2 ? p.length * 0.72 : 0
  return {
    ...p,
    radialWallThickness,
    grooveDiameter,
    grooveSpan,
    bottomZ: 0,
    topZ: p.length,
  }
}
