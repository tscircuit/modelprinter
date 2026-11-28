import {
  type PneumaticFilterModelPropsInput,
  pneumaticFilterModelPropsSchema,
} from "./schema"

export function getPneumaticFilterDimensions(
  input: PneumaticFilterModelPropsInput = {},
) {
  const p = pneumaticFilterModelPropsSchema.parse(input)
  return {
    ...p,
    headOverBowlMargin: (p.headWidth - p.bowlOuterDiameter) / 2,
  }
}
