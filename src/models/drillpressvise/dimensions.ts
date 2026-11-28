import {
  type DrillPressViseModelPropsInput,
  drillPressViseModelPropsSchema,
} from "./schema"

export function getDrillPressViseDimensions(
  input: DrillPressViseModelPropsInput = {},
) {
  const p = drillPressViseModelPropsSchema.parse(input)
  return {
    ...p,
    baseRailHeight: p.height - p.jawHeight,
  }
}
