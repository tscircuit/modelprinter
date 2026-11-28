import type { z } from "zod"
import { type CapNutMetricSize, capNutDimensions } from "./table"

export interface CapNutRawProps {
  din1587: true
  metricSize: CapNutMetricSize
  threadPitch?: number
  rightHanded: true
  threadClass: "6H"
  showThreads: boolean
}

export function validateCapNutProps(
  props: CapNutRawProps,
  context: z.RefinementCtx,
) {
  const expectedPitch = capNutDimensions[props.metricSize].threadPitch
  if (
    props.threadPitch !== undefined &&
    Math.abs(props.threadPitch - expectedPitch) > 1e-9
  ) {
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: "DIN 1587 cap nuts require the tabulated coarse pitch",
    })
  }
}
