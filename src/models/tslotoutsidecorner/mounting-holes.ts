import {
  type TSlotOutsideCornerModelPropsInput,
  tSlotOutsideCornerModelPropsSchema,
} from "./schema"

/** Centers lie on the inner mounting faces (Z=thickness and X=thickness) and cut outward. */
export function getTSlotOutsideCornerMountingHoles(
  input: TSlotOutsideCornerModelPropsInput = {},
) {
  const props = tSlotOutsideCornerModelPropsSchema.parse(input)
  const halfPitch = props.holePitch * 0.5
  return [
    {
      center: { x: props.holeOffset, y: -halfPitch, z: props.thickness },
      direction: { x: 0, y: 0, z: -1 },
      diameter: props.holeDiameter,
      depth: props.thickness,
    },
    {
      center: { x: props.holeOffset, y: halfPitch, z: props.thickness },
      direction: { x: 0, y: 0, z: -1 },
      diameter: props.holeDiameter,
      depth: props.thickness,
    },
    {
      center: { x: props.thickness, y: -halfPitch, z: props.holeOffset },
      direction: { x: -1, y: 0, z: 0 },
      diameter: props.holeDiameter,
      depth: props.thickness,
    },
    {
      center: { x: props.thickness, y: halfPitch, z: props.holeOffset },
      direction: { x: -1, y: 0, z: 0 },
      diameter: props.holeDiameter,
      depth: props.thickness,
    },
  ] as const
}
