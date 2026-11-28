import {
  type DoubleEndedStudModelPropsInput,
  doubleEndedStudModelPropsSchema,
} from "./schema"

export function getDoubleEndedStudDimensions(
  input: DoubleEndedStudModelPropsInput = {},
) {
  const p = doubleEndedStudModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const smoothMiddleLength = p.length - 2 * p.threadLength
  return {
    ...p,
    majorDiameter,
    smoothMiddleLength,
    bottomZ: 0,
    topZ: p.length,
  }
}
