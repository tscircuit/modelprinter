import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeThumbScrewProps } from "./normalize"
import { validateThumbScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  length: positive.default(12),
  headOuterDiameter: positive.default(12),
  headHeight: positive.default(6),
  straightKnurl: z.literal(true).default(true),
  knurlPitch: positive.default(1),
  fullThread: z.literal(true).default(true),
  chamferTip: z.literal(true).default(true),
}

export const thumbScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateThumbScrewProps)
  .transform(normalizeThumbScrewProps)

export const thumbScrewModelDefinitionSchema = z
  .object({ fn: z.literal("thumbscrew"), ...shape })
  .strict()
  .superRefine(validateThumbScrewProps)
  .transform(normalizeThumbScrewProps)

export type ThumbScrewModelPropsInput = z.input<
  typeof thumbScrewModelPropsSchema
>
export type ThumbScrewModelProps = z.output<typeof thumbScrewModelPropsSchema>
export type ThumbScrewModelDefinition = z.output<
  typeof thumbScrewModelDefinitionSchema
>
