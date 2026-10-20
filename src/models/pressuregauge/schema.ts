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
  diameter: positive.default(60),
  depth: positive.default(22),
  stemDiameter: positive.default(10),
  stemLength: positive.default(15),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.stemDiameter >= p.diameter / 3)
    context.addIssue({
      code: "custom",
      message: "Incompatible pressuregauge dimensions: 1",
    })
  if (p.depth >= p.diameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible pressuregauge dimensions: 2",
    })
}
export const pressureGaugeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pressureGaugeModelDefinitionSchema = z
  .object({ fn: z.literal("pressuregauge"), ...shape })
  .strict()
  .superRefine(validate)
export type PressureGaugeModelPropsInput = z.input<
  typeof pressureGaugeModelPropsSchema
>
export type PressureGaugeModelProps = z.output<
  typeof pressureGaugeModelPropsSchema
>
export type PressureGaugeModelDefinition = z.output<
  typeof pressureGaugeModelDefinitionSchema
>
/** Round pressure gauge facing -Y with a recessed dial, eleven major tick marks and a fixed nominal needle. The bottom stem is bored. Tick marks are decorative and intentionally have no numbers or calibration. All normalized lengths are millimeters. */
export function getPressureGaugeDimensions(
  input: PressureGaugeModelPropsInput = {},
) {
  const p = pressureGaugeModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.diameter, p.depth + 1.5, p.stemLength + p.diameter] as [
      number,
      number,
      number,
    ],
  }
}
