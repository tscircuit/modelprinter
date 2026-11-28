import {
  type RotaryPositioningTableModelPropsInput,
  rotaryPositioningTableModelPropsSchema,
} from "./schema"

export function getRotaryPositioningTableDimensions(
  input: RotaryPositioningTableModelPropsInput = {},
) {
  const p = rotaryPositioningTableModelPropsSchema.parse(input)
  return {
    ...p,
    platterRadialWeb: (p.outerDiameter - p.boreDiameter) / 2,
  }
}
