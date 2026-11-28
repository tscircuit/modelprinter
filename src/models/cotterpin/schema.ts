import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeCotterPinProps } from "./normalize"
import { validateCotterPinProps } from "./validate"

const shape = {
  iso1234: z.literal(true).default(true),
  nominalSize: positive,
  length: positive,
  straight: z.literal(true).default(true),
}

export const cotterPinModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCotterPinProps)
  .transform(normalizeCotterPinProps)

export const cotterPinModelDefinitionSchema = z
  .object({ fn: z.literal("cotterpin"), ...shape })
  .strict()
  .superRefine(validateCotterPinProps)
  .transform(normalizeCotterPinProps)

export type CotterPinModelPropsInput = z.input<typeof cotterPinModelPropsSchema>
export type CotterPinModelProps = z.output<typeof cotterPinModelPropsSchema>
export type CotterPinModelDefinition = z.output<
  typeof cotterPinModelDefinitionSchema
>
