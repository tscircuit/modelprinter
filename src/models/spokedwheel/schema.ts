import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSpokedWheelProps } from "./validate"

const shape = {
  outerDiameter: positive.default(150),
  rimWidth: positive.default(25),
  boreDiameter: positive.default(15),
  spokes: z.number().int().min(3).default(6),
  keyway: z.literal(true).default(true),
  keyWidth: positive.default(5),
  hubWidth: positive.default(30),
}

export const spokedWheelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSpokedWheelProps)

export const spokedWheelModelDefinitionSchema = z
  .object({ fn: z.literal("spokedwheel"), ...shape })
  .strict()
  .superRefine(validateSpokedWheelProps)

export type SpokedWheelModelPropsInput = z.input<
  typeof spokedWheelModelPropsSchema
>
export type SpokedWheelModelProps = z.output<typeof spokedWheelModelPropsSchema>
export type SpokedWheelModelDefinition = z.output<
  typeof spokedWheelModelDefinitionSchema
>
