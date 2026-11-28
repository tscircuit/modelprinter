import {
  type FanShroudModelPropsInput,
  fanShroudModelPropsSchema,
} from "./schema"

export function getFanShroudDimensions(input: FanShroudModelPropsInput = {}) {
  const p = fanShroudModelPropsSchema.parse(input)
  const exitInnerDiameter = p.exitOuterDiameter - 2 * p.wallThickness
  return {
    ...p,
    exitInnerDiameter,
    bottomZ: 0,
    topZ: p.depth,
  }
}
