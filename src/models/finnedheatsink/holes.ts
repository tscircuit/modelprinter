import {
  type FinnedHeatsinkModelPropsInput,
  finnedHeatsinkModelPropsSchema,
} from "./schema"

export interface FinnedHeatsinkMountingHole {
  center: { x: number; y: number; z: number }
  direction: { x: 0; y: 0; z: 1 }
  diameter: number
  depth: number
}

export function getFinnedHeatsinkMountingHoles(
  input: FinnedHeatsinkModelPropsInput = {},
): FinnedHeatsinkMountingHole[] {
  const props = finnedHeatsinkModelPropsSchema.parse(input)
  const halfHolePitch = props.holePitch / 2
  const firstCenter = props.longitudinal
    ? { x: 0, y: -halfHolePitch, z: 0 }
    : { x: -halfHolePitch, y: 0, z: 0 }
  const secondCenter = props.longitudinal
    ? { x: 0, y: halfHolePitch, z: 0 }
    : { x: halfHolePitch, y: 0, z: 0 }
  return [
    {
      center: firstCenter,
      direction: { x: 0, y: 0, z: 1 },
      diameter: props.holeDiameter,
      depth: props.baseThickness,
    },
    {
      center: secondCenter,
      direction: { x: 0, y: 0, z: 1 },
      diameter: props.holeDiameter,
      depth: props.baseThickness,
    },
  ]
}
