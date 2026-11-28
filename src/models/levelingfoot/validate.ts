import type { z } from "zod"
import { type LevelingFootMetricSize, levelingFootThreads } from "./table"

export interface LevelingFootRawProps {
  padDiameter: number
  padHeight: number
  metricSize: LevelingFootMetricSize
  stemLength: number
  swivelAngle: 0
  flatBase: true
  threadPitch?: number
  rightHanded: true
  threadClass: "6g"
  showThreads: boolean
}

export function validateLevelingFootProps(
  props: LevelingFootRawProps,
  context: z.RefinementCtx,
) {
  if (
    !Number.isFinite(props.padDiameter * props.padHeight * props.stemLength)
  ) {
    context.addIssue({
      code: "custom",
      path: ["padDiameter"],
      message: "Leveling foot envelope dimensions must be finite",
    })
    return
  }
  const spec = levelingFootThreads[props.metricSize]
  if (props.padDiameter <= spec.diameter) {
    context.addIssue({
      code: "custom",
      path: ["padDiameter"],
      message: "Circular pad diameter must exceed threaded stem diameter",
    })
  }
  if (props.stemLength < 2 * spec.threadPitch) {
    context.addIssue({
      code: "custom",
      path: ["stemLength"],
      message:
        "Threaded stem length must span at least two full thread pitches",
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
        "Leveling foot stems require the tabulated ISO metric coarse pitch",
    })
  }
}
