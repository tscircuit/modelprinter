import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateStrapClampProps } from "./validate"

const shape = {
  length: positive.default(100),
  width: positive.default(25),
  thickness: positive.default(10),
  slotLength: positive.default(40),
  slotWidth: positive.default(10),
  noseLength: positive.default(15),
  noseDrop: positive.default(3),
  heelLength: positive.default(20),
  heelHeight: positive.default(10),
}

export const strapClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateStrapClampProps)

export const strapClampModelDefinitionSchema = z
  .object({ fn: z.literal("strapclamp"), ...shape })
  .strict()
  .superRefine(validateStrapClampProps)

export type StrapClampModelPropsInput = z.input<
  typeof strapClampModelPropsSchema
>
export type StrapClampModelProps = z.output<typeof strapClampModelPropsSchema>
export type StrapClampModelDefinition = z.output<
  typeof strapClampModelDefinitionSchema
>
