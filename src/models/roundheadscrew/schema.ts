import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeRoundHeadScrewProps } from "./normalize"
import { validateRoundHeadScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m3"),
  length: positive.default(10),
  fullThread: z.literal(true).default(true),
  hemisphere: z.literal(true).default(true),
  headOuterDiameter: positive.default(5.5),
  headHeight: positive.default(2.75),
  slotted: z.literal(true).default(true),
  slotWidth: positive.default(0.8),
  slotDepth: positive.default(1),
}

export const roundHeadScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRoundHeadScrewProps)
  .transform(normalizeRoundHeadScrewProps)

export const roundHeadScrewModelDefinitionSchema = z
  .object({ fn: z.literal("roundheadscrew"), ...shape })
  .strict()
  .superRefine(validateRoundHeadScrewProps)
  .transform(normalizeRoundHeadScrewProps)

export type RoundHeadScrewModelPropsInput = z.input<
  typeof roundHeadScrewModelPropsSchema
>
export type RoundHeadScrewModelProps = z.output<
  typeof roundHeadScrewModelPropsSchema
>
export type RoundHeadScrewModelDefinition = z.output<
  typeof roundHeadScrewModelDefinitionSchema
>
