import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeClinchStudProps } from "./normalize"
import { validateClinchStudProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  length: positive.default(15),
  fullThread: z.literal(true).default(true),
  headOuterDiameter: positive.default(7),
  headHeight: positive.default(1.5),
  neckDiameter: positive.default(3.4),
  neckLength: positive.default(1),
  serrations: z.number().int().min(6).max(48).default(12),
  serrationDepth: positive.default(0.3),
}

export const clinchStudModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateClinchStudProps)
  .transform(normalizeClinchStudProps)

export const clinchStudModelDefinitionSchema = z
  .object({ fn: z.literal("clinchstud"), ...shape })
  .strict()
  .superRefine(validateClinchStudProps)
  .transform(normalizeClinchStudProps)

export type ClinchStudModelPropsInput = z.input<
  typeof clinchStudModelPropsSchema
>
export type ClinchStudModelProps = z.output<typeof clinchStudModelPropsSchema>
export type ClinchStudModelDefinition = z.output<
  typeof clinchStudModelDefinitionSchema
>
