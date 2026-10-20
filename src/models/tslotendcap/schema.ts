import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

// Consume the complete decimal length rather than accepting partial numbers.
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
  width: positiveLength,
  height: positiveLength,
  thickness: positiveLength,
  cornerRadius: nonnegativeLength.default(0),
  pinDiameter: positiveLength,
  pinLength: positiveLength,
  pinCount: z.literal(1).default(1),
  centered: z.literal(true).default(true),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  const span = Math.max(p.width, p.height, p.thickness + p.pinLength)
  if (!Number.isFinite(span ** 3))
    context.addIssue({
      code: "custom",
      message: "Dimensions must have a finite bounding volume",
    })
  if (2 * p.cornerRadius >= Math.min(p.width, p.height))
    context.addIssue({
      code: "custom",
      path: ["cornerRadius"],
      message: "Corner radius must leave straight sections on all four edges",
    })
  if (p.pinDiameter >= Math.min(p.width, p.height))
    context.addIssue({
      code: "custom",
      path: ["pinDiameter"],
      message:
        "Centered friction pin must fit strictly inside the cover outline",
    })
}
export const tSlotEndCapModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const tSlotEndCapModelDefinitionSchema = z
  .object({ fn: z.literal("tslotendcap"), ...shape })
  .strict()
  .superRefine(validate)
export type TSlotEndCapModelPropsInput = z.input<
  typeof tSlotEndCapModelPropsSchema
>
export type TSlotEndCapModelProps = z.output<typeof tSlotEndCapModelPropsSchema>
export type TSlotEndCapModelDefinition = z.output<
  typeof tSlotEndCapModelDefinitionSchema
>

/** A rounded rectangular end cover with one central cylindrical friction pin. The cover underside and profile end mate at Z=0; the plate extends upward to Z=thickness and the pin inserts downward to Z=-pinLength. pinDiameter is the actual interference-fit envelope, not the target bore diameter. This custom model supports exactly one centered pin. All normalized dimensions are millimeters. */
export function getTSlotEndCapDimensions(input: TSlotEndCapModelPropsInput) {
  const p = tSlotEndCapModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.height, p.thickness + p.pinLength] as [
      number,
      number,
      number,
    ],
    min: [-p.width / 2, -p.height / 2, -p.pinLength] as [
      number,
      number,
      number,
    ],
    max: [p.width / 2, p.height / 2, p.thickness] as [number, number, number],
    bottomZ: -p.pinLength,
    topZ: p.thickness,
    attachmentZ: 0,
    pinCenter: [0, 0] as [number, number],
    insertedLength: p.pinLength,
  }
}
