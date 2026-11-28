import type { z } from "zod"
import {
  hexSocketBoltDimensions,
  type metricBoltSizeSchema,
} from "../../hex-socket-bolt-schema"

export interface BrushDcMotorRawProps {
  outerDiameter: number
  length: number
  shaftDiameter: number
  shaftLength: number
  face2Hole: true
  pitchCircleDiameter: number
  metricSize: z.output<typeof metricBoltSizeSchema>
  roundCan: true
  threadPitch?: number
  rightHanded: true
  threadClass: "6H"
  showThreads: boolean
}

export function validateBrushDcMotorProps(
  props: BrushDcMotorRawProps,
  context: z.RefinementCtx,
) {
  if (
    !Number.isFinite(
      props.outerDiameter *
        props.length *
        props.shaftDiameter *
        props.shaftLength,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Brushed DC motor envelope dimensions must be finite",
    })
    return
  }
  const spec = hexSocketBoltDimensions[props.metricSize]
  if (
    props.threadPitch !== undefined &&
    Math.abs(props.threadPitch - spec.threadPitch) > 1e-9
  ) {
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: "Front mounting holes require the tabulated metric coarse pitch",
    })
  }
  if (props.shaftDiameter >= props.pitchCircleDiameter - spec.diameter) {
    context.addIssue({
      code: "custom",
      path: ["shaftDiameter"],
      message:
        "Output shaft diameter must clear the two front tapped mounting holes",
    })
  }
  if (props.pitchCircleDiameter + spec.diameter >= props.outerDiameter) {
    context.addIssue({
      code: "custom",
      path: ["pitchCircleDiameter"],
      message:
        "Front mounting hole pitch circle must leave wall inside the round can",
    })
  }
  if (props.length <= 2 * spec.diameter) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Motor can length must exceed front blind tapped hole depth",
    })
  }
}
