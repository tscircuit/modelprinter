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
  length: positiveLength,
  width: positiveLength,
  thickness: positiveLength,
  stemWidth: positiveLength,
  stemHeight: positiveLength,
  barbWidth: positiveLength,
  barbHeight: positiveLength.default(0.5),
  tee: z.literal(true).default(true),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  const span = Math.max(p.width, p.length, p.thickness + p.stemHeight)
  if (!Number.isFinite(span ** 3))
    context.addIssue({
      code: "custom",
      message: "Dimensions must have a finite bounding volume",
    })
  if (p.stemWidth >= p.barbWidth)
    context.addIssue({
      code: "custom",
      path: ["barbWidth"],
      message: "Retention bead must be wider than the stem",
    })
  if (p.barbWidth >= p.width)
    context.addIssue({
      code: "custom",
      path: ["width"],
      message: "Cover plate must extend beyond the retention bead",
    })
  if (p.barbHeight >= p.stemHeight)
    context.addIssue({
      code: "custom",
      path: ["barbHeight"],
      message:
        "Retention bead height must leave a positive narrow stem section",
    })
}
export const tSlotCoverStripModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const tSlotCoverStripModelDefinitionSchema = z
  .object({ fn: z.literal("tslotcoverstrip"), ...shape })
  .strict()
  .superRefine(validate)
export type TSlotCoverStripModelPropsInput = z.input<
  typeof tSlotCoverStripModelPropsSchema
>
export type TSlotCoverStripModelProps = z.output<
  typeof tSlotCoverStripModelPropsSchema
>
export type TSlotCoverStripModelDefinition = z.output<
  typeof tSlotCoverStripModelDefinitionSchema
>

/** A continuous T-section groove cover: a broad top strip, narrow insertion stem, and wider rectangular retention bead at the stem tip. Length runs along +Z from Z=0. The cover underside mates at Y=0, its top is Y=thickness, and its inserted tip is Y=-stemHeight. barbHeight defaults to 0.5mm and is included in stemHeight. _tee is the value-free profile flag; _profile(tee) is accepted as the roadmap alias. All normalized dimensions are millimeters. */
export function getTSlotCoverStripDimensions(
  input: TSlotCoverStripModelPropsInput,
) {
  const p = tSlotCoverStripModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.thickness + p.stemHeight, p.length] as [
      number,
      number,
      number,
    ],
    min: [-p.width / 2, -p.stemHeight, 0] as [number, number, number],
    max: [p.width / 2, p.thickness, p.length] as [number, number, number],
    bottomZ: 0,
    topZ: p.length,
    attachmentY: 0,
    insertedDepth: p.stemHeight,
    beadTopY: -p.stemHeight + p.barbHeight,
  }
}
