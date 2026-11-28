import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateOmniWheelProps } from "./validate"

const shape = {
  outerDiameter: positive.default(60),
  width: positive.default(25),
  boreDiameter: positive.default(8),
  rollers: z.number().int().min(4).default(8),
  keyway: z.literal(true).default(true),
  keyWidth: positive.default(3),
  tangentialRollers: z.literal(true).default(true),
}

export const omniWheelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateOmniWheelProps)

export const omniWheelModelDefinitionSchema = z
  .object({ fn: z.literal("omniwheel"), ...shape })
  .strict()
  .superRefine(validateOmniWheelProps)

export type OmniWheelModelPropsInput = z.input<typeof omniWheelModelPropsSchema>
export type OmniWheelModelProps = z.output<typeof omniWheelModelPropsSchema>
export type OmniWheelModelDefinition = z.output<
  typeof omniWheelModelDefinitionSchema
>
