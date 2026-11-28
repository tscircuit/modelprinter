import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePillowBlockProps } from "./validate"

const shape = {
  boreDiameter: positive.default(20),
  length: positive.default(127),
  width: positive.default(38),
  height: positive.default(65),
  base2Slot: z.literal(true).default(true),
  slotWidth: positive.default(10),
  slotLength: positive.default(15),
  slotPitch: positive.default(95),
}

export const pillowBlockModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePillowBlockProps)

export const pillowBlockModelDefinitionSchema = z
  .object({ fn: z.literal("pillowblock"), ...shape })
  .strict()
  .superRefine(validatePillowBlockProps)

export type PillowBlockModelPropsInput = z.input<
  typeof pillowBlockModelPropsSchema
>
export type PillowBlockModelProps = z.output<typeof pillowBlockModelPropsSchema>
export type PillowBlockModelDefinition = z.output<
  typeof pillowBlockModelDefinitionSchema
>
