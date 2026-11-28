import {
  type HydraulicSpinOnFilterModelPropsInput,
  hydraulicSpinOnFilterModelPropsSchema,
} from "./schema"

export function getHydraulicSpinOnFilterDimensions(
  input: HydraulicSpinOnFilterModelPropsInput = {},
) {
  const p = hydraulicSpinOnFilterModelPropsSchema.parse(input)
  return {
    ...p,
    canisterAnnularMargin: (p.canOuterDiameter - p.canThreadDiameter) / 2,
  }
}
