import {
  type RoundHeadScrewModelPropsInput,
  roundHeadScrewModelPropsSchema,
} from "./schema"

export function getRoundHeadScrewDimensions(
  input: RoundHeadScrewModelPropsInput = {},
) {
  const p = roundHeadScrewModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const overallLength = p.length + p.headHeight
  return {
    ...p,
    majorDiameter,
    domeRadius: p.headOuterDiameter / 2,
    overallLength,
    bottomZ: -p.length,
    topZ: p.headHeight,
  }
}
