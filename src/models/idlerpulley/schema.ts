import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateIdlerPulleyProps } from "./validate"

const shape = {
  outerDiameter: positive.default(30),
  boreDiameter: positive.default(8),
  width: positive.default(12),
  smoothFlanged: z.literal(true).default(true),
  flangeDiameter: positive.default(34),
  bearingBoreDiameter: positive.default(8),
}

export const idlerPulleyModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateIdlerPulleyProps)

export const idlerPulleyModelDefinitionSchema = z
  .object({ fn: z.literal("idlerpulley"), ...shape })
  .strict()
  .superRefine(validateIdlerPulleyProps)

export type IdlerPulleyModelPropsInput = z.input<
  typeof idlerPulleyModelPropsSchema
>
export type IdlerPulleyModelProps = z.output<typeof idlerPulleyModelPropsSchema>
export type IdlerPulleyModelDefinition = z.output<
  typeof idlerPulleyModelDefinitionSchema
>
