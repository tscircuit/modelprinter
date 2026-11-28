import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateDShackleProps } from "./validate"

const shape = {
  innerWidth: positive.default(25),
  innerHeight: positive.default(50),
  stockDiameter: positive.default(12),
  crownRadius: positive.default(12.5),
  pinDiameter: positive.default(12),
  eyeThickness: positive.default(15),
  pinThreadDiameter: positive.default(12),
}

export const dShackleModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDShackleProps)

export const dShackleModelDefinitionSchema = z
  .object({ fn: z.literal("dshackle"), ...shape })
  .strict()
  .superRefine(validateDShackleProps)

export type DShackleModelPropsInput = z.input<typeof dShackleModelPropsSchema>
export type DShackleModelProps = z.output<typeof dShackleModelPropsSchema>
export type DShackleModelDefinition = z.output<
  typeof dShackleModelDefinitionSchema
>
