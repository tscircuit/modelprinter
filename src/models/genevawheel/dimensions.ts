import {
  type GenevaWheelModelPropsInput,
  genevaWheelModelPropsSchema,
} from "./schema"

export function getGenevaWheelDimensions(
  input: GenevaWheelModelPropsInput = {},
) {
  const p = genevaWheelModelPropsSchema.parse(input)
  const indexAngleDeg = 360 / p.slots
  return {
    ...p,
    indexAngleDeg,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
