import { type ViseJawModelPropsInput, viseJawModelPropsSchema } from "./schema"

export function getViseJawDimensions(input: ViseJawModelPropsInput = {}) {
  const p = viseJawModelPropsSchema.parse(input)
  const lowerClampingHeight = p.height - p.stepHeight
  return {
    ...p,
    lowerClampingHeight,
    bottomZ: 0,
    topZ: p.height,
  }
}
