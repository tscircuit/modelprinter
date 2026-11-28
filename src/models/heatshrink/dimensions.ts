import {
  type HeatShrinkModelPropsInput,
  heatShrinkModelPropsSchema,
} from "./schema"

export function getHeatShrinkDimensions(input: HeatShrinkModelPropsInput = {}) {
  const p = heatShrinkModelPropsSchema.parse(input)
  const wallThickness = (p.outerDiameter - p.innerDiameter) / 2
  return {
    ...p,
    wallThickness,
    bottomZ: 0,
    topZ: p.length,
  }
}
