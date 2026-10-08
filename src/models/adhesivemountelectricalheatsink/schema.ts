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
const positive = length.refine((value) => value > 0, "Length must be positive")

const shape = {
  width: positive.default(20),
  length: positive.default(20),
  /** Total height, including the base. Adhesive bonding face is Z=0; adhesive thickness is excluded. */
  height: positive.default(10),
  baseThickness: positive.default(2),
  finThickness: positive.default(1),
  finCount: z.number().int().min(2).max(128).default(6),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, context: z.RefinementCtx) {
  if (p.height <= p.baseThickness)
    context.addIssue({
      code: "custom",
      path: ["height"],
      message: "Height must exceed base thickness",
    })
  if (p.finCount * p.finThickness >= p.width)
    context.addIssue({
      code: "custom",
      path: ["finThickness"],
      message: "Fins must leave positive gaps across the width",
    })
  if (!Number.isFinite(p.width * p.length * p.height))
    context.addIssue({
      code: "custom",
      message: "Envelope volume must be finite",
    })
}
/** Flat-base heatsink body for adhesive mounting to electronics; adhesive is separate. */
export const adhesiveMountElectricalHeatsinkModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const adhesiveMountElectricalHeatsinkModelDefinitionSchema = z
  .object({ fn: z.literal("adhesivemountelectricalheatsink"), ...shape })
  .strict()
  .superRefine(validate)
export type AdhesiveMountElectricalHeatsinkModelPropsInput = z.input<
  typeof adhesiveMountElectricalHeatsinkModelPropsSchema
>
export type AdhesiveMountElectricalHeatsinkModelProps = z.output<
  typeof adhesiveMountElectricalHeatsinkModelPropsSchema
>
export type AdhesiveMountElectricalHeatsinkModelDefinition = z.output<
  typeof adhesiveMountElectricalHeatsinkModelDefinitionSchema
>
export function getAdhesiveMountElectricalHeatsinkDimensions(
  input: AdhesiveMountElectricalHeatsinkModelPropsInput,
) {
  const p = adhesiveMountElectricalHeatsinkModelPropsSchema.parse(input)
  const finPitch = (p.width - p.finThickness) / (p.finCount - 1)
  const finHeight = p.height - p.baseThickness
  return {
    width: p.width,
    length: p.length,
    height: p.height,
    finPitch,
    finGap: finPitch - p.finThickness,
    finHeight,
    baseBottomZ: 0,
    baseTopZ: p.baseThickness,
    volume:
      p.width * p.length * p.baseThickness +
      p.finCount * p.finThickness * p.length * finHeight,
  }
}
