import {
  type ThreadCuttingScrewModelPropsInput,
  threadCuttingScrewModelPropsSchema,
} from "./schema"

export function getThreadCuttingScrewDimensions(
  input: ThreadCuttingScrewModelPropsInput = {},
) {
  const p = threadCuttingScrewModelPropsSchema.parse(input)
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
