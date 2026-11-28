import {
  type ExternalGearPumpModelPropsInput,
  externalGearPumpModelPropsSchema,
} from "./schema"

export function getExternalGearPumpDimensions(
  input: ExternalGearPumpModelPropsInput = {},
) {
  const p = externalGearPumpModelPropsSchema.parse(input)
  return {
    ...p,
    bodyLengthBehindFlange: p.length - p.flangeThickness,
  }
}
