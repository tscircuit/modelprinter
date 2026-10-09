import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"
const positiveLength = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^(?:\d+(?:\.\d+)?|\.\d+)(?:mm|cm|m|in|inch)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value > 0, "Length must be positive")
export const heatSetInsertCoarsePitches = {
  M3: 0.5,
  M4: 0.7,
  M5: 0.8,
  M6: 1,
} as const
export const heatSetInsertMetricSizeSchema = z.enum(["M3", "M4", "M5", "M6"])
const shape = {
  metricSize: heatSetInsertMetricSizeSchema,
  outerDiameter: positiveLength,
  length: positiveLength,
  knurlDepth: positiveLength,
  knurlPitch: positiveLength,
  knurlTeeth: z.number().int().min(3).max(96),
  diamondKnurl: z.literal(true).default(true),
  leftHand: z.boolean().default(false),
  showThreads: z.boolean().default(true),
  diameter: positiveLength.optional(),
  threadPitch: positiveLength.optional(),
  threadMinorDiameter: positiveLength.optional(),
  threadPitchDiameter: positiveLength.optional(),
  rootOuterDiameter: positiveLength.optional(),
}
type Unresolved = z.output<z.ZodObject<typeof shape>>
function dimensions(p: Unresolved) {
  const diameter = Number(p.metricSize.slice(1)),
    threadPitch = heatSetInsertCoarsePitches[p.metricSize]
  const H = (Math.sqrt(3) * threadPitch) / 2
  return {
    diameter,
    threadPitch,
    threadMinorDiameter: diameter - (5 * H) / 4,
    threadPitchDiameter: diameter - (3 * H) / 4,
    rootOuterDiameter: p.outerDiameter - 2 * p.knurlDepth,
  }
}
function validate(p: Unresolved, context: z.RefinementCtx) {
  const d = dimensions(p)
  for (const key of Object.keys(d) as (keyof typeof d)[])
    if (p[key] !== undefined && Math.abs(p[key]! - d[key]) > 1e-9)
      context.addIssue({
        code: "custom",
        path: [key],
        message: `Dimension ${key} conflicts with the metric size or knurl envelope`,
      })
  if (d.rootOuterDiameter - d.diameter <= 1e-6)
    context.addIssue({
      code: "custom",
      path: ["knurlDepth"],
      message:
        "Knurl roots must leave more than 0.000001 mm diametral material outside the thread major diameter",
    })
  if (p.length / Math.min(p.knurlPitch, d.threadPitch) > 1000)
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Insert exceeds the 1000-repeat contract limit",
    })
}
export const heatSetInsertModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform((p) => ({ ...p, ...dimensions(p) }))
export const heatSetInsertModelDefinitionSchema = z
  .object({ fn: z.literal("heatsetinsert"), ...shape })
  .strict()
  .superRefine(validate)
  .transform((p) => ({ ...p, ...dimensions(p) }))
export type HeatSetInsertMetricSize = z.infer<
  typeof heatSetInsertMetricSizeSchema
>
export type HeatSetInsertModelPropsInput = z.input<
  typeof heatSetInsertModelPropsSchema
>
export type HeatSetInsertModelProps = z.output<
  typeof heatSetInsertModelPropsSchema
>
export type HeatSetInsertModelDefinition = z.output<
  typeof heatSetInsertModelDefinitionSchema
>
