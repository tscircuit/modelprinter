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
  width: positiveLength,
  height: positiveLength,
  border: positiveLength,
  thickness: positiveLength,
  cornerRadius: nonnegativeLength.default(0),
  flatFrame: z.literal(true).default(true),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>
function validate(p: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  if (2 * p.border >= Math.min(p.width, p.height))
    issue(
      "The border must leave a positive-width and positive-height opening",
      "border",
    )
  if (2 * p.cornerRadius >= Math.min(p.width, p.height))
    issue(
      "Outside corner radius must be smaller than half the short side",
      "cornerRadius",
    )
  if (
    !Number.isFinite(
      8 *
        Math.max(p.width, p.height, p.border, p.thickness, p.cornerRadius) ** 3,
    )
  )
    issue("Dimensions exceed finite derived geometry limits", "width")
}
/** Closed rounded rectangular flat seal centered on XY, with mating face Z=0 and top Z=thickness. Width and height are outside XY extents; border is the straight-side setback of the inner opening. The inner corner radius is max(0, outer corner radius minus border), giving concentric rounded corners when the border is thinner than the radius and square inner corners otherwise. */
export const rectangularGasketModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const rectangularGasketModelDefinitionSchema = z
  .object({ fn: z.literal("rectangulargasket"), ...shape })
  .strict()
  .superRefine(validate)
export type RectangularGasketModelPropsInput = z.input<
  typeof rectangularGasketModelPropsSchema
>
export type RectangularGasketModelProps = z.output<
  typeof rectangularGasketModelPropsSchema
>
export type RectangularGasketModelDefinition = z.output<
  typeof rectangularGasketModelDefinitionSchema
>

/** Normalized millimeter dimensions and installation datums. */
export function getRectangularGasketDimensions(
  input: RectangularGasketModelPropsInput,
) {
  const p = rectangularGasketModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.height, p.thickness] as [number, number, number],
    bottomZ: 0,
    topZ: p.thickness,
    innerWidth: p.width - 2 * p.border,
    innerHeight: p.height - 2 * p.border,
    innerCornerRadius: Math.max(0, p.cornerRadius - p.border),
    nominalVolume:
      (p.width * p.height -
        (4 - Math.PI) * p.cornerRadius ** 2 -
        ((p.width - 2 * p.border) * (p.height - 2 * p.border) -
          (4 - Math.PI) * Math.max(0, p.cornerRadius - p.border) ** 2)) *
      p.thickness,
  }
}
