import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateHeatsinkClipProps } from "./validate"

const shape = {
  width: positive.default(12),
  length: positive.default(35),
  height: positive.default(10),
  stripThickness: positive.default(0.8),
  hookDepth: positive.default(3),
  springBridge: z.literal(true).default(true),
}

export const heatsinkClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHeatsinkClipProps)

export const heatsinkClipModelDefinitionSchema = z
  .object({ fn: z.literal("heatsinkclip"), ...shape })
  .strict()
  .superRefine(validateHeatsinkClipProps)

export type HeatsinkClipModelPropsInput = z.input<
  typeof heatsinkClipModelPropsSchema
>
export type HeatsinkClipModelProps = z.output<
  typeof heatsinkClipModelPropsSchema
>
export type HeatsinkClipModelDefinition = z.output<
  typeof heatsinkClipModelDefinitionSchema
>
