import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeClevisPinProps } from "./normalize"
import { validateClevisPinProps } from "./validate"

const shape = {
  iso2341: z.literal(true).default(true),
  formB: z.literal(true).default(true),
  diameter: positive,
  length: positive,
}

export const clevisPinModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateClevisPinProps)
  .transform(normalizeClevisPinProps)

export const clevisPinModelDefinitionSchema = z
  .object({ fn: z.literal("clevispin"), ...shape })
  .strict()
  .superRefine(validateClevisPinProps)
  .transform(normalizeClevisPinProps)

export type ClevisPinModelPropsInput = z.input<typeof clevisPinModelPropsSchema>
export type ClevisPinModelProps = z.output<typeof clevisPinModelPropsSchema>
export type ClevisPinModelDefinition = z.output<
  typeof clevisPinModelDefinitionSchema
>
