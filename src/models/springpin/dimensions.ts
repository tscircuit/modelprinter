import {
  type SpringPinModelPropsInput,
  springPinModelPropsSchema,
} from "./schema"
import { type SpringPinSizeKey, springPinSpecs } from "./table"

/** Nominal ISO 8752 uncompressed spring pin dimensions in mm; lower end Z=0, upper end Z=length. */
export function getSpringPinDimensions(input: SpringPinModelPropsInput) {
  const props = springPinModelPropsSchema.parse(input)
  const spec = springPinSpecs[String(props.holeDiameter) as SpringPinSizeKey]
  const freeInnerDiameter = spec.freeOuterDiameter - 2 * spec.wallThickness
  return {
    ...props,
    ...spec,
    freeInnerDiameter,
    chamferAngle: 15,
    bearingZ: 0,
    topZ: props.length,
    size: [spec.freeOuterDiameter, spec.freeOuterDiameter, props.length] as [
      number,
      number,
      number,
    ],
  }
}
