import { z } from "zod"
import { modelLengthSchema } from "./model-length-schema"

const positiveLength = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value > 0)

const shape = {
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  flangeDiameter: positiveLength,
  /** Overall end-plane distance including the integral flange. */
  length: positiveLength,
  flangeThickness: positiveLength,
  style: z.literal("plainclosed").default("plainclosed"),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  if (props.outerDiameter <= props.innerDiameter)
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Sleeve outside diameter must exceed the bore diameter",
    })
  if (props.flangeDiameter <= props.outerDiameter)
    context.addIssue({
      code: "custom",
      path: ["flangeDiameter"],
      message: "Flange diameter must exceed the sleeve outside diameter",
    })
  if (props.flangeThickness >= props.length)
    context.addIssue({
      code: "custom",
      path: ["flangeThickness"],
      message:
        "Flange thickness must leave a positive projecting sleeve length",
    })
}

export const flangedBushingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const flangedBushingModelDefinitionSchema = z
  .object({ fn: z.literal("flangedbushing"), ...shape })
  .strict()
  .superRefine(validate)

export type FlangedBushingModelPropsInput = z.input<
  typeof flangedBushingModelPropsSchema
>
export type FlangedBushingModelProps = z.output<
  typeof flangedBushingModelPropsSchema
>
export type FlangedBushingModelDefinition = z.output<
  typeof flangedBushingModelDefinitionSchema
>

export function getFlangedBushingDimensions(
  input: FlangedBushingModelPropsInput,
) {
  const props = flangedBushingModelPropsSchema.parse(input)
  return {
    innerDiameter: props.innerDiameter,
    outerDiameter: props.outerDiameter,
    flangeDiameter: props.flangeDiameter,
    length: props.length,
    flangeThickness: props.flangeThickness,
    sleeveLength: props.length - props.flangeThickness,
    wallThickness: (props.outerDiameter - props.innerDiameter) / 2,
    flangeProjection: (props.flangeDiameter - props.outerDiameter) / 2,
    shoulderZ: props.flangeThickness,
  }
}
