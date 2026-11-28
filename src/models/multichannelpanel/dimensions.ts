import {
  type MultiChannelPanelModelPropsInput,
  multiChannelPanelModelPropsSchema,
} from "./schema"

export function getMultiChannelPanelDimensions(
  input: MultiChannelPanelModelPropsInput = {},
) {
  const p = multiChannelPanelModelPropsSchema.parse(input)
  const cellHeight = p.thickness - 2 * p.skinThickness
  const cellWidth = p.pitch - p.webThickness
  return {
    ...p,
    cellHeight,
    cellWidth,
    bottomZ: 0,
    topZ: p.thickness,
  }
}
