import { z } from "zod"
import { positiveModelLengthSchema } from "../../model-length-schema"
const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(
        /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete numeric length with an optional unit",
      ),
  ])
  .pipe(positiveModelLengthSchema)

const shape = {
  shape: z.literal("smooth").default("smooth"),
  outerDiameter: length.default(20),
  boreDiameter: length.default(5),
  beltWidth: length.default(10),
  beltThickness: length.default(2.2),
  sideClearance: length.default(1),
  flangeHeight: length.default(3),
  flangeThickness: length.default(1),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function dimensions(p: Resolved) {
  const faceWidth = p.beltWidth + 2 * p.sideClearance
  return {
    faceWidth,
    contactRadius: p.outerDiameter / 2,
    flangeDiameter: p.outerDiameter + 2 * p.flangeHeight,
    totalWidth: faceWidth + 2 * p.flangeThickness,
    minZ: -p.flangeThickness,
    maxZ: faceWidth + p.flangeThickness,
    radialWallThickness: (p.outerDiameter - p.boreDiameter) / 2,
    flangeAboveBelt: p.flangeHeight - p.beltThickness,
  }
}
function validate(p: Resolved, c: z.RefinementCtx) {
  if (Object.values(dimensions(p)).some((n) => !Number.isFinite(n)))
    c.addIssue({
      code: "custom",
      message: "Derived idler dimensions must be finite",
    })
  if (p.boreDiameter >= p.outerDiameter)
    c.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Bore must be smaller than the smooth contact diameter",
    })
  if (p.flangeHeight <= p.beltThickness)
    c.addIssue({
      code: "custom",
      path: ["flangeHeight"],
      message: "Flanges must extend beyond the complete belt thickness",
    })
}
export const beltIdlerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const beltIdlerModelDefinitionSchema = z
  .object({ fn: z.literal("beltidler"), ...shape })
  .strict()
  .superRefine(validate)
export type BeltIdlerModelPropsInput = z.input<typeof beltIdlerModelPropsSchema>
export type BeltIdlerModelProps = z.output<typeof beltIdlerModelPropsSchema>
export type BeltIdlerModelDefinition = z.output<
  typeof beltIdlerModelDefinitionSchema
>
export function getBeltIdlerDimensions(input: BeltIdlerModelPropsInput = {}) {
  return dimensions(beltIdlerModelPropsSchema.parse(input))
}
