import {
  type SpokedWheelModelPropsInput,
  spokedWheelModelPropsSchema,
} from "./schema"

export function getSpokedWheelDimensions(
  input: SpokedWheelModelPropsInput = {},
) {
  const p = spokedWheelModelPropsSchema.parse(input)
  const overallWidth = Math.max(p.rimWidth, p.hubWidth)
  return {
    ...p,
    overallWidth,
    bottomZ: -overallWidth / 2,
    topZ: overallWidth / 2,
  }
}
