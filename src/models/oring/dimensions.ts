import { type ORingModelPropsInput, oRingModelPropsSchema } from "./schema"

export function getORingDimensions(input: ORingModelPropsInput) {
  const p = oRingModelPropsSchema.parse(input)
  const meanDiameter = p.innerDiameter + p.crossSectionDiameter
  const outerDiameter = p.innerDiameter + 2 * p.crossSectionDiameter
  return {
    ...p,
    meanDiameter,
    outerDiameter,
    majorRadius: meanDiameter / 2,
    minorRadius: p.crossSectionDiameter / 2,
    bottomZ: -p.crossSectionDiameter / 2,
    topZ: p.crossSectionDiameter / 2,
  }
}
