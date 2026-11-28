import type { z } from "zod"
import { type CouplingNutMetricSize, couplingNutDimensions } from "./table"

export interface CouplingNutRawProps {
  din6334: true
  metricSize: CouplingNutMetricSize
  length?: number
  acrossFlats?: number
  threadPitch?: number
  rightHanded: true
  threadClass: "6H"
  showThreads: boolean
}

export function validateCouplingNutProps(
  props: CouplingNutRawProps,
  context: z.RefinementCtx,
) {
  const spec = couplingNutDimensions[props.metricSize]
  if (
    props.length !== undefined &&
    Math.abs(props.length - spec.length) > 1e-9
  ) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Coupling nut length contradicts the selected DIN 6334 size",
    })
  }
  if (
    props.acrossFlats !== undefined &&
    Math.abs(props.acrossFlats - spec.acrossFlats) > 1e-9
  ) {
    context.addIssue({
      code: "custom",
      path: ["acrossFlats"],
      message:
        "Coupling nut across-flats contradicts the selected DIN 6334 size",
    })
  }
  if (
    props.threadPitch !== undefined &&
    Math.abs(props.threadPitch - spec.threadPitch) > 1e-9
  ) {
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: "DIN 6334 coupling nuts require the tabulated coarse pitch",
    })
  }
}
