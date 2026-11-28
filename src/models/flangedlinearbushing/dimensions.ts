import {
  type FlangedLinearBushingModelPropsInput,
  flangedLinearBushingModelPropsSchema,
} from "./schema"

export function getFlangedLinearBushingDimensions(
  input: FlangedLinearBushingModelPropsInput = {},
) {
  const p = flangedLinearBushingModelPropsSchema.parse(input)
  const flangeThickness = Math.min(6, p.length * 0.2)
  return {
    ...p,
    flangeThickness,
    mountingHoleCount: 4,
    bottomZ: 0,
    topZ: p.length,
  }
}
