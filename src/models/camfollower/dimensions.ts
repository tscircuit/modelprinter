import {
  type CamFollowerModelPropsInput,
  camFollowerModelPropsSchema,
} from "./schema"

/** Resolved stud-type needle-roller cam follower bounds and datums in mm. */
export function getCamFollowerDimensions(
  input: CamFollowerModelPropsInput = {},
) {
  const props = camFollowerModelPropsSchema.parse(input)
  const overallLength = props.width + props.studLength
  const radialSection = (props.outerDiameter - props.studDiameter) * 0.5
  return {
    ...props,
    overallLength,
    radialSection,
    studTipZ: -props.studLength,
    shoulderZ: 0,
    headTopZ: props.width,
    size: [props.outerDiameter, props.outerDiameter, overallLength] as [
      number,
      number,
      number,
    ],
  }
}
