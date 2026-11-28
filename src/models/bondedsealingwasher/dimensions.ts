import {
  type BondedSealingWasherModelPropsInput,
  bondedSealingWasherModelPropsSchema,
} from "./schema"

export function getBondedSealingWasherDimensions(
  input: BondedSealingWasherModelPropsInput = {},
) {
  const p = bondedSealingWasherModelPropsSchema.parse(input)
  return {
    ...p,
    lipProtrusionPerFace: (p.sealHeight - p.metalHeight) / 2,
    bottomZ: -p.sealHeight / 2,
    topZ: p.sealHeight / 2,
  }
}
