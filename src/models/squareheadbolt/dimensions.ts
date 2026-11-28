import {
  type SquareHeadBoltModelPropsInput,
  squareHeadBoltModelPropsSchema,
} from "./schema"

export function getSquareHeadBoltDimensions(
  input: SquareHeadBoltModelPropsInput = {},
) {
  const p = squareHeadBoltModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const unthreadedGripLength = p.length - p.threadLength
  const headAcrossCorners = p.headWidth * Math.SQRT2
  const overallLength = p.length + p.headHeight
  return {
    ...p,
    majorDiameter,
    unthreadedGripLength,
    headAcrossCorners,
    overallLength,
    bottomZ: -p.length,
    topZ: p.headHeight,
  }
}
