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
  outerDiameter: positiveLength,
  innerDiameter: positiveLength,
  length: positiveLength,
  endChamfer: nonnegativeLength.default(0),
  roundTube: z.literal(true).default(true),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  const span = Math.max(p.outerDiameter, p.length)
  if (!Number.isFinite(span ** 3))
    context.addIssue({
      code: "custom",
      message: "Dimensions must have a finite bounding volume",
    })
  if (p.innerDiameter >= p.outerDiameter)
    context.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Shaft bore must be smaller than the outer diameter",
    })
  if (2 * p.endChamfer >= (p.outerDiameter - p.innerDiameter) / 2)
    context.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message:
        "Inner and outer end chamfers must leave a positive annular end land",
    })
  if (2 * p.endChamfer >= p.length)
    context.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message: "End chamfers must leave a positive straight shaft length",
    })
}
export const hollowShaftModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const hollowShaftModelDefinitionSchema = z
  .object({ fn: z.literal("hollowshaft"), ...shape })
  .strict()
  .superRefine(validate)
export type HollowShaftModelPropsInput = z.input<
  typeof hollowShaftModelPropsSchema
>
export type HollowShaftModelProps = z.output<typeof hollowShaftModelPropsSchema>
export type HollowShaftModelDefinition = z.output<
  typeof hollowShaftModelDefinitionSchema
>

/** A concentric round tubular drive shaft with a through bore and 45-degree chamfers on both the inner and outer edges of both ends. The centered shaft axis is +Z and bottom face Z=0. endChamfer is the radial and axial chamfer size; validation preserves a positive annular end land. _roundtube is the value-free style flag; _style(roundtube) is accepted as the roadmap alias. All normalized dimensions are millimeters. */
export function getHollowShaftDimensions(input: HollowShaftModelPropsInput) {
  const p = hollowShaftModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.length] as [
      number,
      number,
      number,
    ],
    min: [-p.outerDiameter / 2, -p.outerDiameter / 2, 0] as [
      number,
      number,
      number,
    ],
    max: [p.outerDiameter / 2, p.outerDiameter / 2, p.length] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.length,
    wallThickness: (p.outerDiameter - p.innerDiameter) / 2,
    endOuterDiameter: p.outerDiameter - 2 * p.endChamfer,
    endBoreDiameter: p.innerDiameter + 2 * p.endChamfer,
  }
}
