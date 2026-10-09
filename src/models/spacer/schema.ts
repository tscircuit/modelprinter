import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  /** End-plane distance, including the rim chamfers. */
  length: positiveLength,
  round: z.literal(true).default(true),
  /** Equal axial/radial setbacks at all four 45-degree rims. */
  chamfer: length
    .refine((value) => value >= 0, "Chamfer cannot be negative")
    .default(0),
}
type Props = z.output<z.ZodObject<typeof shape>>
function validate(props: Props, context: z.RefinementCtx) {
  if (props.outerDiameter <= props.innerDiameter)
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outside diameter must exceed the bore diameter",
    })
  else if (props.chamfer >= (props.outerDiameter - props.innerDiameter) / 4)
    context.addIssue({
      code: "custom",
      path: ["chamfer"],
      message: "Chamfers must leave an annular end face",
    })
  if (props.chamfer >= props.length / 2)
    context.addIssue({
      code: "custom",
      path: ["chamfer"],
      message: "Chamfers must leave positive straight bore length",
    })
}
export const spacerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const spacerModelDefinitionSchema = z
  .object({ fn: z.literal("spacer"), ...shape })
  .strict()
  .superRefine(validate)
export type SpacerModelPropsInput = z.input<typeof spacerModelPropsSchema>
export type SpacerModelProps = z.output<typeof spacerModelPropsSchema>
export type SpacerModelDefinition = z.output<typeof spacerModelDefinitionSchema>

/** All dimensions are millimeters; bottom face Z=0, top face Z=length. */
export function getSpacerDimensions(input: SpacerModelPropsInput) {
  const props = spacerModelPropsSchema.parse(input)
  return {
    ...props,
    wallThickness: (props.outerDiameter - props.innerDiameter) / 2,
    endInnerDiameter: props.innerDiameter + 2 * props.chamfer,
    endOuterDiameter: props.outerDiameter - 2 * props.chamfer,
    straightLength: props.length - 2 * props.chamfer,
    bottomZ: 0,
    topZ: props.length,
  }
}
