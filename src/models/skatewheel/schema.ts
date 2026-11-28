import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSkateWheelProps } from "./validate"

const shape = {
  outerDiameter: positive.default(50),
  width: positive.default(15),
  boreDiameter: positive.default(8),
  bearingBore: z.literal(true).default(true),
  bearingSeatDiameter: positive.default(22),
}

export const skateWheelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSkateWheelProps)

export const skateWheelModelDefinitionSchema = z
  .object({ fn: z.literal("skatewheel"), ...shape })
  .strict()
  .superRefine(validateSkateWheelProps)

export type SkateWheelModelPropsInput = z.input<
  typeof skateWheelModelPropsSchema
>
export type SkateWheelModelProps = z.output<typeof skateWheelModelPropsSchema>
export type SkateWheelModelDefinition = z.output<
  typeof skateWheelModelDefinitionSchema
>
