import {
  type SanitaryClampFerruleModelPropsInput,
  sanitaryClampFerruleModelPropsSchema,
} from "./schema"

export function getSanitaryClampFerruleDimensions(
  input: SanitaryClampFerruleModelPropsInput = {},
) {
  const p = sanitaryClampFerruleModelPropsSchema.parse(input)
  return {
    ...p,
    tubeWallThickness: (p.tubeOuterDiameter - p.tubeInnerDiameter) / 2,
    gasketFaceZ: 0,
    weldEndZ: p.length,
  }
}
