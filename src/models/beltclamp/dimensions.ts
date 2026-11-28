import {
  type BeltClampModelPropsInput,
  beltClampModelPropsSchema,
} from "./schema"

export function getBeltClampDimensions(input: BeltClampModelPropsInput = {}) {
  const p = beltClampModelPropsSchema.parse(input)
  const toothCount = Math.floor(p.length / p.pitch)
  return {
    ...p,
    toothCount,
    toothDepth: 2.06,
    bottomZ: 0,
    topZ: p.height,
  }
}
