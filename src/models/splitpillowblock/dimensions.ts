import {
  type SplitPillowBlockModelPropsInput,
  splitPillowBlockModelPropsSchema,
} from "./schema"

export function getSplitPillowBlockDimensions(
  input: SplitPillowBlockModelPropsInput = {},
) {
  const p = splitPillowBlockModelPropsSchema.parse(input)
  return {
    ...p,
    splitPlaneZ: p.height * 0.52,
    baseZ: 0,
    topZ: p.height,
  }
}
