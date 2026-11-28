import {
  type ElevatorBoltModelPropsInput,
  elevatorBoltModelPropsSchema,
} from "./schema"

export function getElevatorBoltDimensions(
  input: ElevatorBoltModelPropsInput = {},
) {
  const p = elevatorBoltModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const neckAcrossCorners = p.neckWidth * Math.SQRT2
  const overallLength = p.length + p.headHeight
  return {
    ...p,
    majorDiameter,
    neckAcrossCorners,
    overallLength,
    bottomZ: -p.length,
    topZ: p.headHeight,
  }
}
