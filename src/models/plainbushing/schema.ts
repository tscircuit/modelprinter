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
const positiveLength = length.refine((value) => value > 0)

const shape = {
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  /** Overall end-plane distance, including the chamfers. */
  length: positiveLength,
  style: z.literal("plainclosed").default("plainclosed"),
  /** Equal axial/radial setbacks of all four 45-degree bore/outside rim chamfers. */
  edgeChamfer: length.refine((value) => value >= 0).default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  if (props.outerDiameter <= props.innerDiameter)
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outside diameter must exceed the bore diameter",
    })
  else if (props.edgeChamfer >= (props.outerDiameter - props.innerDiameter) / 4)
    context.addIssue({
      code: "custom",
      path: ["edgeChamfer"],
      message: "Inner and outer rim chamfers must leave an annular end face",
    })
  if (props.edgeChamfer >= props.length / 2)
    context.addIssue({
      code: "custom",
      path: ["edgeChamfer"],
      message: "The two end chamfers must leave positive straight bore length",
    })
}

export const plainBushingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const plainBushingModelDefinitionSchema = z
  .object({ fn: z.literal("plainbushing"), ...shape })
  .strict()
  .superRefine(validate)

export type PlainBushingModelPropsInput = z.input<
  typeof plainBushingModelPropsSchema
>
export type PlainBushingModelProps = z.output<
  typeof plainBushingModelPropsSchema
>
export type PlainBushingModelDefinition = z.output<
  typeof plainBushingModelDefinitionSchema
>

export function getPlainBushingDimensions(input: PlainBushingModelPropsInput) {
  const props = plainBushingModelPropsSchema.parse(input)
  return {
    innerDiameter: props.innerDiameter,
    outerDiameter: props.outerDiameter,
    length: props.length,
    wallThickness: (props.outerDiameter - props.innerDiameter) / 2,
    endInnerDiameter: props.innerDiameter + 2 * props.edgeChamfer,
    endOuterDiameter: props.outerDiameter - 2 * props.edgeChamfer,
    straightLength: props.length - 2 * props.edgeChamfer,
  }
}
