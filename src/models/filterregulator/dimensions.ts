import {
  type FilterRegulatorModelPropsInput,
  filterRegulatorModelPropsSchema,
} from "./schema"

export function getFilterRegulatorDimensions(
  input: FilterRegulatorModelPropsInput = {},
) {
  const p = filterRegulatorModelPropsSchema.parse(input)
  return {
    ...p,
    knobSideClearance: (p.width - p.knobOuterDiameter) / 2,
  }
}
