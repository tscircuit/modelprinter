import { type EyeNutModelPropsInput, eyeNutModelPropsSchema } from "./schema"

export function getEyeNutDimensions(input: EyeNutModelPropsInput = {}) {
  const p = eyeNutModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const eyeOuterDiameter = p.eyeInnerDiameter + 2 * p.eyeWireDiameter
  const overallHeight = p.baseHeight + p.eyeInnerDiameter + p.eyeWireDiameter
  return {
    ...p,
    majorDiameter,
    eyeOuterDiameter,
    overallHeight,
    bottomZ: 0,
    topZ: overallHeight,
  }
}
