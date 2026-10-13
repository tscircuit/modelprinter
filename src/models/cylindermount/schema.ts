import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positive = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegative = industrialLengthSchema.refine(
  (value) => value >= 0,
  "Length must be nonnegative",
)
const shape = {
  width: positive.default(50),
  depth: positive.default(25),
  height: positive.default(45),
  thickness: positive.default(5),
  boreDiameter: positive.default(20),
  holeDiameter: positive.default(5),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (2 * p.thickness >= Math.min(p.width, p.depth, p.height))
    context.addIssue({
      code: "custom",
      message: "Incompatible cylindermount dimensions: 1",
    })
  if (
    p.boreDiameter + 2 * p.thickness >= Math.min(p.width, p.height) ||
    p.boreDiameter >= p.height * 0.8
  )
    context.addIssue({
      code: "custom",
      message: "Incompatible cylindermount dimensions: 2",
    })
  if (p.holeDiameter >= Math.min(p.thickness * 2, p.depth / 2))
    context.addIssue({
      code: "custom",
      message: "Incompatible cylindermount dimensions: 3",
    })
}
export const cylinderMountModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const cylinderMountModelDefinitionSchema = z
  .object({ fn: z.literal("cylindermount"), ...shape })
  .strict()
  .superRefine(validate)
export type CylinderMountModelPropsInput = z.input<
  typeof cylinderMountModelPropsSchema
>
export type CylinderMountModelProps = z.output<
  typeof cylinderMountModelPropsSchema
>
export type CylinderMountModelDefinition = z.output<
  typeof cylinderMountModelDefinitionSchema
>
/** L-shaped rod-end or cylinder mounting bracket with one horizontal clearance bore in the upright and two mounting holes in the foot. Width is X, depth is Y, height is Z; all bores are nominal clearance openings. All normalized lengths are millimeters. */
export function getCylinderMountDimensions(
  input: CylinderMountModelPropsInput = {},
) {
  const p = cylinderMountModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.depth, p.height] as [number, number, number],
  }
}
