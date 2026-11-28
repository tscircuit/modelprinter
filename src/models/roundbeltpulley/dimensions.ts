import {
  type RoundBeltPulleyModelPropsInput,
  roundBeltPulleyModelPropsSchema,
} from "./schema"

export function getRoundBeltPulleyDimensions(
  input: RoundBeltPulleyModelPropsInput = {},
) {
  const p = roundBeltPulleyModelPropsSchema.parse(input)
  const grooveRootDiameter = p.outerDiameter - 2 * p.grooveRadius
  return {
    ...p,
    grooveRootDiameter,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
