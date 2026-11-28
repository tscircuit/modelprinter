import {
  type LevelingFootModelPropsInput,
  levelingFootModelPropsSchema,
} from "./schema"
import { levelingFootThreads } from "./table"

/** Resolved rigid leveling foot envelope and stem elevations in mm. */
export function getLevelingFootDimensions(
  input: LevelingFootModelPropsInput = {},
) {
  const props = levelingFootModelPropsSchema.parse(input)
  const spec = levelingFootThreads[props.metricSize]
  const overallHeight = props.padHeight + props.stemLength
  const shoulderAnnulusWidth = (props.padDiameter - spec.diameter) * 0.5
  return {
    ...props,
    stemDiameter: spec.diameter,
    overallHeight,
    shoulderAnnulusWidth,
    floorZ: 0,
    padTopZ: props.padHeight,
    topZ: overallHeight,
    size: [props.padDiameter, props.padDiameter, overallHeight] as [
      number,
      number,
      number,
    ],
  }
}
