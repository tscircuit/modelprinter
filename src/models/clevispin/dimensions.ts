import {
  type ClevisPinModelPropsInput,
  clevisPinModelPropsSchema,
} from "./schema"
import { type ClevisPinSizeKey, clevisPinSpecs } from "./table"

/** Nominal ISO 2341 Form B clevis pin dimensions in mm; under-head datum is Z=0. */
export function getClevisPinDimensions(input: ClevisPinModelPropsInput) {
  const props = clevisPinModelPropsSchema.parse(input)
  const spec = clevisPinSpecs[String(props.diameter) as ClevisPinSizeKey]
  const gripLength =
    props.length - spec.holeEndOffset - spec.splitPinHoleDiameter * 0.5
  const overallLength = props.length + spec.headHeight
  return {
    ...props,
    ...spec,
    gripLength,
    overallLength,
    bearingZ: 0,
    headTopZ: spec.headHeight,
    splitPinHoleZ: -(props.length - spec.holeEndOffset),
    shankTipZ: -props.length,
    size: [spec.headDiameter, spec.headDiameter, overallLength] as [
      number,
      number,
      number,
    ],
  }
}
