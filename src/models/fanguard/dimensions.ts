import {
  type FanGuardModelPropsInput,
  fanGuardModelPropsSchema,
} from "./schema"

export function getFanGuardDimensions(input: FanGuardModelPropsInput = {}) {
  const p = fanGuardModelPropsSchema.parse(input)
  const overallThickness = 2 * p.wireDiameter
  const tabOuterSpanX = p.holePitchX + p.holeDiameter + 2 * p.wireDiameter
  return {
    ...p,
    overallThickness,
    tabOuterSpanX,
    bottomZ: 0,
    topZ: overallThickness,
  }
}
