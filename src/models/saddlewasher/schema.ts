import { z } from "zod"
import { positiveGearLengthSchema as positiveLength } from "../../gear-parameter-schemas"

const shape = {
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  height: positiveLength,
  seatRadius: positiveLength,
  custom: z.literal(true).default(true),
  cylindricalSeat: z.literal(true).default(true),
  flatTop: z.literal(true).default(true),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function cylindricalSeatDepth(outerRadius: number, seatRadius: number) {
  const ratio = outerRadius / seatRadius
  const remaining = (seatRadius - outerRadius) / seatRadius
  // Rationalize the circular segment formula to retain shallow seat depths.
  return outerRadius * (ratio / (1 + Math.sqrt(remaining * (1 + ratio))))
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const innerRadius = props.innerDiameter / 2
  const outerRadius = props.outerDiameter / 2
  if (innerRadius <= 0 || innerRadius * 2 !== props.innerDiameter)
    context.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "The bore must have a positive, representable radius",
    })
  if (outerRadius <= innerRadius || outerRadius * 2 !== props.outerDiameter)
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "The outside radius must be greater than the bore radius",
    })
  if (props.seatRadius < outerRadius) {
    context.addIssue({
      code: "custom",
      path: ["seatRadius"],
      message: "The cylindrical seat radius must span the outside radius",
    })
    return
  }

  const seatDepth = cylindricalSeatDepth(outerRadius, props.seatRadius)
  if (seatDepth <= 0)
    context.addIssue({
      code: "custom",
      path: ["seatRadius"],
      message: "The cylindrical seat must have a representable positive depth",
    })
  // Relative roundoff can vanish when the seat depth is subnormal.
  const roundoff = Math.max(
    2 * Number.MIN_VALUE,
    4 * Number.EPSILON * seatDepth,
  )
  if (props.height - seatDepth <= roundoff)
    context.addIssue({
      code: "custom",
      path: ["height"],
      message:
        "The cylindrical seat must leave a positive thickness beyond roundoff",
    })
}

export const saddleWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const saddleWasherModelDefinitionSchema = z
  .object({ fn: z.literal("saddlewasher"), ...shape })
  .strict()
  .superRefine(validate)

export type SaddleWasherModelPropsInput = z.input<
  typeof saddleWasherModelPropsSchema
>
export type SaddleWasherModelProps = z.output<
  typeof saddleWasherModelPropsSchema
>
export type SaddleWasherModelDefinition = z.output<
  typeof saddleWasherModelDefinitionSchema
>

export function getSaddleWasherDimensions(input: SaddleWasherModelPropsInput) {
  const props = saddleWasherModelPropsSchema.parse(input)
  const outerRadius = props.outerDiameter / 2
  const seatDepth = cylindricalSeatDepth(outerRadius, props.seatRadius)
  return {
    ...props,
    innerRadius: props.innerDiameter / 2,
    outerRadius,
    seatDepth,
    minThickness: props.height - seatDepth,
  }
}
