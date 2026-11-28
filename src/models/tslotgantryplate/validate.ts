import type { z } from "zod"

export interface TSlotGantryPlateShapeOutput {
  width: number
  height: number
  thickness: number
  wheelSpacing: number
  vGrooveWheels: true
  axleHoleCount: 4
  holeDiameter: number
  eccentricDiameter: number
}

export function validateTSlotGantryPlateProps(
  props: TSlotGantryPlateShapeOutput,
  context: z.RefinementCtx,
) {
  if (!Number.isFinite(props.width * props.height * props.thickness)) {
    context.addIssue({
      code: "custom",
      path: ["width"],
      message: "Gantry plate envelope dimensions must be finite",
    })
    return
  }
  if (props.eccentricDiameter <= props.holeDiameter) {
    context.addIssue({
      code: "custom",
      path: ["eccentricDiameter"],
      message:
        "Eccentric-adjustment bore diameter must exceed fixed axle hole diameter",
    })
  }
  if (props.wheelSpacing <= props.eccentricDiameter) {
    context.addIssue({
      code: "custom",
      path: ["wheelSpacing"],
      message:
        "Wheel axle spacing must exceed eccentric-adjustment bore diameter",
    })
  }
  if (props.wheelSpacing + props.eccentricDiameter >= props.width) {
    context.addIssue({
      code: "custom",
      path: ["wheelSpacing"],
      message: "Wheel axle pattern must leave material at both width edges",
    })
  }
  if (props.wheelSpacing + props.eccentricDiameter >= props.height) {
    context.addIssue({
      code: "custom",
      path: ["wheelSpacing"],
      message: "Wheel axle pattern must leave material at both height edges",
    })
  }
}
