import type { z } from "zod"
import {
  hexSocketBoltDimensions,
  type metricBoltSizeSchema,
} from "../../hex-socket-bolt-schema"

export interface BrushlessDcMotorRawProps {
  outerDiameter: number
  length: number
  shaftDiameter: number
  shaftLength: number
  boltPitchCircleDiameter: number
  face4Hole: true
  metricSize: z.output<typeof metricBoltSizeSchema>
  outrunner: true
  threadPitch?: number
  rightHanded: true
  threadClass: "6H"
  showThreads: boolean
}

export function validateBrushlessDcMotorProps(
  props: BrushlessDcMotorRawProps,
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
      message: "Brushless DC motor envelope dimensions must be finite",
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
      message:
        "Stator mounting holes require the tabulated metric coarse pitch",
    })
  }
  if (props.shaftDiameter >= props.boltPitchCircleDiameter - spec.diameter) {
    context.addIssue({
      code: "custom",
      path: ["shaftDiameter"],
      message:
        "Output shaft diameter must clear the four stator mounting holes",
    })
  }
  if (props.boltPitchCircleDiameter + spec.diameter >= props.outerDiameter) {
    context.addIssue({
      code: "custom",
      path: ["boltPitchCircleDiameter"],
      message:
        "Bolt pitch circle must fit inside the outrunner stator/bell diameter",
    })
  }
  if (props.boltPitchCircleDiameter / Math.SQRT2 <= spec.diameter) {
    context.addIssue({
      code: "custom",
      path: ["boltPitchCircleDiameter"],
      message: "Adjacent 90-degree mounting holes must not intersect",
    })
  }
  if (props.length <= 2 * spec.diameter) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Motor body length must exceed stator mounting thread depth",
    })
  }
}
