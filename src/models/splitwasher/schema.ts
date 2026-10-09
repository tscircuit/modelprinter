import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)

const shape = {
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  /** Axial thickness of the rectangular radial/vertical section. */
  thickness: positiveLength,
  /** End-to-end axial displacement, independent of section thickness. */
  rise: length.refine((value) => value >= 0, "Rise cannot be negative"),
  gapAngle: z.number().finite().gt(0).lt(360),
  rectangular: z.literal(true).default(true),
  leftHanded: z.boolean().default(false),
}

type Resolved = z.output<z.ZodObject<typeof shape>>
function validate(p: Resolved, context: z.RefinementCtx) {
  if (p.innerDiameter >= p.outerDiameter)
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outside diameter must exceed the bore",
    })
  if (
    !Number.isFinite(p.thickness + p.rise) ||
    !Number.isFinite(p.outerDiameter ** 2 * p.thickness)
  )
    context.addIssue({
      code: "custom",
      message: "The washer envelope and volume must remain finite",
    })
}

export const splitWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const splitWasherModelDefinitionSchema = z
  .object({ fn: z.literal("splitwasher"), ...shape })
  .strict()
  .superRefine(validate)
export type SplitWasherModelPropsInput = z.input<
  typeof splitWasherModelPropsSchema
>
export type SplitWasherModelProps = z.output<typeof splitWasherModelPropsSchema>
export type SplitWasherModelDefinition = z.output<
  typeof splitWasherModelDefinitionSchema
>

export function getSplitWasherDimensions(input: SplitWasherModelPropsInput) {
  const p = splitWasherModelPropsSchema.parse(input)
  return {
    radialWidth: (p.outerDiameter - p.innerDiameter) / 2,
    totalHeight: p.thickness + p.rise,
    sweepAngle: 360 - p.gapAngle,
    volume:
      ((Math.PI / 4) *
        (p.outerDiameter ** 2 - p.innerDiameter ** 2) *
        p.thickness *
        (360 - p.gapAngle)) /
      360,
  }
}
