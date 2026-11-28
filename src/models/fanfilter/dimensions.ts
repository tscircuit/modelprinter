import {
  type FanFilterModelPropsInput,
  fanFilterModelPropsSchema,
} from "./schema"

export function getFanFilterDimensions(input: FanFilterModelPropsInput = {}) {
  const p = fanFilterModelPropsSchema.parse(input)
  const innerOpeningWidth = p.width - 2 * p.frameThickness
  const innerOpeningHeight = p.height - 2 * p.frameThickness
  return {
    ...p,
    innerOpeningWidth,
    innerOpeningHeight,
    bottomZ: 0,
    topZ: p.depth,
  }
}
