import { type DinRailModelPropsInput, dinRailModelPropsSchema } from "./schema"

export function getDinRailDimensions(input: DinRailModelPropsInput = {}) {
  const p = dinRailModelPropsSchema.parse(input)
  const innerChannelWidth = p.baseWidth - 2 * p.sheetThickness
  const innerChannelDepth = p.height - p.sheetThickness
  return {
    ...p,
    innerChannelWidth,
    innerChannelDepth,
    bottomZ: 0,
    topZ: p.height,
  }
}
