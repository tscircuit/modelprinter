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
  barrelDiameter: positive.default(18),
  barrelLength: positive.default(55),
  faceThickness: positive.default(2),
  cableDiameter: positive.default(5),
  cableLength: positive.default(15),
  nutWidth: positive.default(22),
  nutThickness: positive.default(4),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.faceThickness >= p.barrelLength / 4)
    context.addIssue({
      code: "custom",
      message: "Incompatible inductiveproximitysensor dimensions: 1",
    })
  if (p.cableDiameter >= p.barrelDiameter / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible inductiveproximitysensor dimensions: 2",
    })
  if (p.nutWidth <= p.barrelDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible inductiveproximitysensor dimensions: 3",
    })
  if (2 * p.nutThickness >= p.barrelLength / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible inductiveproximitysensor dimensions: 4",
    })
}
export const inductiveProximitySensorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const inductiveProximitySensorModelDefinitionSchema = z
  .object({ fn: z.literal("inductiveproximitysensor"), ...shape })
  .strict()
  .superRefine(validate)
export type InductiveProximitySensorModelPropsInput = z.input<
  typeof inductiveProximitySensorModelPropsSchema
>
export type InductiveProximitySensorModelProps = z.output<
  typeof inductiveProximitySensorModelPropsSchema
>
export type InductiveProximitySensorModelDefinition = z.output<
  typeof inductiveProximitySensorModelDefinitionSchema
>
/** Cylindrical inductive proximity sensor with two hex mounting nuts, a distinct sensing face on +Z and short cable tail on -Z. Circumferential ribs suggest nominal barrel threading; they are not a functional helical thread. All normalized lengths are millimeters. */
export function getInductiveProximitySensorDimensions(
  input: InductiveProximitySensorModelPropsInput = {},
) {
  const p = inductiveProximitySensorModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      (2 * p.nutWidth) / Math.sqrt(3),
      p.nutWidth,
      p.barrelLength + p.faceThickness + p.cableLength,
    ] as [number, number, number],
  }
}
