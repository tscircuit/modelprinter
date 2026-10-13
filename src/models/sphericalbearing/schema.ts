import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(30),
  boreDiameter: positiveLength.default(12),
  width: positiveLength.default(14),
  ballDiameter: positiveLength.default(22),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.outerDiameter <= p.ballDiameter)
    context.addIssue({
      code: "custom",
      message: "Outer race must exceed the spherical inner diameter",
    })
  if (p.ballDiameter <= p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Spherical inner diameter must exceed the shaft bore",
    })
  if (p.width >= p.ballDiameter)
    context.addIssue({
      code: "custom",
      message: "Bearing width must be less than the sphere diameter",
    })
  if (p.width <= p.boreDiameter * 0.3)
    context.addIssue({
      code: "custom",
      message: "Width must leave a useful spherical inner ring",
    })
  if (Math.sqrt(p.ballDiameter ** 2 - p.width ** 2) <= p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "The sphere section at both end faces must surround the bore",
    })
}
export const sphericalBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const sphericalBearingModelDefinitionSchema = z
  .object({ fn: z.literal("sphericalbearing"), ...shape })
  .strict()
  .superRefine(validate)
export type SphericalBearingModelPropsInput = z.input<
  typeof sphericalBearingModelPropsSchema
>
export type SphericalBearingModelProps = z.output<
  typeof sphericalBearingModelPropsSchema
>
export type SphericalBearingModelDefinition = z.output<
  typeof sphericalBearingModelDefinitionSchema
>
/** Spherical plain bearing assembly: cylindrical outer race with spherical pocket and truncated spherical inner ring with an axial bore. Axis Z, bottom Z=0. Outer race is recessed to 72% of inner-ring width to expose the spherical shoulders. Small nominal spherical clearance; articulation and tolerances are not modeled. All lengths are normalized to millimeters. */
export function getSphericalBearingDimensions(
  input: SphericalBearingModelPropsInput = {},
) {
  const p = sphericalBearingModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.width] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.width,
  }
}
