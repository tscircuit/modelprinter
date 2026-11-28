import {
  type PcbHolderModelPropsInput,
  pcbHolderModelPropsSchema,
} from "./schema"

export function getPcbHolderDimensions(input: PcbHolderModelPropsInput = {}) {
  const p = pcbHolderModelPropsSchema.parse(input)
  return {
    ...p,
    pillarOuterSpan: p.boardSpan + 2 * (p.jawWidth - p.grooveDepth),
  }
}
