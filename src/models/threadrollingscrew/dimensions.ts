import {
  type ThreadRollingScrewModelPropsInput,
  threadRollingScrewModelPropsSchema,
} from "./schema"

export function getThreadRollingScrewDimensions(
  input: ThreadRollingScrewModelPropsInput = {},
) {
  const p = threadRollingScrewModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const inscribedCircleDiameter = majorDiameter - 2 * p.lobingOffset
  const overallLength = p.length + p.headHeight
  return {
    ...p,
    majorDiameter,
    inscribedCircleDiameter,
    overallLength,
    bottomZ: -p.length,
    topZ: p.headHeight,
  }
}
