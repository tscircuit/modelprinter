import {
  type RodWiperSealModelPropsInput,
  rodWiperSealModelPropsSchema,
} from "./schema"

export function getRodWiperSealDimensions(
  input: RodWiperSealModelPropsInput = {},
) {
  const p = rodWiperSealModelPropsSchema.parse(input)
  const scraperLipHeight = p.height - p.baseThickness
  return {
    ...p,
    scraperLipHeight,
    bottomZ: 0,
    topZ: p.height,
  }
}
