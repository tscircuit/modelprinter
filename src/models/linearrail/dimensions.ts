import {
  type LinearRailModelPropsInput,
  linearRailModelPropsSchema,
} from "./schema"

export function getLinearRailDimensions(input: LinearRailModelPropsInput = {}) {
  const p = linearRailModelPropsSchema.parse(input)
  const lastHoleOffset = p.firstHole + (p.holes - 1) * p.pitch
  const trailingEndMargin = p.length - lastHoleOffset
  return {
    ...p,
    lastHoleOffset,
    trailingEndMargin,
    bottomZ: 0,
    topZ: p.height,
  }
}
