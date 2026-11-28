import {
  type SnapClipModelPropsInput,
  snapClipModelPropsSchema,
} from "./schema"

export function getSnapClipDimensions(input: SnapClipModelPropsInput = {}) {
  const p = snapClipModelPropsSchema.parse(input)
  const baseThickness = Math.max(1.5, Math.min(2.5, p.standoffHeight * 0.2))
  const latchHeadHeight = Math.max(2.5, p.barbOuterDiameter * 0.85)
  const overallHeight = p.standoffHeight + p.boardThickness + latchHeadHeight
  const barbRetentionShoulder = (p.barbOuterDiameter - p.stemDiameter) / 2
  return {
    ...p,
    baseThickness,
    latchHeadHeight,
    barbRetentionShoulder,
    overallHeight,
    boardSeatZ: p.standoffHeight,
    boardTopZ: p.standoffHeight + p.boardThickness,
    bottomZ: 0,
    topZ: overallHeight,
  }
}
