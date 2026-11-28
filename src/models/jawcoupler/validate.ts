import type { z } from "zod"
import {
  hexSocketBoltDimensions,
  type metricBoltSizeSchema,
} from "../../hex-socket-bolt-schema"

export interface JawCouplerRawProps {
  boreDiameter: number
  boreBDiameter?: number
  outerDiameter: number
  length: number
  jawCount: number
  curvedJaw: true
  setScrew: true
  metricSize: z.output<typeof metricBoltSizeSchema>
  threadPitch?: number
  rightHanded: true
  threadClass: "6H"
  showThreads: boolean
}

export function validateJawCouplerProps(
  props: JawCouplerRawProps,
  context: z.RefinementCtx,
) {
  const boreB = props.boreBDiameter ?? props.boreDiameter
  if (
    !Number.isFinite(
      props.outerDiameter * props.length * props.boreDiameter * boreB,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Jaw coupler envelope dimensions must be finite",
    })
    return
  }
  const maxBore = Math.max(props.boreDiameter, boreB)
  if (props.outerDiameter <= maxBore + 2) {
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message:
        "Hub outer diameter must leave positive radial wall around both bores",
    })
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
        "Jaw coupler radial set-screw holes require the tabulated coarse pitch",
    })
  }
  if (spec.diameter >= (props.outerDiameter - maxBore) * 2) {
    context.addIssue({
      code: "custom",
      path: ["metricSize"],
      message: "Set-screw thread diameter exceeds hub wall capacity",
    })
  }
  if (props.length <= 3 * spec.diameter) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Overall coupling length must accommodate two set-screw hubs and central spider",
    })
  }
}
