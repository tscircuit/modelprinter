import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(
        /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete numeric length with an optional unit",
      )
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)

const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  tipHeight: positiveLength,
  lengthwise: z.literal(true).default(true),
  edgeRadius: length.refine((value) => value >= 0).default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function thinEndFilletLimit({ length, height, tipHeight }: ResolvedProps) {
  // At the thin end, the upper fillet uses r / cos(angle) of the side
  // face and the base fillet uses r. Evaluate their limit without squaring
  // dimensions or dividing by a potentially tiny length.
  const rise = height - tipHeight
  const scale = Math.max(length, rise)
  const run = length / scale
  const denominator = run + Math.hypot(run, rise / scale)
  const largerFactor = Math.max(tipHeight, length) / scale
  return (largerFactor / denominator) * Math.min(tipHeight, length)
}

function leavesThinEndSide(props: ResolvedProps) {
  const limit = thinEndFilletLimit(props)
  // A rounded-up limit can admit exact contact. Require a margin for the
  // scaled operations and for values near the smallest representable length.
  const roundoff = Math.max(8 * Number.MIN_VALUE, 8 * Number.EPSILON * limit)
  return limit - props.edgeRadius > roundoff
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const halfWidth = props.width / 2
  if (halfWidth <= 0 || 2 * halfWidth !== props.width)
    context.addIssue({
      code: "custom",
      path: ["width"],
      message: "Width must have a positive, representable half-width",
    })
  if (props.tipHeight >= props.height)
    context.addIssue({
      code: "custom",
      path: ["tipHeight"],
      message: "Tip height must be less than the thick-end height",
    })
  else if (
    props.edgeRadius > 0 &&
    (props.edgeRadius >= halfWidth || !leavesThinEndSide(props))
  )
    context.addIssue({
      code: "custom",
      path: ["edgeRadius"],
      message:
        "Longitudinal fillets must leave positive width and a side face at the thin end",
    })
}

export const wedgeBlankModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const wedgeBlankModelDefinitionSchema = z
  .object({ fn: z.literal("wedgeblank"), ...shape })
  .strict()
  .superRefine(validate)

export type WedgeBlankModelPropsInput = z.input<
  typeof wedgeBlankModelPropsSchema
>
export type WedgeBlankModelProps = z.output<typeof wedgeBlankModelPropsSchema>
export type WedgeBlankModelDefinition = z.output<
  typeof wedgeBlankModelDefinitionSchema
>

/** The base is at Y=0, the width is centered on X, and the thick and thin
 * ends are at Z=0 and Z=length respectively. Dimensions are millimeters.
 */
export function getWedgeBlankDimensions(input: WedgeBlankModelPropsInput) {
  const props = wedgeBlankModelPropsSchema.parse(input)
  const halfWidth = props.width / 2
  const rise = props.height - props.tipHeight
  return {
    ...props,
    rise,
    taperAngleDegrees: (Math.atan2(rise, props.length) * 180) / Math.PI,
    size: [props.width, props.height, props.length] as [number, number, number],
    bounds: {
      min: [-halfWidth, 0, 0] as [number, number, number],
      max: [halfWidth, props.height, props.length] as [number, number, number],
    },
    thickEndZ: 0,
    thinEndZ: props.length,
  }
}
