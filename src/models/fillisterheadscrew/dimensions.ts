import {
  type FillisterHeadScrewModelPropsInput,
  fillisterHeadScrewModelPropsSchema,
} from "./schema"

export function getFillisterHeadScrewDimensions(
  input: FillisterHeadScrewModelPropsInput = {},
) {
  const p = fillisterHeadScrewModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const totalHeadHeight = p.headHeight + p.domeHeight
  const overallLength = p.length + totalHeadHeight
  return {
    ...p,
    majorDiameter,
    totalHeadHeight,
    overallLength,
    bottomZ: -p.length,
    topZ: totalHeadHeight,
  }
}
