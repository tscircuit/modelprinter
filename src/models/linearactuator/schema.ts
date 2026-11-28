import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateLinearActuatorProps } from "./validate"

const shape = {
  bodyOuterDiameter: positive.default(40),
  retractedLength: positive.default(250),
  stroke: positive.default(100),
  rodOuterDiameter: positive.default(20),
  eyeEye: z.literal(true).default(true),
  eyeBoreDiameter: positive.default(8),
  electricScrew: z.literal(true).default(true),
}

export const linearActuatorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLinearActuatorProps)

export const linearActuatorModelDefinitionSchema = z
  .object({ fn: z.literal("linearactuator"), ...shape })
  .strict()
  .superRefine(validateLinearActuatorProps)

export type LinearActuatorModelPropsInput = z.input<
  typeof linearActuatorModelPropsSchema
>
export type LinearActuatorModelProps = z.output<
  typeof linearActuatorModelPropsSchema
>
export type LinearActuatorModelDefinition = z.output<
  typeof linearActuatorModelDefinitionSchema
>
