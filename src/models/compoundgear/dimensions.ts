import {
  type CompoundGearModelPropsInput,
  compoundGearModelPropsSchema,
} from "./schema"

export function getCompoundGearDimensions(
  input: CompoundGearModelPropsInput = {},
) {
  const p = compoundGearModelPropsSchema.parse(input)
  const pitchDiameterA = p.teethA * p.module
  const pitchDiameterB = p.teethB * p.module
  return {
    ...p,
    pitchDiameterA,
    pitchDiameterB,
    bottomZ: 0,
    topZ: p.width,
  }
}
