import {
  type BarrelNutModelPropsInput,
  barrelNutModelPropsSchema,
} from "./schema"

export function getBarrelNutDimensions(input: BarrelNutModelPropsInput = {}) {
  const p = barrelNutModelPropsSchema.parse(input)
  return {
    ...p,
    slottedEndClearance: p.holeOffset - p.threadDiameter / 2 - p.slotDepth,
    bottomZ: 0,
    topZ: p.length,
  }
}
