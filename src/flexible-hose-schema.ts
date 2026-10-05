import { z } from "zod"
import { positiveModelLengthSchema } from "./model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(
        /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete numeric length with an optional unit",
      ),
  ])
  .pipe(positiveModelLengthSchema)

const shape = {
  innerDiameter: length,
  outerDiameter: length,
  length: length,
  shape: z.literal("straight").default("straight"),
  wall: z.literal("smooth").default("smooth"),
  ends: z.tuple([z.literal("cut"), z.literal("cut")]).default(["cut", "cut"]),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  if (
    props.innerDiameter >= props.outerDiameter ||
    props.innerDiameter / 2 <= 0 ||
    (props.outerDiameter - props.innerDiameter) / 2 <= 0
  )
    context.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Hose ID must be smaller than OD to leave a positive wall",
    })
}

/** Straight undeformed hose; constant circular bore and a smooth outer wall. */
export const flexibleHoseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)

export const flexibleHoseModelDefinitionSchema = z
  .object({ fn: z.literal("flexiblehose"), ...shape })
  .strict()
  .superRefine(validate)

export type FlexibleHoseModelPropsInput = z.input<
  typeof flexibleHoseModelPropsSchema
>
export type FlexibleHoseModelProps = z.output<
  typeof flexibleHoseModelPropsSchema
>
export type FlexibleHoseModelDefinition = z.output<
  typeof flexibleHoseModelDefinitionSchema
>

export function getFlexibleHoseDimensions(input: FlexibleHoseModelPropsInput) {
  const props = flexibleHoseModelPropsSchema.parse(input)
  return {
    innerRadius: props.innerDiameter / 2,
    outerRadius: props.outerDiameter / 2,
    wallThickness: (props.outerDiameter - props.innerDiameter) / 2,
    startZ: 0,
    endZ: props.length,
  }
}
