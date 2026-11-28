import type { z } from "zod"

export interface IdlerPulleyShapeOutput {
  outerDiameter: number
  boreDiameter: number
  width: number
  smoothFlanged: true
  flangeDiameter: number
  bearingBoreDiameter: number
}

export function validateIdlerPulleyProps(
  props: IdlerPulleyShapeOutput,
  context: z.RefinementCtx,
) {
  if (
    !Number.isFinite(props.outerDiameter * props.width * props.flangeDiameter)
  ) {
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Idler pulley envelope dimensions must be finite",
    })
    return
  }
  if (props.flangeDiameter <= props.outerDiameter) {
    context.addIssue({
      code: "custom",
      path: ["flangeDiameter"],
      message: "Side flange diameter must exceed roller outer diameter",
    })
  }
  if (props.bearingBoreDiameter < props.boreDiameter) {
    context.addIssue({
      code: "custom",
      path: ["bearingBoreDiameter"],
      message:
        "Bearing center bore diameter must be at least the through bore diameter",
    })
  }
  if (props.bearingBoreDiameter >= props.outerDiameter) {
    context.addIssue({
      code: "custom",
      path: ["bearingBoreDiameter"],
      message:
        "Bearing center bore diameter must leave positive roller rim wall thickness",
    })
  }
}
