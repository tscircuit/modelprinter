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
  /** Side length of the nominal sharp equilateral cross section. */
  sideLength: positiveLength,
  length: positiveLength,
  equilateral: z.literal(true).default(true),
  /** Equal circular fillets along the three longitudinal corners. */
  cornerRadius: length.refine((value) => value >= 0).default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function profileDimensions(props: ResolvedProps) {
  const nominalHeight = props.sideLength * (Math.sqrt(3) / 2)
  const inradius = nominalHeight / 3
  return {
    nominalHeight,
    inradius,
    circumradius: 2 * inradius - props.cornerRadius,
    straightSideLength:
      props.sideLength - 2 * Math.sqrt(3) * props.cornerRadius,
    profileWidth:
      props.sideLength - 2 * (Math.sqrt(3) - 1) * props.cornerRadius,
    profileHeight: nominalHeight - props.cornerRadius,
  }
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const dimensions = profileDimensions(props)
  const issue = (message: string, property: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", path: [property], message })
  if (dimensions.inradius <= 0)
    issue("The nominal triangle must retain a positive inradius", "sideLength")
  if (
    props.cornerRadius >= dimensions.inradius ||
    dimensions.straightSideLength <= 0
  )
    issue(
      "Corner fillets must leave three positive-width flat faces",
      "cornerRadius",
    )
  if (
    Object.values(dimensions).some(
      (value) => !Number.isFinite(value) || value <= 0,
    )
  )
    issue(
      "Derived profile dimensions must remain finite and positive",
      "sideLength",
    )
}

/** Equilateral stock centered on its nominal XY centroid, one side along X at
 * negative Y and the opposite vertex on +Y. Flat ends are Z=0 and Z=length.
 */
export const triangularBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const triangularBarModelDefinitionSchema = z
  .object({ fn: z.literal("triangularbar"), ...shape })
  .strict()
  .superRefine(validate)

export type TriangularBarModelPropsInput = z.input<
  typeof triangularBarModelPropsSchema
>
export type TriangularBarModelProps = z.output<
  typeof triangularBarModelPropsSchema
>
export type TriangularBarModelDefinition = z.output<
  typeof triangularBarModelDefinitionSchema
>

/** Millimeter dimensions and actual rounded-profile bounds; rounding does not
 * move the nominal centroid or round the two end planes.
 */
export function getTriangularBarDimensions(
  input: TriangularBarModelPropsInput,
) {
  const props = triangularBarModelPropsSchema.parse(input)
  const dimensions = profileDimensions(props)
  return {
    ...props,
    ...dimensions,
    size: [dimensions.profileWidth, dimensions.profileHeight, props.length] as [
      number,
      number,
      number,
    ],
    bounds: {
      min: [-dimensions.profileWidth / 2, -dimensions.inradius, 0] as [
        number,
        number,
        number,
      ],
      max: [
        dimensions.profileWidth / 2,
        dimensions.nominalHeight - dimensions.inradius - props.cornerRadius,
        props.length,
      ] as [number, number, number],
    },
    bottomZ: 0,
    topZ: props.length,
  }
}
