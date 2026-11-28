import {
  type CaptiveScrewModelPropsInput,
  captiveScrewModelPropsSchema,
} from "./schema"

export function getCaptiveScrewDimensions(
  input: CaptiveScrewModelPropsInput = {},
) {
  const p = captiveScrewModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const overallLength = p.length + p.headHeight
  return {
    ...p,
    majorDiameter,
    overallLength,
    bottomZ: -p.length,
    topZ: p.headHeight,
  }
}
