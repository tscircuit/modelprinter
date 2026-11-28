import {
  type ClevisForkModelPropsInput,
  clevisForkModelPropsSchema,
} from "./schema"

export function getClevisForkDimensions(input: ClevisForkModelPropsInput = {}) {
  const p = clevisForkModelPropsSchema.parse(input)
  return {
    ...p,
    overallForkWidth: p.slotGap + 2 * p.armThickness,
  }
}
