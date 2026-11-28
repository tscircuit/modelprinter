import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeToggleControlProps } from "./normalize"
import { validateToggleControlProps } from "./validate"

const shape = {
  bodyLength: positive.default(12),
  bodyWidth: positive.default(8),
  bodyHeight: positive.default(10),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  threadPitch: positive.default(0.75),
  bushingLength: positive.default(6),
  leverLength: positive.default(15),
  contacts: z.union([z.literal(2), z.literal(3), z.literal(6)]).default(3),
  solderLug: z.literal(true).default(true),
  verticalLever: z.literal(true).default(true),
}

export const toggleControlModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateToggleControlProps)
  .transform(normalizeToggleControlProps)

export const toggleControlModelDefinitionSchema = z
  .object({ fn: z.literal("togglecontrol"), ...shape })
  .strict()
  .superRefine(validateToggleControlProps)
  .transform(normalizeToggleControlProps)

export type ToggleControlModelPropsInput = z.input<
  typeof toggleControlModelPropsSchema
>
export type ToggleControlModelProps = z.output<
  typeof toggleControlModelPropsSchema
>
export type ToggleControlModelDefinition = z.output<
  typeof toggleControlModelDefinitionSchema
>
