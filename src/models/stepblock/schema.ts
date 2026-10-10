import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

// Strict decimal lengths prevent permissive unit conversion from hiding typos.
const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  steps: z.number().int().min(1).max(2500),
  stepRun: positiveLength,
  stepRise: positiveLength,
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (Math.abs(p.steps * p.stepRun - p.length) > 1e-8 * Math.max(1, p.length))
    context.addIssue({
      code: "custom",
      message: "Invalid stepblock dimensions: constraint 1",
    })
  if (Math.abs(p.steps * p.stepRise - p.height) > 1e-8 * Math.max(1, p.height))
    context.addIssue({
      code: "custom",
      message: "Invalid stepblock dimensions: constraint 2",
    })
}
export const stepBlockModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const stepBlockModelDefinitionSchema = z
  .object({ fn: z.literal("stepblock"), ...shape })
  .strict()
  .superRefine(validate)
export type StepBlockModelPropsInput = z.input<typeof stepBlockModelPropsSchema>
export type StepBlockModelProps = z.output<typeof stepBlockModelPropsSchema>
export type StepBlockModelDefinition = z.output<
  typeof stepBlockModelDefinitionSchema
>

/** Solid stair-step clamp support centered on XY, bottom Z=0. Staircase rises from -X toward +X. Equal runs and rises must exactly span the specified length and height. All normalized lengths are millimeters. */
export function getStepBlockDimensions(input: StepBlockModelPropsInput) {
  const p = stepBlockModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.length, p.width, p.height] as [number, number, number],
    bottomZ: 0,
    topZ: p.height,
  }
}
