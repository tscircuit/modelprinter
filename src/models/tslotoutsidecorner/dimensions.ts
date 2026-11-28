import {
  type TSlotOutsideCornerModelPropsInput,
  tSlotOutsideCornerModelPropsSchema,
} from "./schema"

/** Resolved outside-corner radii and leg bounds in millimeters. */
export function getTSlotOutsideCornerDimensions(
  input: TSlotOutsideCornerModelPropsInput = {},
) {
  const props = tSlotOutsideCornerModelPropsSchema.parse(input)
  const innerBendRadius = Math.max(0, props.bendRadius - props.thickness)
  const innerLegLength = props.legLength - props.thickness
  const sideMargin = (props.width - props.holePitch - props.holeDiameter) * 0.5
  return {
    ...props,
    outerBendRadius: props.bendRadius,
    innerBendRadius,
    innerLegLength,
    sideMargin,
    size: [props.legLength, props.width, props.legLength] as [
      number,
      number,
      number,
    ],
  }
}
