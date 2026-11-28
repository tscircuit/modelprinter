import {
  type YokeFollowerModelPropsInput,
  yokeFollowerModelPropsSchema,
} from "./schema"

export function getYokeFollowerDimensions(
  input: YokeFollowerModelPropsInput = {},
) {
  const p = yokeFollowerModelPropsSchema.parse(input)
  return {
    ...p,
    radialSection: (p.outerDiameter - p.boreDiameter) / 2,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
