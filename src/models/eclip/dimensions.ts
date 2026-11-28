import { type EClipModelPropsInput, eClipModelPropsSchema } from "./schema"
import { findDin6799EClipSpec } from "./table"

export function getEClipDimensions(input: EClipModelPropsInput) {
  const p = eClipModelPropsSchema.parse(input)
  const spec = findDin6799EClipSpec(p.grooveDiameter)
  if (!spec) {
    throw new Error(`Missing DIN 6799 spec for groove ${p.grooveDiameter} mm`)
  }
  return {
    ...p,
    thickness: spec.thickness,
    freeInnerDiameter: spec.freeInnerDiameter,
    outerDiameter: spec.outerDiameter,
    radialEnvelopeWidth: (spec.outerDiameter - spec.freeInnerDiameter) / 2,
    grooveShoulderDepth: (p.shaftDiameter - p.grooveDiameter) / 2,
    prongCount: 3,
    bottomZ: 0,
    topZ: spec.thickness,
  }
}
