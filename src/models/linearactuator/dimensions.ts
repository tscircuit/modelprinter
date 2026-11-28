import {
  type LinearActuatorModelPropsInput,
  linearActuatorModelPropsSchema,
} from "./schema"

/** Resolved retracted electric-screw linear actuator bounds and eye centers in mm. */
export function getLinearActuatorDimensions(
  input: LinearActuatorModelPropsInput = {},
) {
  const props = linearActuatorModelPropsSchema.parse(input)
  const eyeOuterDiameter = props.eyeBoreDiameter * 2
  const extendedLength = props.retractedLength + props.stroke
  const overallRetractedLength = props.retractedLength + eyeOuterDiameter
  return {
    ...props,
    eyeOuterDiameter,
    extendedLength,
    overallRetractedLength,
    rearEyeCenterZ: 0,
    frontEyeCenterZ: props.retractedLength,
    frontEyeExtendedCenterZ: extendedLength,
    bottomZ: -eyeOuterDiameter * 0.5,
    topZ: props.retractedLength + eyeOuterDiameter * 0.5,
    size: [
      props.bodyOuterDiameter,
      props.bodyOuterDiameter,
      overallRetractedLength,
    ] as [number, number, number],
  }
}
