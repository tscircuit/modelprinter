import {
  type RoundBeltModelPropsInput,
  roundBeltModelPropsSchema,
} from "./schema"

export function getRoundBeltDimensions(input: RoundBeltModelPropsInput = {}) {
  const p = roundBeltModelPropsSchema.parse(input)
  const loopCenterDiameter = p.pitchLength / Math.PI
  return {
    ...p,
    loopCenterDiameter,
    bottomZ: -p.crossSectionDiameter / 2,
    topZ: p.crossSectionDiameter / 2,
  }
}
