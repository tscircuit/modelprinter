import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateToeClampProps } from "./validate"

const shape = {
  length: positive.default(60),
  width: positive.default(30),
  height: positive.default(25),
  toeLength: positive.default(8),
  toeHeight: positive.default(5),
  mountSlotWidth: positive.default(8),
  mountSlotLength: positive.default(30),
  slotCenter: positive.default(35),
}

export const toeClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateToeClampProps)

export const toeClampModelDefinitionSchema = z
  .object({ fn: z.literal("toeclamp"), ...shape })
  .strict()
  .superRefine(validateToeClampProps)

export type ToeClampModelPropsInput = z.input<typeof toeClampModelPropsSchema>
export type ToeClampModelProps = z.output<typeof toeClampModelPropsSchema>
export type ToeClampModelDefinition = z.output<
  typeof toeClampModelDefinitionSchema
>
