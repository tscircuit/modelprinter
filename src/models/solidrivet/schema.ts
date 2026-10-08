import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const positiveLength = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value > 0, "Length must be positive")

const shape = {
  specification: z.literal("custom").default("custom"),
  diameter: positiveLength,
  /** Under-head shank length; the head is additional to this length. */
  length: positiveLength,
  headDiameter: positiveLength,
  /** Height of a spherical cap above its flat bearing plane. */
  headHeight: positiveLength,
  roundHead: z.literal(true).default(true),
  flatTail: z.literal(true).default(true),
  unset: z.literal(true).default(true),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

const getHeadSphereRadius = (props: ResolvedProps) =>
  props.headHeight / 2 +
  (props.headDiameter / 2) * (props.headDiameter / props.headHeight / 4)

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  if (props.headDiameter <= props.diameter)
    context.addIssue({
      code: "custom",
      path: ["headDiameter"],
      message: "Head diameter must exceed the shank diameter",
    })
  if (props.headHeight > props.headDiameter / 2)
    context.addIssue({
      code: "custom",
      path: ["headHeight"],
      message:
        "The round head must be a spherical cap no taller than a hemisphere",
    })
  if (
    !Number.isFinite(getHeadSphereRadius(props)) ||
    !Number.isFinite(props.length + props.headHeight)
  )
    context.addIssue({
      code: "custom",
      message: "Derived head radius and overall length must be finite",
    })
}

export const solidRivetModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const solidRivetModelDefinitionSchema = z
  .object({ fn: z.literal("solidrivet"), ...shape })
  .strict()
  .superRefine(validate)

export type SolidRivetModelPropsInput = z.input<
  typeof solidRivetModelPropsSchema
>
export type SolidRivetModelProps = z.output<typeof solidRivetModelPropsSchema>
export type SolidRivetModelDefinition = z.output<
  typeof solidRivetModelDefinitionSchema
>

/**
 * Nominal dimensions in a right-handed local XYZ frame, in millimeters.
 * The shank axis is Z, the bearing plane is Z=0, the head points toward +Z,
 * and the flat unpeened tail is at Z=-length. Returned Z values are positions.
 */
export function getSolidRivetDimensions(input: SolidRivetModelPropsInput) {
  const props = solidRivetModelPropsSchema.parse(input)
  const headSphereRadius = getHeadSphereRadius(props)
  return {
    diameter: props.diameter,
    length: props.length,
    headDiameter: props.headDiameter,
    headHeight: props.headHeight,
    overallLength: props.length + props.headHeight,
    headSphereRadius,
    headSphereCenterZ: props.headHeight - headSphereRadius,
    shankBottomZ: -props.length,
    headTopZ: props.headHeight,
  }
}
