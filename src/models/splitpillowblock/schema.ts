import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSplitPillowBlockProps } from "./validate"

const shape = {
  boreDiameter: positive.default(40),
  length: positive.default(180),
  width: positive.default(60),
  height: positive.default(110),
  slotPitch: positive.default(150),
  slotWidth: positive.default(14),
  slotLength: positive.default(20),
  base2Slot: z.literal(true).default(true),
}

export const splitPillowBlockModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSplitPillowBlockProps)

export const splitPillowBlockModelDefinitionSchema = z
  .object({ fn: z.literal("splitpillowblock"), ...shape })
  .strict()
  .superRefine(validateSplitPillowBlockProps)

export type SplitPillowBlockModelPropsInput = z.input<
  typeof splitPillowBlockModelPropsSchema
>
export type SplitPillowBlockModelProps = z.output<
  typeof splitPillowBlockModelPropsSchema
>
export type SplitPillowBlockModelDefinition = z.output<
  typeof splitPillowBlockModelDefinitionSchema
>
