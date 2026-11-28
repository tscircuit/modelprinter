import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeSpringPlungerProps } from "./normalize"
import { validateSpringPlungerProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  length: positive.default(20),
  pinDiameter: positive.default(3),
  projection: positive.default(4),
  stroke: positive.default(4),
  roundTip: z.literal(true).default(true),
  slottedRear: z.literal(true).default(true),
  slotWidth: positive.default(1),
  slotDepth: positive.default(1),
  extended: z.literal(true).default(true),
}

export const springPlungerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSpringPlungerProps)
  .transform(normalizeSpringPlungerProps)

export const springPlungerModelDefinitionSchema = z
  .object({ fn: z.literal("springplunger"), ...shape })
  .strict()
  .superRefine(validateSpringPlungerProps)
  .transform(normalizeSpringPlungerProps)

export type SpringPlungerModelPropsInput = z.input<
  typeof springPlungerModelPropsSchema
>
export type SpringPlungerModelProps = z.output<
  typeof springPlungerModelPropsSchema
>
export type SpringPlungerModelDefinition = z.output<
  typeof springPlungerModelDefinitionSchema
>
