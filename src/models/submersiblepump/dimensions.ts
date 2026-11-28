import {
  type SubmersiblePumpModelPropsInput,
  submersiblePumpModelPropsSchema,
} from "./schema"

export function getSubmersiblePumpDimensions(
  input: SubmersiblePumpModelPropsInput = {},
) {
  const p = submersiblePumpModelPropsSchema.parse(input)
  return {
    ...p,
    baseFlangeRadialOverhang: (p.baseOuterDiameter - p.bodyOuterDiameter) / 2,
  }
}
