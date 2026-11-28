import {
  type SuctionStrainerModelPropsInput,
  suctionStrainerModelPropsSchema,
} from "./schema"

export function getSuctionStrainerDimensions(
  input: SuctionStrainerModelPropsInput = {},
) {
  const p = suctionStrainerModelPropsSchema.parse(input)
  return {
    ...p,
    screenLigament: p.perforationPitch - p.perforationDiameter,
  }
}
