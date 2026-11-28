import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateVSlotWheelProps } from "./validate"

const shape = {
  outerDiameter: positive.default(24),
  width: positive.default(11),
  boreDiameter: positive.default(5),
  includedAngleDeg: z.number().finite().default(90),
  dualBevel: z.literal(true).default(true),
  bearingSeatDiameter: positive.default(16),
  axleBore: z.literal(true).default(true),
}

export const vSlotWheelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateVSlotWheelProps)

export const vSlotWheelModelDefinitionSchema = z
  .object({ fn: z.literal("vslotwheel"), ...shape })
  .strict()
  .superRefine(validateVSlotWheelProps)

export type VSlotWheelModelPropsInput = z.input<
  typeof vSlotWheelModelPropsSchema
>
export type VSlotWheelModelProps = z.output<typeof vSlotWheelModelPropsSchema>
export type VSlotWheelModelDefinition = z.output<
  typeof vSlotWheelModelDefinitionSchema
>
