import {
  type ConicalSpringModelPropsInput,
  conicalSpringModelPropsSchema,
} from "./schema"

export function getConicalSpringDimensions(
  input: ConicalSpringModelPropsInput = {},
) {
  const p = conicalSpringModelPropsSchema.parse(input)
  const baseInnerDiameter = p.outerDiameter - 2 * p.wireDiameter
  const endInnerDiameter = p.endOuterDiameter - 2 * p.wireDiameter
  const solidHeight = p.turns * p.wireDiameter
  return {
    ...p,
    baseInnerDiameter,
    endInnerDiameter,
    solidHeight,
    bottomZ: 0,
    topZ: p.length,
  }
}
