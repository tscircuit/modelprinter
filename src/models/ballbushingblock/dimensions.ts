import {
  type BallBushingBlockModelPropsInput,
  ballBushingBlockModelPropsSchema,
} from "./schema"

export function getBallBushingBlockDimensions(
  input: BallBushingBlockModelPropsInput = {},
) {
  const p = ballBushingBlockModelPropsSchema.parse(input)
  const threadDiameter = Number(p.thread.slice(1))
  const centerHeight = p.height / 2
  return {
    ...p,
    threadDiameter,
    centerHeight,
    mountingHoleCount: 4,
    bottomZ: 0,
    topZ: p.height,
  }
}
