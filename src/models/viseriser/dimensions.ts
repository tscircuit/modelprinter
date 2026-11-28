import {
  type ViseRiserModelPropsInput,
  viseRiserModelPropsSchema,
} from "./schema"

export function getViseRiserDimensions(input: ViseRiserModelPropsInput = {}) {
  const p = viseRiserModelPropsSchema.parse(input)
  return {
    ...p,
    topDeckThickness: p.height - p.coreHeight - p.topSeatDepth,
  }
}
