import {
  type WireDuctModelPropsInput,
  wireDuctModelPropsSchema,
} from "./schema"

export function getWireDuctDimensions(input: WireDuctModelPropsInput = {}) {
  const p = wireDuctModelPropsSchema.parse(input)
  return {
    ...p,
    outerWidth: p.innerWidth + 2 * p.wallThickness,
  }
}
