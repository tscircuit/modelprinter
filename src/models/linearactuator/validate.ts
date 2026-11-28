import type { z } from "zod"

export interface LinearActuatorShapeOutput {
  bodyOuterDiameter: number
  retractedLength: number
  stroke: number
  rodOuterDiameter: number
  eyeEye: true
  eyeBoreDiameter: number
  electricScrew: true
}

export function validateLinearActuatorProps(
  props: LinearActuatorShapeOutput,
  context: z.RefinementCtx,
) {
  if (
    !Number.isFinite(
      props.bodyOuterDiameter * props.retractedLength * props.stroke,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["retractedLength"],
      message: "Linear actuator envelope dimensions must be finite",
    })
    return
  }
  if (props.rodOuterDiameter >= props.bodyOuterDiameter) {
    context.addIssue({
      code: "custom",
      path: ["rodOuterDiameter"],
      message:
        "Extending rod diameter must be smaller than outer body diameter",
    })
  }
  if (props.eyeBoreDiameter >= props.rodOuterDiameter) {
    context.addIssue({
      code: "custom",
      path: ["eyeBoreDiameter"],
      message: "Pivot-eye bore diameter must fit within the rod-end eye boss",
    })
  }
  if (props.retractedLength <= props.stroke + 2 * props.eyeBoreDiameter) {
    context.addIssue({
      code: "custom",
      path: ["retractedLength"],
      message:
        "Retracted center-to-center length must house the stroke and both pivot eyes",
    })
  }
}
