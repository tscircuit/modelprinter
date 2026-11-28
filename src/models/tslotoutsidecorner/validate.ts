import type { z } from "zod"

export interface TSlotOutsideCornerShapeOutput {
  width: number
  legLength: number
  thickness: number
  angle: 90
  holeCount: 4
  holeDiameter: number
  holePitch: number
  holeOffset: number
  bendRadius: number
}

export function validateTSlotOutsideCornerProps(
  props: TSlotOutsideCornerShapeOutput,
  context: z.RefinementCtx,
) {
  if (!Number.isFinite(props.width * props.legLength * props.thickness)) {
    context.addIssue({
      code: "custom",
      path: ["legLength"],
      message: "Bracket envelope dimensions must be finite",
    })
    return
  }
  if (props.thickness >= props.legLength) {
    context.addIssue({
      code: "custom",
      path: ["thickness"],
      message: "Thickness must be smaller than the leg length",
    })
  }
  if (props.bendRadius >= props.legLength) {
    context.addIssue({
      code: "custom",
      path: ["bendRadius"],
      message: "Outer bend radius must leave a straight portion of each leg",
    })
  }
  if (props.holePitch <= props.holeDiameter) {
    context.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Transverse hole pitch must exceed hole diameter",
    })
  }
  if (props.holePitch + props.holeDiameter >= props.width) {
    context.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Transverse hole pair must leave material at both width edges",
    })
  }
  const holeRadius = props.holeDiameter * 0.5
  const innerStraightStart = Math.max(props.thickness, props.bendRadius)
  if (props.holeOffset - holeRadius <= innerStraightStart) {
    context.addIssue({
      code: "custom",
      path: ["holeOffset"],
      message:
        "Holes must lie wholly beyond the inner corner and bend tangent on each mounting face",
    })
  }
  if (props.holeOffset + holeRadius >= props.legLength) {
    context.addIssue({
      code: "custom",
      path: ["holeOffset"],
      message: "Holes must leave material at the free leg ends",
    })
  }
}
