import {
  type OpenLinearBallBushingModelPropsInput,
  openLinearBallBushingModelPropsSchema,
} from "./schema"

export function getOpenLinearBallBushingDimensions(
  input: OpenLinearBallBushingModelPropsInput = {},
) {
  const p = openLinearBallBushingModelPropsSchema.parse(input)
  const slotChordWidth =
    p.innerDiameter * Math.sin((p.openingAngle * Math.PI) / 360)
  return {
    ...p,
    radialWallThickness: (p.outerDiameter - p.innerDiameter) / 2,
    slotChordWidth,
    bottomZ: 0,
    topZ: p.length,
  }
}
