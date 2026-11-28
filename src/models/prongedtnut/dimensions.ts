import {
  type ProngedTNutModelPropsInput,
  prongedTNutModelPropsSchema,
} from "./schema"

export function getProngedTNutDimensions(
  input: ProngedTNutModelPropsInput = {},
) {
  const p = prongedTNutModelPropsSchema.parse(input)
  return {
    ...p,
    barrelProjection: p.length - p.flangeHeight,
    baseZ: 0,
    topZ: p.length,
  }
}
