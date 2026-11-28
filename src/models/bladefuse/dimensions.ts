import {
  type BladeFuseModelPropsInput,
  bladeFuseModelPropsSchema,
} from "./schema"

export function getBladeFuseDimensions(input: BladeFuseModelPropsInput = {}) {
  const p = bladeFuseModelPropsSchema.parse(input)
  const overallHeight = p.bodyHeight + p.bladeLength
  const bladeOuterSpan = p.pitch + p.bladeWidth
  const bladeInnerGap = p.pitch - p.bladeWidth
  return {
    ...p,
    overallHeight,
    bladeOuterSpan,
    bladeInnerGap,
    bottomZ: -p.bladeLength,
    topZ: p.bodyHeight,
  }
}
