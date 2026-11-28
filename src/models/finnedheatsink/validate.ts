import type { z } from "zod"

export interface FinnedHeatsinkShapeOutput {
  width: number
  length: number
  baseThickness: number
  height: number
  finCount: number
  finThickness: number
  finPitch: number
  holeCount: 2
  holeDiameter: number
  holePitch: number
  longitudinal: boolean
}

export function validateFinnedHeatsinkProps(
  props: FinnedHeatsinkShapeOutput,
  context: z.RefinementCtx,
) {
  if (
    !Number.isFinite(
      props.width *
        props.length *
        props.baseThickness *
        props.height *
        props.finThickness *
        props.finPitch *
        props.holeDiameter *
        props.holePitch,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["width"],
      message: "Heatsink envelope dimensions must be finite",
    })
    return
  }
  if (props.baseThickness >= props.height) {
    context.addIssue({
      code: "custom",
      path: ["baseThickness"],
      message: "Base thickness must be smaller than overall heatsink height",
    })
  }
  if (props.finPitch <= props.finThickness) {
    context.addIssue({
      code: "custom",
      path: ["finPitch"],
      message: "Fin pitch must exceed fin thickness to leave open air channels",
    })
  }
  const crossFinSpan = props.longitudinal ? props.width : props.length
  const finRunSpan = props.longitudinal ? props.length : props.width
  const outerFinSpan =
    (props.finCount - 1) * props.finPitch + props.finThickness
  if (!Number.isFinite(outerFinSpan) || outerFinSpan > crossFinSpan) {
    context.addIssue({
      code: "custom",
      path: [props.longitudinal ? "width" : "length"],
      message:
        "Fin array outer span must fit within the cross-fin base dimension",
    })
  }
  if (props.finCount % 2 !== 0) {
    context.addIssue({
      code: "custom",
      path: ["finCount"],
      message:
        "Centered base fixing holes require an even fin count to leave a central channel",
    })
  }
  const channelWidth = props.finPitch - props.finThickness
  if (props.holeDiameter >= channelWidth) {
    context.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Fixing hole diameter must clear the central inter-fin channel",
    })
  }
  if (props.holePitch <= props.holeDiameter) {
    context.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Fixing hole pitch must exceed hole diameter",
    })
  }
  if (props.holePitch + props.holeDiameter >= finRunSpan) {
    context.addIssue({
      code: "custom",
      path: [props.longitudinal ? "length" : "width"],
      message:
        "Fixing holes must leave positive end margins along the fin run axis",
    })
  }
}
