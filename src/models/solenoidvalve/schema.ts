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
  length: positive.default(70),
  width: positive.default(28),
  height: positive.default(25),
  coilWidth: positive.default(24),
  coilHeight: positive.default(30),
  portDiameter: positive.default(6),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.coilWidth >= p.length / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible solenoidvalve dimensions: 1",
    })
  if (p.coilWidth > p.width)
    context.addIssue({
      code: "custom",
      message: "Incompatible solenoidvalve dimensions: 2",
    })
  if (p.portDiameter >= Math.min(p.width, p.height) / 3)
    context.addIssue({
      code: "custom",
      message: "Incompatible solenoidvalve dimensions: 3",
    })
}
export const solenoidValveModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const solenoidValveModelDefinitionSchema = z
  .object({ fn: z.literal("solenoidvalve"), ...shape })
  .strict()
  .superRefine(validate)
export type SolenoidValveModelPropsInput = z.input<
  typeof solenoidValveModelPropsSchema
>
export type SolenoidValveModelProps = z.output<
  typeof solenoidValveModelPropsSchema
>
export type SolenoidValveModelDefinition = z.output<
  typeof solenoidValveModelDefinitionSchema
>
/** Generic directional air solenoid valve: long valve body, three cross ports, two mounting holes, coil and electrical connector envelope. The internal spool and port switching paths are omitted; the model is not a pneumatic schematic. All normalized lengths are millimeters. */
export function getSolenoidValveDimensions(
  input: SolenoidValveModelPropsInput = {},
) {
  const p = solenoidValveModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.length + 5, p.width, p.height + p.coilHeight + 6] as [
      number,
      number,
      number,
    ],
  }
}
