import {
  type CotterPinModelPropsInput,
  cotterPinModelPropsSchema,
} from "./schema"
import { type CotterPinSizeKey, cotterPinSpecs } from "./table"

/** Nominal ISO 1234 straight cotter-pin envelope in mm; under-eye datum is Z=0. */
export function getCotterPinDimensions(input: CotterPinModelPropsInput) {
  const props = cotterPinModelPropsSchema.parse(input)
  const spec = cotterPinSpecs[String(props.nominalSize) as CotterPinSizeKey]
  const longLegLength = props.length + spec.legDiff
  const overallLength = spec.eyeHeight + longLegLength
  return {
    ...props,
    ...spec,
    shortLegLength: props.length,
    longLegLength,
    overallLength,
    bearingZ: 0,
    eyeTopZ: spec.eyeHeight,
    shortLegTipZ: -props.length,
    longLegTipZ: -longLegLength,
    size: [spec.eyeOuterDiameter, spec.shankDiameter, overallLength] as [
      number,
      number,
      number,
    ],
  }
}
