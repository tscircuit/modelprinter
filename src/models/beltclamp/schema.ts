import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBeltClampProps } from "./validate"

const shape = {
  width: positive.default(20),
  length: positive.default(30),
  height: positive.default(10),
  pitch: positive.default(5),
  htd5m: z.literal(true).default(true),
  base2Hole: z.literal(true).default(true),
  holeDiameter: positive.default(4),
  holePitch: positive.default(20),
}

export const beltClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBeltClampProps)

export const beltClampModelDefinitionSchema = z
  .object({ fn: z.literal("beltclamp"), ...shape })
  .strict()
  .superRefine(validateBeltClampProps)

export type BeltClampModelPropsInput = z.input<typeof beltClampModelPropsSchema>
export type BeltClampModelProps = z.output<typeof beltClampModelPropsSchema>
export type BeltClampModelDefinition = z.output<
  typeof beltClampModelDefinitionSchema
>
