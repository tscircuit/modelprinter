import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFlatBeltProps } from "./validate"

const shape = {
  pitchLength: positive.default(600),
  width: positive.default(25),
  thickness: positive.default(2),
  endless: z.literal(true).default(true),
  rectangular: z.literal(true).default(true),
}

export const flatBeltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFlatBeltProps)

export const flatBeltModelDefinitionSchema = z
  .object({ fn: z.literal("flatbelt"), ...shape })
  .strict()
  .superRefine(validateFlatBeltProps)

export type FlatBeltModelPropsInput = z.input<typeof flatBeltModelPropsSchema>
export type FlatBeltModelProps = z.output<typeof flatBeltModelPropsSchema>
export type FlatBeltModelDefinition = z.output<
  typeof flatBeltModelDefinitionSchema
>
