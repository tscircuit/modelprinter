import type { z } from "zod"
import { type BridgeHandleMetricSize, bridgeHandleThreads } from "./table"

export interface BridgeHandleRawProps {
  pitch: number
  width: number
  height: number
  gripThickness: number
  footSize: [number, number]
  holeCount: 2
  metricSize: BridgeHandleMetricSize
  threadPitch?: number
  rightHanded: true
  threadClass: "6H"
  showThreads: boolean
}

export function validateBridgeHandleProps(
  props: BridgeHandleRawProps,
  context: z.RefinementCtx,
) {
  const [footLength, footWidth] = props.footSize
  if (
    !Number.isFinite(
      props.pitch * props.width * props.height * footLength * footWidth,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "Bridge handle envelope dimensions must be finite",
    })
    return
  }
  if (props.gripThickness >= props.height) {
    context.addIssue({
      code: "custom",
      path: ["gripThickness"],
      message:
        "Grip thickness must be smaller than overall height to leave hand clearance",
    })
  }
  if (props.pitch <= footLength) {
    context.addIssue({
      code: "custom",
      path: ["pitch"],
      message:
        "Mounting hole pitch must exceed foot length so the two feet remain separated",
    })
  }
  if (props.width > footWidth) {
    context.addIssue({
      code: "custom",
      path: ["width"],
      message: "Bridge grip width must not overhang the mounting foot width",
    })
  }
  const spec = bridgeHandleThreads[props.metricSize]
  if (
    props.threadPitch !== undefined &&
    Math.abs(props.threadPitch - spec.threadPitch) > 1e-9
  ) {
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message:
        "Bridge handle tapped holes require the tabulated metric coarse pitch",
    })
  }
  if (spec.diameter >= Math.min(footLength, footWidth)) {
    context.addIssue({
      code: "custom",
      path: ["metricSize"],
      message:
        "Tapped hole diameter must leave wall thickness inside each mounting foot",
    })
  }
  if (spec.threadDepth >= props.height) {
    context.addIssue({
      code: "custom",
      path: ["height"],
      message: "Blind tapped hole depth must be shorter than overall height",
    })
  }
}
