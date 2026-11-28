import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeRoundBeltPulleyProps } from "./normalize"
import { validateRoundBeltPulleyProps } from "./validate"

const shape = {
  outerDiameter: positive.default(50),
  boreDiameter: positive.default(8),
  width: positive.default(12),
  grooveRadius: positive.default(3),
  semicircularGroove: z.literal(true).default(true),
  setScrew: z.literal(true).default(true),
  setScrewThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
}

export const roundBeltPulleyModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRoundBeltPulleyProps)
  .transform(normalizeRoundBeltPulleyProps)

export const roundBeltPulleyModelDefinitionSchema = z
  .object({ fn: z.literal("roundbeltpulley"), ...shape })
  .strict()
  .superRefine(validateRoundBeltPulleyProps)
  .transform(normalizeRoundBeltPulleyProps)

export type RoundBeltPulleyModelPropsInput = z.input<
  typeof roundBeltPulleyModelPropsSchema
>
export type RoundBeltPulleyModelProps = z.output<
  typeof roundBeltPulleyModelPropsSchema
>
export type RoundBeltPulleyModelDefinition = z.output<
  typeof roundBeltPulleyModelDefinitionSchema
>
