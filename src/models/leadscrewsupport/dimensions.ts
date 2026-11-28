import {
  type LeadscrewSupportModelPropsInput,
  leadscrewSupportModelPropsSchema,
} from "./schema"

export function getLeadscrewSupportDimensions(
  input: LeadscrewSupportModelPropsInput = {},
) {
  const p = leadscrewSupportModelPropsSchema.parse(input)
  return {
    ...p,
    sideWallMargin: (p.width - p.holePitch - p.holeDiameter) / 2,
  }
}
