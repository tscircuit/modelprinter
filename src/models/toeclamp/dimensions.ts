import {
  type ToeClampModelPropsInput,
  toeClampModelPropsSchema,
} from "./schema"

export function getToeClampDimensions(input: ToeClampModelPropsInput = {}) {
  const p = toeClampModelPropsSchema.parse(input)
  return {
    ...p,
    stepDrop: p.height - p.toeHeight,
    baseZ: 0,
    topZ: p.height,
  }
}
