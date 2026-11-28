import {
  type IdlerPulleyModelPropsInput,
  idlerPulleyModelPropsSchema,
} from "./schema"

/** Resolved smooth flanged idler pulley bounds and track geometry in mm. */
export function getIdlerPulleyDimensions(
  input: IdlerPulleyModelPropsInput = {},
) {
  const props = idlerPulleyModelPropsSchema.parse(input)
  const flangeThickness = props.width * 0.125
  const beltTrackWidth = props.width - 2 * flangeThickness
  const flangeRadialHeight = (props.flangeDiameter - props.outerDiameter) * 0.5
  const rimWallThickness =
    (props.outerDiameter - props.bearingBoreDiameter) * 0.5
  return {
    ...props,
    flangeThickness,
    beltTrackWidth,
    flangeRadialHeight,
    rimWallThickness,
    bottomZ: 0,
    topZ: props.width,
    size: [props.flangeDiameter, props.flangeDiameter, props.width] as [
      number,
      number,
      number,
    ],
  }
}
