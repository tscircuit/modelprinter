import {
  type ClinchNutModelPropsInput,
  clinchNutModelPropsSchema,
} from "./schema"

export function getClinchNutDimensions(input: ClinchNutModelPropsInput = {}) {
  const p = clinchNutModelPropsSchema.parse(input)
  return {
    ...p,
    barrelHeight: p.height - p.neckHeight - p.flangeHeight,
    sheetFaceZ: 0,
    rearZ: -(p.height - p.flangeHeight),
  }
}
