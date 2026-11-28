import {
  type VSlotWheelModelPropsInput,
  vSlotWheelModelPropsSchema,
} from "./schema"

export function getVSlotWheelDimensions(input: VSlotWheelModelPropsInput = {}) {
  const p = vSlotWheelModelPropsSchema.parse(input)
  const bevelHalfAngleDeg = p.includedAngleDeg / 2
  return {
    ...p,
    bevelHalfAngleDeg,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
