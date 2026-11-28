import {
  type ShaftEndSupportModelPropsInput,
  shaftEndSupportModelPropsSchema,
} from "./schema"

export function getShaftEndSupportDimensions(
  input: ShaftEndSupportModelPropsInput = {},
) {
  const p = shaftEndSupportModelPropsSchema.parse(input)
  const clampMajorDiameter = Number(p.clampThread.slice(1))
  return {
    ...p,
    clampMajorDiameter,
    bottomZ: 0,
    topZ: p.height,
  }
}
