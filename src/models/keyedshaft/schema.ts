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
  diameter: positiveLength,
  length: positiveLength,
  keyWidth: positiveLength,
  keyDepth: positiveLength,
  keyLength: positiveLength,
  endChamfer: nonnegativeLength.default(0),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  const span = Math.max(p.diameter, p.length)
  if (!Number.isFinite(span ** 3))
    context.addIssue({
      code: "custom",
      message: "Dimensions must have a finite bounding volume",
    })
  if (p.endChamfer >= p.diameter / 2)
    context.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message: "End chamfer must be smaller than the shaft radius",
    })
  if (2 * p.endChamfer >= p.length)
    context.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message: "End chamfers must leave a positive straight shaft length",
    })
  if (p.keyWidth >= p.diameter)
    context.addIssue({
      code: "custom",
      path: ["keyWidth"],
      message: "Keyway width must be smaller than the shaft diameter",
    })
  if (p.keyDepth >= p.diameter / 2)
    context.addIssue({
      code: "custom",
      path: ["keyDepth"],
      message: "Keyway floor must remain above the shaft axis",
    })
  if (
    (p.keyWidth / 2) ** 2 + (p.diameter / 2 - p.keyDepth) ** 2 >=
    (p.diameter / 2) ** 2
  )
    context.addIssue({
      code: "custom",
      path: ["keyDepth"],
      message: "Keyway floor must intersect the shaft across its entire width",
    })
  if (p.keyLength > p.length - 2 * p.endChamfer)
    context.addIssue({
      code: "custom",
      path: ["keyLength"],
      message: "Centered keyway must fit between the end chamfers",
    })
}
export const keyedShaftModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const keyedShaftModelDefinitionSchema = z
  .object({ fn: z.literal("keyedshaft"), ...shape })
  .strict()
  .superRefine(validate)
export type KeyedShaftModelPropsInput = z.input<
  typeof keyedShaftModelPropsSchema
>
export type KeyedShaftModelProps = z.output<typeof keyedShaftModelPropsSchema>
export type KeyedShaftModelDefinition = z.output<
  typeof keyedShaftModelDefinitionSchema
>

/** A round drive shaft with a rectangular longitudinal keyway centered along its length and 45-degree chamfers at both outer end edges. The shaft axis is +Z, its bottom face is Z=0, and the keyway opens toward +Y. keyDepth measures radially inward from the nominal outermost +Y surface; keyLength excludes the solid end sections. All normalized dimensions are millimeters. */
export function getKeyedShaftDimensions(input: KeyedShaftModelPropsInput) {
  const p = keyedShaftModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.diameter, p.diameter, p.length] as [number, number, number],
    min: [-p.diameter / 2, -p.diameter / 2, 0] as [number, number, number],
    max: [p.diameter / 2, p.diameter / 2, p.length] as [number, number, number],
    bottomZ: 0,
    topZ: p.length,
    keywayBottomY: p.diameter / 2 - p.keyDepth,
    keywayStartZ: (p.length - p.keyLength) / 2,
    keywayEndZ: (p.length + p.keyLength) / 2,
    endDiameter: p.diameter - 2 * p.endChamfer,
  }
}
