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
const nonnegativeLength = length.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)
const shape = {
  length: positiveLength,
  width: positiveLength,
  thickness: positiveLength,
  holeDiameter: positiveLength,
  pitchX: positiveLength,
  pitchY: positiveLength,
  edgeX: positiveLength,
  edgeY: positiveLength,
  stagger: nonnegativeLength.default(0),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.holeDiameter >= Math.min(p.pitchX, p.pitchY))
    context.addIssue({
      code: "custom",
      message: "Invalid perforatedsheet dimensions: constraint 1",
    })
  if (2 * p.edgeX > p.length || 2 * p.edgeY > p.width)
    context.addIssue({
      code: "custom",
      message: "Invalid perforatedsheet dimensions: constraint 2",
    })
  if (Math.min(p.edgeX, p.edgeY) <= p.holeDiameter / 2)
    context.addIssue({
      code: "custom",
      message: "Invalid perforatedsheet dimensions: constraint 3",
    })
  if (p.stagger >= p.pitchX)
    context.addIssue({
      code: "custom",
      message: "Invalid perforatedsheet dimensions: constraint 4",
    })
  if (
    Math.floor((p.length - 2 * p.edgeX) / p.pitchX + 1) *
      Math.floor((p.width - 2 * p.edgeY) / p.pitchY + 1) >
    2500
  )
    context.addIssue({
      code: "custom",
      message: "Invalid perforatedsheet dimensions: constraint 5",
    })
}
export const perforatedSheetModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const perforatedSheetModelDefinitionSchema = z
  .object({ fn: z.literal("perforatedsheet"), ...shape })
  .strict()
  .superRefine(validate)
export type PerforatedSheetModelPropsInput = z.input<
  typeof perforatedSheetModelPropsSchema
>
export type PerforatedSheetModelProps = z.output<
  typeof perforatedSheetModelPropsSchema
>
export type PerforatedSheetModelDefinition = z.output<
  typeof perforatedSheetModelDefinitionSchema
>

/** Flat XY panel, bottom Z=0. Hole centers begin edgeX/edgeY from the negative edges, continue on stated pitches while respecting both opposite margins. Odd rows shift +stagger; incomplete edge holes are omitted. At most 2500 holes. All normalized lengths are millimeters. */
export function getPerforatedSheetDimensions(
  input: PerforatedSheetModelPropsInput,
) {
  const p = perforatedSheetModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.length, p.width, p.thickness] as [number, number, number],
    bottomZ: 0,
    topZ: p.thickness,
  }
}
