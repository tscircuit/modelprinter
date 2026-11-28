import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateRoundBeltProps } from "./validate"

const shape = {
  crossSectionDiameter: positive.default(6),
  pitchLength: positive.default(500),
  endless: z.literal(true).default(true),
  circular: z.literal(true).default(true),
}

export const roundBeltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRoundBeltProps)

export const roundBeltModelDefinitionSchema = z
  .object({ fn: z.literal("roundbelt"), ...shape })
  .strict()
  .superRefine(validateRoundBeltProps)

export type RoundBeltModelPropsInput = z.input<typeof roundBeltModelPropsSchema>
export type RoundBeltModelProps = z.output<typeof roundBeltModelPropsSchema>
export type RoundBeltModelDefinition = z.output<
  typeof roundBeltModelDefinitionSchema
>
