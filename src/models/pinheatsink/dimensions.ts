import {
  type PinHeatsinkModelPropsInput,
  pinHeatsinkModelPropsSchema,
} from "./schema"

export function getPinHeatsinkDimensions(
  input: PinHeatsinkModelPropsInput = {},
) {
  const p = pinHeatsinkModelPropsSchema.parse(input)
  const pinHeight = p.height - p.baseThickness
  const pinCount = p.gridX * p.gridY
  return {
    ...p,
    pinHeight,
    pinCount,
    bottomZ: 0,
    topZ: p.height,
  }
}
