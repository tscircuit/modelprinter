import type { z } from "zod"
import { type CamFollowerMetricSize, camFollowerThreads } from "./table"

export interface CamFollowerRawProps {
  outerDiameter: number
  width: number
  studDiameter?: number
  studLength: number
  needleBearing: true
  studMount: true
  metricSize: CamFollowerMetricSize
  threadPitch?: number
  rightHanded: true
  threadClass: "6g"
  showThreads: boolean
}

export function validateCamFollowerProps(
  props: CamFollowerRawProps,
  context: z.RefinementCtx,
) {
  if (!Number.isFinite(props.outerDiameter * props.width * props.studLength)) {
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Cam follower envelope dimensions must be finite",
    })
    return
  }
  const spec = camFollowerThreads[props.metricSize]
  const studDiameter = props.studDiameter ?? spec.diameter
  if (Math.abs(studDiameter - spec.diameter) > 1e-9) {
    context.addIssue({
      code: "custom",
      path: ["studDiameter"],
      message:
        "Stud diameter must match the nominal ISO metric thread diameter",
    })
  }
  if (props.outerDiameter <= studDiameter + 2) {
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message:
        "Outer race diameter must leave radial clearance for needle rollers and race wall",
    })
  }
  if (props.studLength < 2 * spec.threadPitch) {
    context.addIssue({
      code: "custom",
      path: ["studLength"],
      message: "Threaded stud length must span at least two thread pitches",
    })
  }
  if (
    props.threadPitch !== undefined &&
    Math.abs(props.threadPitch - spec.threadPitch) > 1e-9
  ) {
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message:
        "Cam follower studs require the tabulated ISO metric coarse pitch",
    })
  }
}
