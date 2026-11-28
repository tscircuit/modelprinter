import type { z } from "zod"

export const bobbinMountCoarsePitches = {
  M3: 0.5,
  M4: 0.7,
  M5: 0.8,
  M6: 1,
  M8: 1.25,
  M10: 1.5,
  M12: 1.75,
} as const

export type BobbinMountMetricSize = keyof typeof bobbinMountCoarsePitches

export interface BobbinMountShapeOutput {
  outerDiameter: number
  height: number
  studDiameter?: number
  studLength: number
  studStud: true
  metricSize: BobbinMountMetricSize
}

export function validateBobbinMountProps(
  props: BobbinMountShapeOutput,
  context: z.RefinementCtx,
) {
  const nominalDiameter = Number(props.metricSize.slice(1))
  const resolvedStudDiameter = props.studDiameter ?? nominalDiameter
  const pitch = bobbinMountCoarsePitches[props.metricSize]
  if (
    !Number.isFinite(
      props.outerDiameter *
        props.height *
        props.studLength *
        resolvedStudDiameter,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Bobbin mount envelope dimensions must be finite",
    })
    return
  }
  if (Math.abs(resolvedStudDiameter - nominalDiameter) > 1e-6) {
    context.addIssue({
      code: "custom",
      path: ["studDiameter"],
      message: "Stud diameter must match the nominal metric thread size",
    })
  }
  if (props.outerDiameter <= resolvedStudDiameter) {
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Isolator body outer diameter must exceed stud diameter",
    })
  }
  if (props.studLength <= pitch) {
    context.addIssue({
      code: "custom",
      path: ["studLength"],
      message: "Stud length must exceed one nominal thread pitch",
    })
  }
}
