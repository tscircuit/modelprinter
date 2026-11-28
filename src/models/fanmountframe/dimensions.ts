import {
  type FanMountFrameModelPropsInput,
  fanMountFrameModelPropsSchema,
} from "./schema"

export function getFanMountFrameDimensions(
  input: FanMountFrameModelPropsInput = {},
) {
  const p = fanMountFrameModelPropsSchema.parse(input)
  const overallWidthWithEars = p.width + 2 * p.earLength
  return {
    ...p,
    overallWidthWithEars,
    bottomZ: 0,
    topZ: p.depth,
  }
}
