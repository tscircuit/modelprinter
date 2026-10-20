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
  thickness: positiveLength,
  holeDiameter: positiveLength,
  columns: z.number().int().min(1).max(2500),
  rows: z.number().int().min(1).max(2500),
  pitch: positiveLength,
  edgeX: positiveLength,
  edgeY: positiveLength,
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.holeDiameter >= p.pitch)
    context.addIssue({
      code: "custom",
      message: "Invalid fixtureplate dimensions: constraint 1",
    })
  if (Math.min(p.edgeX, p.edgeY) <= p.holeDiameter / 2)
    context.addIssue({
      code: "custom",
      message: "Invalid fixtureplate dimensions: constraint 2",
    })
  if (p.edgeX + (p.columns - 1) * p.pitch + p.holeDiameter / 2 >= p.length)
    context.addIssue({
      code: "custom",
      message: "Invalid fixtureplate dimensions: constraint 3",
    })
  if (p.edgeY + (p.rows - 1) * p.pitch + p.holeDiameter / 2 >= p.width)
    context.addIssue({
      code: "custom",
      message: "Invalid fixtureplate dimensions: constraint 4",
    })
  if (p.columns * p.rows > 2500)
    context.addIssue({
      code: "custom",
      message: "Invalid fixtureplate dimensions: constraint 5",
    })
}
export const fixturePlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const fixturePlateModelDefinitionSchema = z
  .object({ fn: z.literal("fixtureplate"), ...shape })
  .strict()
  .superRefine(validate)
export type FixturePlateModelPropsInput = z.input<
  typeof fixturePlateModelPropsSchema
>
export type FixturePlateModelProps = z.output<
  typeof fixturePlateModelPropsSchema
>
export type FixturePlateModelDefinition = z.output<
  typeof fixturePlateModelDefinitionSchema
>

/** XY workholding plate with an explicitly located rectangular grid of plain through-holes. Counts, pitch and first-hole margins are independent; the grid must remain inside the plate. Bottom Z=0; no threads or counterbores implied. All normalized lengths are millimeters. */
export function getFixturePlateDimensions(input: FixturePlateModelPropsInput) {
  const p = fixturePlateModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.length, p.width, p.thickness] as [number, number, number],
    bottomZ: 0,
    topZ: p.thickness,
  }
}
