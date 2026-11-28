import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBowShackleProps } from "./validate"

const shape = {
  innerWidth: positive.default(40),
  innerHeight: positive.default(60),
  stockDiameter: positive.default(12),
  bowRadius: positive.default(30),
  pinDiameter: positive.default(12),
  eyeThickness: positive.default(15),
  pinThreadDiameter: positive.default(12),
}

export const bowShackleModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBowShackleProps)

export const bowShackleModelDefinitionSchema = z
  .object({ fn: z.literal("bowshackle"), ...shape })
  .strict()
  .superRefine(validateBowShackleProps)

export type BowShackleModelPropsInput = z.input<
  typeof bowShackleModelPropsSchema
>
export type BowShackleModelProps = z.output<typeof bowShackleModelPropsSchema>
export type BowShackleModelDefinition = z.output<
  typeof bowShackleModelDefinitionSchema
>
