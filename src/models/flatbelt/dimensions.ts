import {
  type FlatBeltModelPropsInput,
  flatBeltModelPropsSchema,
} from "./schema"

export function getFlatBeltDimensions(input: FlatBeltModelPropsInput = {}) {
  const p = flatBeltModelPropsSchema.parse(input)
  const loopCenterDiameter = p.pitchLength / Math.PI
  return {
    ...p,
    loopCenterDiameter,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
