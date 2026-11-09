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
  acrossFlats: positiveLength,
  length: positiveLength,
  regular: z.literal(true).default(true),
  cornerRadius: length.refine((value) => value >= 0).default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>
const halfSectorAngle = Math.PI / 8

function flatLength(props: ResolvedProps) {
  return (
    (props.acrossFlats - 2 * props.cornerRadius) * Math.tan(halfSectorAngle)
  )
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const apothem = props.acrossFlats / 2
  if (apothem <= 0 || 2 * apothem !== props.acrossFlats) {
    context.addIssue({
      code: "custom",
      path: ["acrossFlats"],
      message:
        "Across-flats size must have a positive, representable half-width",
    })
  } else if (props.cornerRadius >= apothem || flatLength(props) <= 0) {
    context.addIssue({
      code: "custom",
      path: ["cornerRadius"],
      message: "Corner fillets must leave eight positive-width flat faces",
    })
  }
}

export const octagonalBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const octagonalBarModelDefinitionSchema = z
  .object({ fn: z.literal("octagonalbar"), ...shape })
  .strict()
  .superRefine(validate)

export type OctagonalBarModelPropsInput = z.input<
  typeof octagonalBarModelPropsSchema
>
export type OctagonalBarModelProps = z.output<
  typeof octagonalBarModelPropsSchema
>
export type OctagonalBarModelDefinition = z.output<
  typeof octagonalBarModelDefinitionSchema
>

/** Millimeter dimensions of a regular octagon centered on XY with axis-aligned
 * flats, extruded from Z=0 to Z=length. Fillets run along the eight corners.
 */
export function getOctagonalBarDimensions(input: OctagonalBarModelPropsInput) {
  const props = octagonalBarModelPropsSchema.parse(input)
  const apothem = props.acrossFlats / 2
  return {
    ...props,
    apothem,
    flatLength: flatLength(props),
    circumradius:
      props.cornerRadius +
      (apothem - props.cornerRadius) / Math.cos(halfSectorAngle),
    size: [props.acrossFlats, props.acrossFlats, props.length] as [
      number,
      number,
      number,
    ],
    bounds: {
      min: [-apothem, -apothem, 0] as [number, number, number],
      max: [apothem, apothem, props.length] as [number, number, number],
    },
    bottomZ: 0,
    topZ: props.length,
  }
}
