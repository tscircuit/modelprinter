import { type DShaftModelPropsInput, dShaftModelPropsSchema } from "./schema"

export function getDShaftDimensions(input: DShaftModelPropsInput = {}) {
  const p = dShaftModelPropsSchema.parse(input)
  const radius = p.diameter / 2
  const flatDepth = radius - p.flatDistance
  const thicknessAcrossFlat = radius + p.flatDistance
  return {
    ...p,
    radius,
    flatDepth,
    thicknessAcrossFlat,
    bottomZ: 0,
    topZ: p.length,
  }
}
