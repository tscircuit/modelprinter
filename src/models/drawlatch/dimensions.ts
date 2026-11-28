import {
  type DrawLatchModelPropsInput,
  drawLatchModelPropsSchema,
} from "./schema"

export function getDrawLatchDimensions(input: DrawLatchModelPropsInput = {}) {
  const p = drawLatchModelPropsSchema.parse(input)
  const leverBodyLength = p.length * 0.65
  const keeperLength = p.length * 0.28
  const seamGap = p.length - leverBodyLength - keeperLength
  return {
    ...p,
    leverBodyLength,
    keeperLength,
    seamGap,
    leftHoleX: -p.holePitchX / 2,
    rightHoleX: p.holePitchX / 2,
    bottomZ: 0,
    topZ: p.height,
  }
}
