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
  outerAcrossFlats: positiveLength,
  innerAcrossFlats: positiveLength,
  length: positiveLength,
  regular: z.literal(true).default(true),
  cornerRadius: length.refine((value) => value >= 0).default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>
const sqrtThree = Math.sqrt(3)
const cosHalfSector = sqrtThree / 2

function section(props: ResolvedProps) {
  const outerApothem = props.outerAcrossFlats / 2
  const innerApothem = props.innerAcrossFlats / 2
  const radius = props.cornerRadius
  const outerCornerDistance = radius + (outerApothem - radius) / cosHalfSector
  const innerCornerDistance = props.innerAcrossFlats / sqrtThree
  return {
    outerApothem,
    innerApothem,
    wallThickness: outerApothem - innerApothem,
    outerFlatLength: (props.outerAcrossFlats - 2 * radius) / sqrtThree,
    outerCornerDistance,
    innerCornerDistance,
    cornerClearance: outerCornerDistance - innerCornerDistance,
  }
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const dimensions = section(props)
  const issue = (path: keyof ResolvedProps, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })

  if (
    dimensions.innerApothem <= 0 ||
    2 * dimensions.innerApothem !== props.innerAcrossFlats
  )
    issue(
      "innerAcrossFlats",
      "The opening must have a positive, representable apothem",
    )
  if (
    dimensions.outerApothem <= dimensions.innerApothem ||
    2 * dimensions.outerApothem !== props.outerAcrossFlats
  )
    issue(
      "outerAcrossFlats",
      "The outside must have a representable apothem greater than the opening",
    )
  else if (
    props.cornerRadius >= dimensions.outerApothem ||
    dimensions.outerFlatLength <= 0
  )
    issue(
      "cornerRadius",
      "Outer fillets must leave six positive-width flat faces",
    )
  else if (
    dimensions.wallThickness <= props.cornerRadius * (1 - cosHalfSector) ||
    dimensions.cornerClearance <= 0
  )
    issue(
      "cornerRadius",
      "Outer fillets must leave material around the sharp opening corners",
    )
  else if (!Number.isFinite(2 * dimensions.outerCornerDistance))
    issue(
      "outerAcrossFlats",
      "The outer corner-to-corner extent must be finite",
    )
}

export const hollowHexBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const hollowHexBarModelDefinitionSchema = z
  .object({ fn: z.literal("hollowhexbar"), ...shape })
  .strict()
  .superRefine(validate)

export type HollowHexBarModelPropsInput = z.input<
  typeof hollowHexBarModelPropsSchema
>
export type HollowHexBarModelProps = z.output<
  typeof hollowHexBarModelPropsSchema
>
export type HollowHexBarModelDefinition = z.output<
  typeof hollowHexBarModelDefinitionSchema
>

/** Aligned, concentric hexagons in XY, with two flats normal to X.
 * The opening is sharp, the outer corners may be rounded, and Z=0..length.
 */
export function getHollowHexBarDimensions(input: HollowHexBarModelPropsInput) {
  const props = hollowHexBarModelPropsSchema.parse(input)
  const dimensions = section(props)
  const { outerApothem, outerCornerDistance } = dimensions
  return {
    ...props,
    ...dimensions,
    size: [props.outerAcrossFlats, 2 * outerCornerDistance, props.length] as [
      number,
      number,
      number,
    ],
    bounds: {
      min: [-outerApothem, -outerCornerDistance, 0] as [number, number, number],
      max: [outerApothem, outerCornerDistance, props.length] as [
        number,
        number,
        number,
      ],
    },
    bottomZ: 0,
    topZ: props.length,
  }
}
