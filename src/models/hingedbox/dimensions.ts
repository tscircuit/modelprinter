import {
  type HingedBoxModelPropsInput,
  hingedBoxModelPropsSchema,
} from "./schema"

export function getHingedBoxDimensions(input: HingedBoxModelPropsInput = {}) {
  const p = hingedBoxModelPropsSchema.parse(input)
  const baseBodyHeight = p.height - p.lidThickness
  const hingeSpanY = p.depth - 2 * Math.max(p.cornerRadius, p.wallThickness)
  const knuckleLength = hingeSpanY / p.knuckles
  const knuckleOuterDiameter = p.hingePinDiameter * 2
  return {
    ...p,
    baseBodyHeight,
    hingeSpanY,
    knuckleLength,
    knuckleOuterDiameter,
    hingeAxisX: -p.width / 2 - p.hingePinDiameter / 2,
    seamZ: baseBodyHeight,
    bottomZ: 0,
    topZ: p.height,
  }
}
