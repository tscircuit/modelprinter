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
  width: positive.default(32),
  depth: positive.default(28),
  height: positive.default(38),
  portDiameter: positive.default(8),
  portLength: positive.default(10),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.portDiameter >= Math.min(p.width, p.depth) / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible pressureswitch dimensions: 1",
    })
  if (p.portLength >= p.height)
    context.addIssue({
      code: "custom",
      message: "Incompatible pressureswitch dimensions: 2",
    })
}
export const pressureSwitchModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pressureSwitchModelDefinitionSchema = z
  .object({ fn: z.literal("pressureswitch"), ...shape })
  .strict()
  .superRefine(validate)
export type PressureSwitchModelPropsInput = z.input<
  typeof pressureSwitchModelPropsSchema
>
export type PressureSwitchModelProps = z.output<
  typeof pressureSwitchModelPropsSchema
>
export type PressureSwitchModelDefinition = z.output<
  typeof pressureSwitchModelDefinitionSchema
>
/** Mechanical pressure switch enclosure with a bottom pressure port, top adjustment screw and bored cable gland on +X. The switch mechanism and pressure calibration are omitted. All normalized lengths are millimeters. */
export function getPressureSwitchDimensions(
  input: PressureSwitchModelPropsInput = {},
) {
  const p = pressureSwitchModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width + 9, p.depth, p.portLength + p.height + 6] as [
      number,
      number,
      number,
    ],
  }
}
