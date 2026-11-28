import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeRoundNutProps } from "./normalize"
import { validateRoundNutProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m10"),
  outerDiameter: positive.default(20),
  height: positive.default(6),
  slots: z.number().int().min(2).default(4),
  slotWidth: positive.default(2),
  slotDepth: positive.default(2),
  axialSlots: z.literal(true).default(true),
  throughBore: z.literal(true).default(true),
}

export const roundNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRoundNutProps)
  .transform(normalizeRoundNutProps)

export const roundNutModelDefinitionSchema = z
  .object({ fn: z.literal("roundnut"), ...shape })
  .strict()
  .superRefine(validateRoundNutProps)
  .transform(normalizeRoundNutProps)

export type RoundNutModelPropsInput = z.input<typeof roundNutModelPropsSchema>
export type RoundNutModelProps = z.output<typeof roundNutModelPropsSchema>
export type RoundNutModelDefinition = z.output<
  typeof roundNutModelDefinitionSchema
>
