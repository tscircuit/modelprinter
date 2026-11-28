import {
  type ToggleClampModelPropsInput,
  toggleClampModelPropsSchema,
} from "./schema"

export function getToggleClampDimensions(
  input: ToggleClampModelPropsInput = {},
) {
  const p = toggleClampModelPropsSchema.parse(input)
  return {
    ...p,
    closedOverallHeight: p.pivotHeight + p.handleLength,
  }
}
