import type { z } from "zod"

export interface PlainWheelShapeOutput {
  outerDiameter: number
  width: number
  boreDiameter: number
  hubDiameter: number
  axleBore: true
  hubWidth: number
  roundEdge: true
}

export function validatePlainWheelProps(
  props: PlainWheelShapeOutput,
  context: z.RefinementCtx,
) {
  if (
    !Number.isFinite(
      props.outerDiameter * props.width * props.hubDiameter * props.hubWidth,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Plain wheel envelope dimensions must be finite",
    })
    return
  }
  if (props.boreDiameter >= props.hubDiameter) {
    context.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Axle bore diameter must leave positive hub wall thickness",
    })
  }
  if (props.hubDiameter >= props.outerDiameter) {
    context.addIssue({
      code: "custom",
      path: ["hubDiameter"],
      message: "Hub outer diameter must be smaller than wheel outer diameter",
    })
  }
  if (props.hubWidth < props.width) {
    context.addIssue({
      code: "custom",
      path: ["hubWidth"],
      message: "Hub axial width must be at least the wheel rim width",
    })
  }
}
