import {
  type BobbinMountModelPropsInput,
  bobbinMountModelPropsSchema,
} from "./schema"
import { bobbinMountCoarsePitches } from "./validate"

/** Resolved cylindrical stud-stud vibration isolator envelope in mm. */
export function getBobbinMountDimensions(
  input: BobbinMountModelPropsInput = {},
) {
  const props = bobbinMountModelPropsSchema.parse(input)
  const threadPitch = bobbinMountCoarsePitches[props.metricSize]
  const endPlateThickness = Math.min(2, props.height * 0.1)
  const elastomerHeight = props.height - 2 * endPlateThickness
  const overallLength = props.height + 2 * props.studLength
  return {
    ...props,
    threadPitch,
    endPlateThickness,
    elastomerHeight,
    overallLength,
    lowerStudTipZ: -props.studLength,
    lowerPlateBottomZ: 0,
    upperPlateTopZ: props.height,
    upperStudTipZ: props.height + props.studLength,
    size: [props.outerDiameter, props.outerDiameter, overallLength] as [
      number,
      number,
      number,
    ],
  }
}
