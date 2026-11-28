import {
  type BallStudModelPropsInput,
  ballStudModelPropsSchema,
} from "./schema"

export function getBallStudDimensions(input: BallStudModelPropsInput = {}) {
  const p = ballStudModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const ballCenterZ = p.shoulderHeight + p.neckLength + p.ballDiameter / 2
  const topZ = p.shoulderHeight + p.neckLength + p.ballDiameter
  const overallLength = p.threadLength + topZ
  return {
    ...p,
    majorDiameter,
    ballCenterZ,
    overallLength,
    bottomZ: -p.threadLength,
    topZ,
  }
}
