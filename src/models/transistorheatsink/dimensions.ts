import {
  type TransistorHeatsinkModelPropsInput,
  transistorHeatsinkModelPropsSchema,
} from "./schema"

export function getTransistorHeatsinkDimensions(
  input: TransistorHeatsinkModelPropsInput = {},
) {
  const p = transistorHeatsinkModelPropsSchema.parse(input)
  const innerChannelWidth = p.width - 2 * p.thickness
  const wingDepth = p.depth - p.thickness
  return {
    ...p,
    innerChannelWidth,
    wingDepth,
    bottomZ: 0,
    topZ: p.height,
  }
}
