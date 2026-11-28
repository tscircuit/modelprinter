import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFlatBeltPulleyProps } from "./validate"

const shape = {
  outerDiameter: positive.default(80),
  boreDiameter: positive.default(12),
  width: positive.default(30),
  flatRim: z.literal(true).default(true),
  keyway: z.literal(true).default(true),
  keyWidth: positive.default(4),
}

export const flatBeltPulleyModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFlatBeltPulleyProps)

export const flatBeltPulleyModelDefinitionSchema = z
  .object({ fn: z.literal("flatbeltpulley"), ...shape })
  .strict()
  .superRefine(validateFlatBeltPulleyProps)

export type FlatBeltPulleyModelPropsInput = z.input<
  typeof flatBeltPulleyModelPropsSchema
>
export type FlatBeltPulleyModelProps = z.output<
  typeof flatBeltPulleyModelPropsSchema
>
export type FlatBeltPulleyModelDefinition = z.output<
  typeof flatBeltPulleyModelDefinitionSchema
>
