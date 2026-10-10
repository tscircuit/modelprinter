import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(
        /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete numeric length with an optional unit",
      )
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
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  thickness: positiveLength,
  flatAnnulus: z.literal(true).default(true),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>
function validate(p: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  if (p.innerDiameter >= p.outerDiameter)
    issue(
      "The bore must leave a positive-width annular sealing face",
      "innerDiameter",
    )
  if (
    !Number.isFinite(
      8 * Math.max(p.innerDiameter, p.outerDiameter, p.thickness) ** 3,
    )
  )
    issue("Dimensions exceed finite derived geometry limits", "innerDiameter")
}
/** Flat annular seal centered on XY. The mating face is Z=0 and the opposite face is Z=thickness. Both bore and outside walls are straight, with no bevels. Custom dimensions specify nominal geometry without material or compression properties. */
export const flatGasketModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const flatGasketModelDefinitionSchema = z
  .object({ fn: z.literal("flatgasket"), ...shape })
  .strict()
  .superRefine(validate)
export type FlatGasketModelPropsInput = z.input<
  typeof flatGasketModelPropsSchema
>
export type FlatGasketModelProps = z.output<typeof flatGasketModelPropsSchema>
export type FlatGasketModelDefinition = z.output<
  typeof flatGasketModelDefinitionSchema
>

/** Normalized millimeter dimensions and installation datums. */
export function getFlatGasketDimensions(input: FlatGasketModelPropsInput) {
  const p = flatGasketModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.thickness] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.thickness,
    radialWidth: (p.outerDiameter - p.innerDiameter) / 2,
    nominalVolume:
      (Math.PI * (p.outerDiameter ** 2 - p.innerDiameter ** 2) * p.thickness) /
      4,
  }
}
