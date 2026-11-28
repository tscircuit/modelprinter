import { type EyeHookModelPropsInput, eyeHookModelPropsSchema } from "./schema"

export function getEyeHookDimensions(input: EyeHookModelPropsInput = {}) {
  const p = eyeHookModelPropsSchema.parse(input)
  const eyeRingWall = (p.eyeOuterDiameter - p.eyeInnerDiameter) / 2
  return {
    ...p,
    eyeRingWall,
    bottomZ: 0,
    topZ: p.height,
  }
}
