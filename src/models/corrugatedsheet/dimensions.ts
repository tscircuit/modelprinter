import {
  type CorrugatedSheetModelPropsInput,
  corrugatedSheetModelPropsSchema,
} from "./schema"

export function getCorrugatedSheetDimensions(
  input: CorrugatedSheetModelPropsInput = {},
) {
  const p = corrugatedSheetModelPropsSchema.parse(input)
  return {
    ...p,
    envelopeHeight: p.peakToPeak + p.thickness,
    waveCycles: p.width / p.pitch,
  }
}
