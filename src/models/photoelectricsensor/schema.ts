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
  width: positive.default(20),
  depth: positive.default(35),
  height: positive.default(55),
  lensDiameter: positive.default(12),
  cableDiameter: positive.default(5),
  mountHoleDiameter: positive.default(4),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.lensDiameter >= p.width)
    context.addIssue({
      code: "custom",
      message: "Incompatible photoelectricsensor dimensions: 1",
    })
  if (p.lensDiameter >= p.height * 0.3)
    context.addIssue({
      code: "custom",
      message: "Incompatible photoelectricsensor dimensions: 2",
    })
  if (p.cableDiameter >= p.width / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible photoelectricsensor dimensions: 3",
    })
  if (p.mountHoleDiameter >= Math.min(p.width, p.depth) / 3)
    context.addIssue({
      code: "custom",
      message: "Incompatible photoelectricsensor dimensions: 4",
    })
}
export const photoelectricSensorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const photoelectricSensorModelDefinitionSchema = z
  .object({ fn: z.literal("photoelectricsensor"), ...shape })
  .strict()
  .superRefine(validate)
export type PhotoelectricSensorModelPropsInput = z.input<
  typeof photoelectricSensorModelPropsSchema
>
export type PhotoelectricSensorModelProps = z.output<
  typeof photoelectricSensorModelPropsSchema
>
export type PhotoelectricSensorModelDefinition = z.output<
  typeof photoelectricSensorModelDefinitionSchema
>
/** Rectangular photoelectric sensor with two projecting optical lenses facing -Y, a top status indicator, cable tail and two transverse mounting holes. Optical axes are nominal and no sensing range is implied. All normalized lengths are millimeters. */
export function getPhotoelectricSensorDimensions(
  input: PhotoelectricSensorModelPropsInput = {},
) {
  const p = photoelectricSensorModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.depth + 2.5, p.height + 11] as [number, number, number],
  }
}
