import {
  type DovetailMountingRailModelPropsInput,
  dovetailMountingRailModelPropsSchema,
} from "./schema"

export function getDovetailMountingRailDimensions(
  input: DovetailMountingRailModelPropsInput = {},
) {
  const p = dovetailMountingRailModelPropsSchema.parse(input)
  return {
    ...p,
    totalHeight: p.baseThickness + p.dovetailHeight,
  }
}
