import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateGrooveRollerBearingProps } from "./validate"

const shape = {
  boreDiameter: positive.default(8),
  outerDiameter: positive.default(30),
  width: positive.default(12),
  grooveRadius: positive.default(4),
  grooveDepth: positive.default(4),
  uGroove: z.literal(true).default(true),
  boreMount: z.literal(true).default(true),
}

export const grooveRollerBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateGrooveRollerBearingProps)

export const grooveRollerBearingModelDefinitionSchema = z
  .object({ fn: z.literal("grooverollerbearing"), ...shape })
  .strict()
  .superRefine(validateGrooveRollerBearingProps)

export type GrooveRollerBearingModelPropsInput = z.input<
  typeof grooveRollerBearingModelPropsSchema
>
export type GrooveRollerBearingModelProps = z.output<
  typeof grooveRollerBearingModelPropsSchema
>
export type GrooveRollerBearingModelDefinition = z.output<
  typeof grooveRollerBearingModelDefinitionSchema
>
