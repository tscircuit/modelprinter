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
  panelDiameter: positive.default(22),
  headDiameter: positive.default(40),
  bodyLength: positive.default(45),
  headHeight: positive.default(18),
  collarDiameter: positive.default(30),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.collarDiameter <= p.panelDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible emergencystopswitch dimensions: 1",
    })
  if (p.headDiameter <= p.collarDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible emergencystopswitch dimensions: 2",
    })
  if (p.headHeight >= p.bodyLength)
    context.addIssue({
      code: "custom",
      message: "Incompatible emergencystopswitch dimensions: 3",
    })
}
export const emergencyStopSwitchModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const emergencyStopSwitchModelDefinitionSchema = z
  .object({ fn: z.literal("emergencystopswitch"), ...shape })
  .strict()
  .superRefine(validate)
export type EmergencyStopSwitchModelPropsInput = z.input<
  typeof emergencyStopSwitchModelPropsSchema
>
export type EmergencyStopSwitchModelProps = z.output<
  typeof emergencyStopSwitchModelPropsSchema
>
export type EmergencyStopSwitchModelDefinition = z.output<
  typeof emergencyStopSwitchModelDefinitionSchema
>
/** Mushroom-head emergency stop operator with a panel collar, tapered head, rear contact block and terminal tabs. This is a mechanical placement model and does not assert contact configuration, latching performance or safety certification. All normalized lengths are millimeters. */
export function getEmergencyStopSwitchDimensions(
  input: EmergencyStopSwitchModelPropsInput = {},
) {
  const p = emergencyStopSwitchModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.headDiameter,
      p.headDiameter,
      p.bodyLength + 4 + p.headHeight + 6,
    ] as [number, number, number],
  }
}
