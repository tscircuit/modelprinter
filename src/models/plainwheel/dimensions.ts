import {
  type PlainWheelModelPropsInput,
  plainWheelModelPropsSchema,
} from "./schema"

/** Resolved solid disc wheel, raised axial hub, and rounded tread bounds in mm. */
export function getPlainWheelDimensions(input: PlainWheelModelPropsInput = {}) {
  const props = plainWheelModelPropsSchema.parse(input)
  const hubProjectionPerSide = (props.hubWidth - props.width) * 0.5
  const hubWallThickness = (props.hubDiameter - props.boreDiameter) * 0.5
  const webRadialSpan = (props.outerDiameter - props.hubDiameter) * 0.5
  const treadEdgeRadius = Math.min(props.width * 0.1, webRadialSpan * 0.25)
  return {
    ...props,
    hubProjectionPerSide,
    hubWallThickness,
    webRadialSpan,
    treadEdgeRadius,
    rimBottomZ: hubProjectionPerSide,
    rimTopZ: hubProjectionPerSide + props.width,
    bottomZ: 0,
    topZ: props.hubWidth,
    size: [props.outerDiameter, props.outerDiameter, props.hubWidth] as [
      number,
      number,
      number,
    ],
  }
}
