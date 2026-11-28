import {
  type ExternalCirclipModelPropsInput,
  externalCirclipModelPropsSchema,
} from "./schema"
import { findDin471ExternalCirclipSpec } from "./table"

export function getExternalCirclipDimensions(
  input: ExternalCirclipModelPropsInput,
) {
  const p = externalCirclipModelPropsSchema.parse(input)
  const spec = findDin471ExternalCirclipSpec(p.shaftDiameter)
  if (!spec) {
    throw new Error(`Missing DIN 471 spec for shaft ${p.shaftDiameter} mm`)
  }
  return {
    ...p,
    grooveDiameter: spec.grooveDiameter,
    thickness: spec.thickness,
    freeInnerDiameter: spec.freeInnerDiameter,
    lugWidth: spec.lugWidth,
    lugHoleDiameter: spec.lugHoleDiameter,
    outerEnvelopeDiameter: spec.outerEnvelopeDiameter,
    grooveShoulderDepth: (p.shaftDiameter - spec.grooveDiameter) / 2,
    lugCount: 2,
    bottomZ: 0,
    topZ: spec.thickness,
  }
}
