import {
  type PneumaticLubricatorModelPropsInput,
  pneumaticLubricatorModelPropsSchema,
} from "./schema"

export function getPneumaticLubricatorDimensions(
  input: PneumaticLubricatorModelPropsInput = {},
) {
  const p = pneumaticLubricatorModelPropsSchema.parse(input)
  return {
    ...p,
    totalStackHeight: p.height + p.domeHeight,
  }
}
