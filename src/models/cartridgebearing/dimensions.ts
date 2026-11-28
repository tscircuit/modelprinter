import {
  type CartridgeBearingModelPropsInput,
  cartridgeBearingModelPropsSchema,
} from "./schema"

export function getCartridgeBearingDimensions(
  input: CartridgeBearingModelPropsInput = {},
) {
  const p = cartridgeBearingModelPropsSchema.parse(input)
  const pilotCylinderLength = p.length - p.flangeHeight
  return {
    ...p,
    pilotCylinderLength,
    bottomZ: 0,
    topZ: p.length,
  }
}
