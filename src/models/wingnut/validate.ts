import type { z } from "zod"
import { type WingNutMetricSize, wingNutDimensions } from "./table"

export interface WingNutRawProps {
  din315: true
  metricSize: WingNutMetricSize
  roundedWings: true
  threadPitch?: number
  rightHanded: true
  threadClass: "6H"
  showThreads: boolean
}

export function validateWingNutProps(
  props: WingNutRawProps,
  context: z.RefinementCtx,
) {
  const expectedPitch = wingNutDimensions[props.metricSize].threadPitch
  if (
    props.threadPitch !== undefined &&
    Math.abs(props.threadPitch - expectedPitch) > 1e-9
  ) {
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: "DIN 315 wing nuts require the tabulated coarse pitch",
    })
  }
}
