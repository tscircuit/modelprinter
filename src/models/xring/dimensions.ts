import { type XRingModelPropsInput, xRingModelPropsSchema } from "./schema"

export function getXRingDimensions(input: XRingModelPropsInput = {}) {
  const p = xRingModelPropsSchema.parse(input)
  const outerDiameter = p.innerDiameter + 2 * p.crossSectionDiameter
  return {
    ...p,
    outerDiameter,
    bottomZ: -p.crossSectionDiameter / 2,
    topZ: p.crossSectionDiameter / 2,
  }
}
