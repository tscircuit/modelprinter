import { findAs568ORingSpec } from "./table"
import type { RawORingShape } from "./validate"

export function normalizeORingProps<T extends RawORingShape>(p: T) {
  const spec = findAs568ORingSpec(p.size)
  if (!spec) {
    throw new Error(`Missing AS568 spec for size "${p.size}"`)
  }
  return {
    ...p,
    size: spec.size,
    innerDiameter: p.innerDiameter ?? spec.innerDiameter,
    crossSectionDiameter: p.crossSectionDiameter ?? spec.crossSectionDiameter,
  }
}
