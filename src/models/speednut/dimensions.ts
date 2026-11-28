import {
  type SpeedNutModelPropsInput,
  speedNutModelPropsSchema,
} from "./schema"

export function getSpeedNutDimensions(input: SpeedNutModelPropsInput = {}) {
  const p = speedNutModelPropsSchema.parse(input)
  return {
    ...p,
    overallHeight: p.stripThickness + p.tabHeight,
    bottomZ: 0,
    topZ: p.stripThickness + p.tabHeight,
  }
}
