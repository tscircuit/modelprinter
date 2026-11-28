import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeSpringDetentProps } from "./normalize"
import { validateSpringDetentProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  length: positive.default(15),
  ballDiameter: positive.default(3),
  projection: positive.default(1),
  flatFront: z.literal(true).default(true),
  slottedRear: z.literal(true).default(true),
  slotWidth: positive.default(1),
  slotDepth: positive.default(1),
}

export const springDetentModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSpringDetentProps)
  .transform(normalizeSpringDetentProps)

export const springDetentModelDefinitionSchema = z
  .object({ fn: z.literal("springdetent"), ...shape })
  .strict()
  .superRefine(validateSpringDetentProps)
  .transform(normalizeSpringDetentProps)

export type SpringDetentModelPropsInput = z.input<
  typeof springDetentModelPropsSchema
>
export type SpringDetentModelProps = z.output<
  typeof springDetentModelPropsSchema
>
export type SpringDetentModelDefinition = z.output<
  typeof springDetentModelDefinitionSchema
>
