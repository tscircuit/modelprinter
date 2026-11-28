import {
  type TSlotNutModelPropsInput,
  tSlotNutModelPropsSchema,
} from "./schema"

export function getTSlotNutDimensions(input: TSlotNutModelPropsInput = {}) {
  const p = tSlotNutModelPropsSchema.parse(input)
  return {
    ...p,
    flangeHeight: p.height - p.topHeight,
    shoulderOverhang: (p.width - p.topWidth) / 2,
    bottomZ: 0,
    topZ: p.height,
  }
}
