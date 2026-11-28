import {
  type SupportedShaftModelPropsInput,
  supportedShaftModelPropsSchema,
} from "./schema"

export function getSupportedShaftDimensions(
  input: SupportedShaftModelPropsInput = {},
) {
  const p = supportedShaftModelPropsSchema.parse(input)
  return {
    ...p,
    overallCrownHeight: p.shaftCenterHeight + p.shaftDiameter / 2,
  }
}
