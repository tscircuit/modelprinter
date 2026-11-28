import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCageNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(6),
  nutWidth: positive.default(10),
  nutHeight: positive.default(5),
  cageWidth: positive.default(14),
  cageHeight: positive.default(10),
  wallThickness: positive.default(0.8),
  earSpan: positive.default(18),
  opposedEars: z.literal(true).default(true),
}

export const cageNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCageNutProps)

export const cageNutModelDefinitionSchema = z
  .object({ fn: z.literal("cagenut"), ...shape })
  .strict()
  .superRefine(validateCageNutProps)

export type CageNutModelPropsInput = z.input<typeof cageNutModelPropsSchema>
export type CageNutModelProps = z.output<typeof cageNutModelPropsSchema>
export type CageNutModelDefinition = z.output<
  typeof cageNutModelDefinitionSchema
>
