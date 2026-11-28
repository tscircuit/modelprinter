import {
  type FlatBeltPulleyModelPropsInput,
  flatBeltPulleyModelPropsSchema,
} from "./schema"

export function getFlatBeltPulleyDimensions(
  input: FlatBeltPulleyModelPropsInput = {},
) {
  const p = flatBeltPulleyModelPropsSchema.parse(input)
  const radialThickness = (p.outerDiameter - p.boreDiameter) / 2
  return {
    ...p,
    radialThickness,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
