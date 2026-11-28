import {
  type CartridgeFuseModelPropsInput,
  cartridgeFuseModelPropsSchema,
} from "./schema"

export function getCartridgeFuseDimensions(
  input: CartridgeFuseModelPropsInput = {},
) {
  const p = cartridgeFuseModelPropsSchema.parse(input)
  const exposedBodyLength = p.length - 2 * p.capLength
  return {
    ...p,
    exposedBodyLength,
    bottomZ: -p.length / 2,
    topZ: p.length / 2,
  }
}
