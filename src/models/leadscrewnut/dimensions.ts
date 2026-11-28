import {
  type LeadScrewNutModelPropsInput,
  leadScrewNutModelPropsSchema,
} from "./schema"

export function getLeadScrewNutDimensions(
  input: LeadScrewNutModelPropsInput = {},
) {
  const p = leadScrewNutModelPropsSchema.parse(input)
  const flangeThickness = Math.min(4, p.length * 0.3)
  return {
    ...p,
    flangeThickness,
    mountingHoleCount: 4,
    bottomZ: 0,
    topZ: p.length,
  }
}
