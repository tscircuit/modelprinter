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
  /** Diameter of the nominal circle before the diametral cut and rounding. */
  diameter: positiveLength,
  length: positiveLength,
  diametral: z.literal(true).default(true),
  edgeRadius: length.refine((value) => value >= 0).default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function flatHalfWidth(radius: number, edgeRadius: number) {
  // The fillet center is edgeRadius above the flat face and radius-edgeRadius
  // from the circle center. Scale before multiplying to avoid squaring lengths.
  return radius * Math.sqrt((radius - 2 * edgeRadius) / radius)
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const radius = props.diameter / 2
  if (radius <= 0 || 2 * radius !== props.diameter) {
    context.addIssue({
      code: "custom",
      path: ["diameter"],
      message: "Diameter must have a positive, representable radius",
    })
  } else if (
    2 * props.edgeRadius >= radius ||
    flatHalfWidth(radius, props.edgeRadius) <= 0
  ) {
    context.addIssue({
      code: "custom",
      path: ["edgeRadius"],
      message: "Longitudinal fillets must leave a positive-width flat face",
    })
  }
}

export const halfRoundBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const halfRoundBarModelDefinitionSchema = z
  .object({ fn: z.literal("halfroundbar"), ...shape })
  .strict()
  .superRefine(validate)

export type HalfRoundBarModelPropsInput = z.input<
  typeof halfRoundBarModelPropsSchema
>
export type HalfRoundBarModelProps = z.output<
  typeof halfRoundBarModelPropsSchema
>
export type HalfRoundBarModelDefinition = z.output<
  typeof halfRoundBarModelDefinitionSchema
>

/** Millimeter dimensions of a half-disc centered on its diameter in XY,
 * with the flat face at Y=0, the arc in +Y, and ends at Z=0 and Z=length.
 */
export function getHalfRoundBarDimensions(input: HalfRoundBarModelPropsInput) {
  const props = halfRoundBarModelPropsSchema.parse(input)
  const radius = props.diameter / 2
  const halfFlat = flatHalfWidth(radius, props.edgeRadius)
  // The rounded section lies inside the nominal semicircle. Bound the sum in
  // case roundoff would otherwise extend it past that envelope.
  const halfWidth = Math.min(radius, halfFlat + props.edgeRadius)
  const profileWidth = 2 * halfWidth
  return {
    ...props,
    radius,
    flatWidth: 2 * halfFlat,
    profileWidth,
    profileHeight: radius,
    size: [profileWidth, radius, props.length] as [number, number, number],
    bounds: {
      min: [-halfWidth, 0, 0] as [number, number, number],
      max: [halfWidth, radius, props.length] as [number, number, number],
    },
    bottomZ: 0,
    topZ: props.length,
  }
}
