import { z } from "zod"
import { positiveLength } from "../../pneumatic-model-params"
const coordinate = z
  .union([
    z.number().finite(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/)
      .transform(Number),
  ])
  .pipe(z.number().finite())
const pathSchema = z.preprocess(
  (input) =>
    typeof input === "string"
      ? input.split("|").map((point) => point.split(","))
      : input,
  z.array(z.tuple([coordinate, coordinate, coordinate])).min(2),
)
const shape = {
  outerDiameter: positiveLength,
  innerDiameter: positiveLength,
  length: positiveLength.optional(),
  path: pathSchema.optional(),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(p.innerDiameter < p.outerDiameter)) {
    context.addIssue({
      code: "custom",
      message: "Tubing ID must be smaller than OD",
    })
  }
  if (!((p.length === undefined) !== (p.path === undefined))) {
    context.addIssue({
      code: "custom",
      message: "Specify either a straight length or a centerline path",
    })
  }
  if (
    !!p.path?.some(
      (point, i, path) =>
        i > 0 && point.every((v, axis) => v === path[i - 1]![axis]),
    )
  ) {
    context.addIssue({
      code: "custom",
      message: "Consecutive centerline points must be distinct",
    })
  }
}

export const airTubingModelPropsSchema = propsSchema.superRefine(validate)
export const airTubingModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("airtubing") })
  .superRefine(validate)
export type AirTubingModelPropsInput = z.input<typeof airTubingModelPropsSchema>
export type AirTubingModelProps = z.output<typeof airTubingModelPropsSchema>
export type AirTubingModelDefinition = z.output<
  typeof airTubingModelDefinitionSchema
>
