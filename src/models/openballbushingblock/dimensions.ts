import {
  type OpenBallBushingBlockModelPropsInput,
  openBallBushingBlockModelPropsSchema,
} from "./schema"

export function getOpenBallBushingBlockDimensions(
  input: OpenBallBushingBlockModelPropsInput = {},
) {
  const p = openBallBushingBlockModelPropsSchema.parse(input)
  const threadDiameter = Number(p.thread.slice(1))
  return {
    ...p,
    threadDiameter,
    mountingHoleCount: 4,
    bottomZ: 0,
    topZ: p.height,
  }
}
