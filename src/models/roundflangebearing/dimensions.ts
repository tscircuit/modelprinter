import {
  type RoundFlangeBearingModelPropsInput,
  roundFlangeBearingModelPropsSchema,
} from "./schema"

export function getRoundFlangeBearingDimensions(
  input: RoundFlangeBearingModelPropsInput = {},
) {
  const p = roundFlangeBearingModelPropsSchema.parse(input)
  const flangeThickness = Math.min(12, p.depth * 0.35)
  return {
    ...p,
    flangeThickness,
    mountingHoleCount: 4,
    bottomZ: 0,
    topZ: p.depth,
  }
}
