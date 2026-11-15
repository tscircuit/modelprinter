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
const angle = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:deg)?$/i)
      .transform((value) => Number(value.replace(/deg$/i, ""))),
  ])
  .refine(Number.isFinite)
const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  grooveAngle: angle,
  grooveDepth: positiveLength,
  mountGrooveWidth: positiveLength,
  mountGrooveDepth: positiveLength,
  mountGrooveZ: positiveLength,
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.grooveAngle <= 0 || p.grooveAngle >= 180)
    context.addIssue({
      code: "custom",
      message: "Invalid vblock dimensions: constraint 1",
    })
  if (p.grooveDepth >= p.height)
    context.addIssue({
      code: "custom",
      message: "Invalid vblock dimensions: constraint 2",
    })
  if (
    2 * p.grooveDepth * Math.tan((p.grooveAngle * Math.PI) / 360) >=
    p.width * (1 - 1e-10)
  )
    context.addIssue({
      code: "custom",
      message: "Invalid vblock dimensions: constraint 3",
    })
  if (2 * p.mountGrooveDepth >= p.width)
    context.addIssue({
      code: "custom",
      message: "Invalid vblock dimensions: constraint 4",
    })
  if (p.mountGrooveZ - p.mountGrooveWidth / 2 <= 0)
    context.addIssue({
      code: "custom",
      message: "Invalid vblock dimensions: constraint 5",
    })
  if (p.mountGrooveZ + p.mountGrooveWidth / 2 >= p.height - p.grooveDepth)
    context.addIssue({
      code: "custom",
      message: "Invalid vblock dimensions: constraint 6",
    })
}
export const vBlockModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const vBlockModelDefinitionSchema = z
  .object({ fn: z.literal("vblock"), ...shape })
  .strict()
  .superRefine(validate)
export type VBlockModelPropsInput = z.input<typeof vBlockModelPropsSchema>
export type VBlockModelProps = z.output<typeof vBlockModelPropsSchema>
export type VBlockModelDefinition = z.output<typeof vBlockModelDefinitionSchema>

/** Inspection block centered on XY, bottom Z=0. The centered V runs along X; vangle is its included angle. Both Y side faces have full-length rectangular clamp grooves centered at mountz. All normalized lengths are millimeters. */
export function getVBlockDimensions(input: VBlockModelPropsInput) {
  const p = vBlockModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.length, p.width, p.height] as [number, number, number],
    bottomZ: 0,
    topZ: p.height,
  }
}
