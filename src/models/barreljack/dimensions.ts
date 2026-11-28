import {
  type BarrelJackModelPropsInput,
  barrelJackModelPropsSchema,
} from "./schema"

export function getBarrelJackDimensions(input: BarrelJackModelPropsInput = {}) {
  const p = barrelJackModelPropsSchema.parse(input)
  const cavityDiameter = Math.min(
    p.plugOuterDiameter + 0.2,
    Math.min(p.width, p.height) - 0.6,
  )
  const barrelCenterZ = p.height / 2
  const annularPlugClearance = (p.plugOuterDiameter - p.centerPinDiameter) / 2
  return {
    ...p,
    cavityDiameter,
    barrelCenterZ,
    annularPlugClearance,
    frontY: -p.length / 2,
    rearY: p.length / 2,
    bottomZ: 0,
    topZ: p.height,
  }
}
