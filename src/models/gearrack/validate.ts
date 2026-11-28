import type { z } from "zod"

export interface GearRackShapeOutput {
  module: number
  length: number
  width: number
  height: number
  pressureAngle: 20
  base2Hole: true
  holeDiameter: number
  holePitch: number
}

export function validateGearRackProps(
  props: GearRackShapeOutput,
  context: z.RefinementCtx,
) {
  if (
    !Number.isFinite(props.module * props.length * props.width * props.height)
  ) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Gear rack envelope dimensions must be finite",
    })
    return
  }
  const toothDepth = 2.25 * props.module
  if (props.height <= toothDepth + 1) {
    context.addIssue({
      code: "custom",
      path: ["height"],
      message:
        "Rack overall height must leave a solid root web below the tooth dedendum",
    })
  }
  const linearPitch = Math.PI * props.module
  if (props.length < 2 * linearPitch) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Rack length must span at least two linear tooth pitches",
    })
  }
  if (props.holeDiameter >= props.width) {
    context.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message:
        "Base mounting hole diameter must leave material across the rack width",
    })
  }
  if (props.holePitch <= props.holeDiameter) {
    context.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Base mounting hole pitch must exceed hole diameter",
    })
  }
  if (props.holePitch + props.holeDiameter >= props.length) {
    context.addIssue({
      code: "custom",
      path: ["holePitch"],
      message:
        "Base mounting holes must leave material at both ends of the rack bar",
    })
  }
}
