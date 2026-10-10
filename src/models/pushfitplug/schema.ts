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
  tubeDiameter: positiveLength,
  length: positiveLength,
  headDiameter: positiveLength,
  headThickness: positiveLength,
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.headDiameter <= p.tubeDiameter)
    context.addIssue({
      code: "custom",
      message: "Invalid pushfitplug dimensions: constraint 1",
    })
  if (p.headThickness >= p.length)
    context.addIssue({
      code: "custom",
      message: "Invalid pushfitplug dimensions: constraint 2",
    })
}
export const pushFitPlugModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pushFitPlugModelDefinitionSchema = z
  .object({ fn: z.literal("pushfitplug"), ...shape })
  .strict()
  .superRefine(validate)
export type PushFitPlugModelPropsInput = z.input<
  typeof pushFitPlugModelPropsSchema
>
export type PushFitPlugModelProps = z.output<typeof pushFitPlugModelPropsSchema>
export type PushFitPlugModelDefinition = z.output<
  typeof pushFitPlugModelDefinitionSchema
>

/** Solid round push-in tube stopper with an integral flat extraction head. Overall length includes the head. Shaft axis is +Z; insertion tip Z=0, shoulder Z=length-headThickness. No seal or pressure rating implied. All normalized lengths are millimeters. */
export function getPushFitPlugDimensions(input: PushFitPlugModelPropsInput) {
  const p = pushFitPlugModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.headDiameter, p.headDiameter, p.length] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.length,
  }
}
