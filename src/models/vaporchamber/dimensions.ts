import {
  type VaporChamberModelPropsInput,
  vaporChamberModelPropsSchema,
} from "./schema"

export function getVaporChamberDimensions(
  input: VaporChamberModelPropsInput = {},
) {
  const p = vaporChamberModelPropsSchema.parse(input)
  const overallSpanX = p.holePitchX + p.tabWidth
  return {
    ...p,
    overallSpanX,
    bottomZ: 0,
    topZ: p.height,
  }
}
