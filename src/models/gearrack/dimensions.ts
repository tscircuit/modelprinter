import {
  type GearRackModelPropsInput,
  gearRackModelPropsSchema,
} from "./schema"

/** Resolved straight 20-degree involute gear rack dimensions in mm. */
export function getGearRackDimensions(input: GearRackModelPropsInput = {}) {
  const props = gearRackModelPropsSchema.parse(input)
  const linearPitch = Math.PI * props.module
  const addendum = props.module
  const dedendum = 1.25 * props.module
  const toothDepth = addendum + dedendum
  const pitchLineZ = props.height - addendum
  const rootZ = props.height - toothDepth
  const fullToothCount = Math.floor(props.length / linearPitch)
  return {
    ...props,
    linearPitch,
    addendum,
    dedendum,
    toothDepth,
    rootWebHeight: rootZ,
    fullToothCount,
    holeCenters: [
      [-props.holePitch * 0.5, 0],
      [props.holePitch * 0.5, 0],
    ] as [[number, number], [number, number]],
    baseZ: 0,
    rootZ,
    pitchLineZ,
    tipZ: props.height,
    size: [props.length, props.width, props.height] as [number, number, number],
  }
}
