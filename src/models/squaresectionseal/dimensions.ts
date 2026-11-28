import {
  type SquareSectionSealModelPropsInput,
  squareSectionSealModelPropsSchema,
} from "./schema"

export function getSquareSectionSealDimensions(
  input: SquareSectionSealModelPropsInput = {},
) {
  const p = squareSectionSealModelPropsSchema.parse(input)
  const outerDiameter = p.innerDiameter + 2 * p.sectionWidth
  const flatLandWidth = p.sectionWidth - 2 * p.cornerRadius
  return {
    ...p,
    outerDiameter,
    flatLandWidth,
    bottomZ: -p.sectionWidth / 2,
    topZ: p.sectionWidth / 2,
  }
}
