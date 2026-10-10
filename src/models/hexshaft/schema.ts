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
  acrossFlats: positiveLength,
  length: positiveLength,
  endChamfer: nonnegativeLength.default(0),
  regularHex: z.literal(true).default(true),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  const span = Math.max(2 * (p.acrossFlats / Math.sqrt(3)), p.length)
  if (!Number.isFinite(span ** 3))
    context.addIssue({
      code: "custom",
      message: "Dimensions must have a finite bounding volume",
    })
  if (2 * p.endChamfer >= p.acrossFlats)
    context.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message: "End chamfer must leave a positive hexagonal end face",
    })
  if (2 * p.endChamfer >= p.length)
    context.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message: "End chamfers must leave a positive straight shaft length",
    })
}
export const hexShaftModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const hexShaftModelDefinitionSchema = z
  .object({ fn: z.literal("hexshaft"), ...shape })
  .strict()
  .superRefine(validate)
export type HexShaftModelPropsInput = z.input<typeof hexShaftModelPropsSchema>
export type HexShaftModelProps = z.output<typeof hexShaftModelPropsSchema>
export type HexShaftModelDefinition = z.output<
  typeof hexShaftModelDefinitionSchema
>

/** A regular hexagonal drive shaft with 45-degree chamfers on all six facets at each end. Length runs along the centered +Z axis from Z=0. acrossFlats measures the distance between the flats X=+-acrossFlats/2; vertices lie on the +/-Y axis. endChamfer offsets each flat inward by that amount over the same axial distance. _regularhex is the value-free profile flag; _profile(regularhex) is the roadmap alias. All normalized dimensions are millimeters. */
export function getHexShaftDimensions(input: HexShaftModelPropsInput) {
  const p = hexShaftModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.acrossFlats, (2 * p.acrossFlats) / Math.sqrt(3), p.length] as [
      number,
      number,
      number,
    ],
    min: [-p.acrossFlats / 2, -p.acrossFlats / Math.sqrt(3), 0] as [
      number,
      number,
      number,
    ],
    max: [p.acrossFlats / 2, p.acrossFlats / Math.sqrt(3), p.length] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.length,
    circumradius: p.acrossFlats / Math.sqrt(3),
    endAcrossFlats: p.acrossFlats - 2 * p.endChamfer,
  }
}
