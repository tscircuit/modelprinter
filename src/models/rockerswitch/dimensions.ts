import {
  type RockerSwitchModelPropsInput,
  rockerSwitchModelPropsSchema,
} from "./schema"

export function getRockerSwitchDimensions(
  input: RockerSwitchModelPropsInput = {},
) {
  const p = rockerSwitchModelPropsSchema.parse(input)
  const bezelLength = p.cutoutLength + 2 * p.flangeBorder
  const bezelWidth = p.cutoutWidth + 2 * p.flangeBorder
  return {
    ...p,
    bezelLength,
    bezelWidth,
    bottomZ: -p.bodyDepth,
    topZ: p.flangeBorder,
  }
}
