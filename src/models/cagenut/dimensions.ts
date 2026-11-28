import { type CageNutModelPropsInput, cageNutModelPropsSchema } from "./schema"

export function getCageNutDimensions(input: CageNutModelPropsInput = {}) {
  const p = cageNutModelPropsSchema.parse(input)
  return {
    ...p,
    earOverhang: (p.earSpan - p.cageWidth) / 2,
    rearZ: -p.cageHeight,
    panelZ: 0,
  }
}
