import {
  type ConcreteScrewModelPropsInput,
  concreteScrewModelPropsSchema,
} from "./schema"

export function getConcreteScrewDimensions(
  input: ConcreteScrewModelPropsInput = {},
) {
  const p = concreteScrewModelPropsSchema.parse(input)
  const overallLength = p.length + p.headHeight
  return {
    ...p,
    overallLength,
    bottomZ: -p.length,
    topZ: p.headHeight,
  }
}
