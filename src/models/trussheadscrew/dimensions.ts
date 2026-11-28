import {
  type TrussHeadScrewModelPropsInput,
  trussHeadScrewModelPropsSchema,
} from "./schema"

export function getTrussHeadScrewDimensions(
  input: TrussHeadScrewModelPropsInput = {},
) {
  const p = trussHeadScrewModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const headRadius = p.headOuterDiameter / 2
  const domeSphereRadius =
    (headRadius * headRadius + p.headHeight * p.headHeight) / (2 * p.headHeight)
  const overallLength = p.length + p.headHeight
  return {
    ...p,
    majorDiameter,
    domeSphereRadius,
    overallLength,
    bottomZ: -p.length,
    topZ: p.headHeight,
  }
}
