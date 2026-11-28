import {
  type CableSheaveModelPropsInput,
  cableSheaveModelPropsSchema,
} from "./schema"

export function getCableSheaveDimensions(
  input: CableSheaveModelPropsInput = {},
) {
  const p = cableSheaveModelPropsSchema.parse(input)
  const treadRootDiameter = p.outerDiameter - 2 * p.grooveDepth
  return {
    ...p,
    treadRootDiameter,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
