import {
  type LedHeatsinkModelPropsInput,
  ledHeatsinkModelPropsSchema,
} from "./schema"

export function getLedHeatsinkDimensions(
  input: LedHeatsinkModelPropsInput = {},
) {
  const p = ledHeatsinkModelPropsSchema.parse(input)
  const finRadialLength = (p.outerDiameter - p.seatOuterDiameter) / 2
  const finHeight = p.height - p.baseThickness
  return {
    ...p,
    finRadialLength,
    finHeight,
    bottomZ: 0,
    topZ: p.height,
  }
}
