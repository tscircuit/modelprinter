import {
  type InternalCirclipModelPropsInput,
  internalCirclipModelPropsSchema,
} from "./schema"
import { findDin472InternalCirclipSpec } from "./table"

export function getInternalCirclipDimensions(
  input: InternalCirclipModelPropsInput,
) {
  const p = internalCirclipModelPropsSchema.parse(input)
  const spec = findDin472InternalCirclipSpec(p.boreDiameter)
  if (!spec) {
    throw new Error(`Missing DIN 472 spec for bore ${p.boreDiameter} mm`)
  }
  return {
    ...p,
    grooveDiameter: spec.grooveDiameter,
    thickness: spec.thickness,
    freeOuterDiameter: spec.freeOuterDiameter,
    lugWidth: spec.lugWidth,
    lugHoleDiameter: spec.lugHoleDiameter,
    innerClearanceDiameter: spec.innerClearanceDiameter,
    grooveShoulderDepth: (spec.grooveDiameter - p.boreDiameter) / 2,
    lugCount: 2,
    bottomZ: 0,
    topZ: spec.thickness,
  }
}
