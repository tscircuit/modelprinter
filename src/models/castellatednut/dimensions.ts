import {
  type CastellatedNutModelPropsInput,
  castellatedNutModelPropsSchema,
} from "./schema"

export function getCastellatedNutDimensions(
  input: CastellatedNutModelPropsInput = {},
) {
  const p = castellatedNutModelPropsSchema.parse(input)
  return {
    ...p,
    hexBaseHeight: p.height - p.castleHeight,
    acrossCorners: (2 * p.acrossFlats) / Math.sqrt(3),
    bottomZ: 0,
    topZ: p.height,
  }
}
