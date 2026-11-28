import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCastellatedNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(6),
  acrossFlats: positive.default(10),
  height: positive.default(8),
  castleOuterDiameter: positive.default(9),
  castleHeight: positive.default(3),
  slots: z.number().int().min(4).max(12).default(6),
  slotWidth: positive.default(1.5),
  slotDepth: positive.default(3),
}

export const castellatedNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCastellatedNutProps)

export const castellatedNutModelDefinitionSchema = z
  .object({ fn: z.literal("castellatednut"), ...shape })
  .strict()
  .superRefine(validateCastellatedNutProps)

export type CastellatedNutModelPropsInput = z.input<
  typeof castellatedNutModelPropsSchema
>
export type CastellatedNutModelProps = z.output<
  typeof castellatedNutModelPropsSchema
>
export type CastellatedNutModelDefinition = z.output<
  typeof castellatedNutModelDefinitionSchema
>
