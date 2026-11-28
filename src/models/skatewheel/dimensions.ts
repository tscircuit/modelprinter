import {
  type SkateWheelModelPropsInput,
  skateWheelModelPropsSchema,
} from "./schema"

export function getSkateWheelDimensions(input: SkateWheelModelPropsInput = {}) {
  const p = skateWheelModelPropsSchema.parse(input)
  const treadRadialThickness = (p.outerDiameter - p.bearingSeatDiameter) / 2
  return {
    ...p,
    treadRadialThickness,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
