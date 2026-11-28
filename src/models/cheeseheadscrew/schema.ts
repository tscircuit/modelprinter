import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeCheeseHeadScrewProps } from "./normalize"
import { validateCheeseHeadScrewProps } from "./validate"

const shape = {
  iso1207: z.literal(true).default(true),
  thread: z.string().regex(/^m(?:\d+(?:\.\d+)?)$/i),
  length: positive,
  slotted: z.literal(true).default(true),
}

export const cheeseHeadScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCheeseHeadScrewProps)
  .transform(normalizeCheeseHeadScrewProps)

export const cheeseHeadScrewModelDefinitionSchema = z
  .object({ fn: z.literal("cheeseheadscrew"), ...shape })
  .strict()
  .superRefine(validateCheeseHeadScrewProps)
  .transform(normalizeCheeseHeadScrewProps)

export type CheeseHeadScrewModelPropsInput = z.input<
  typeof cheeseHeadScrewModelPropsSchema
>
export type CheeseHeadScrewModelProps = z.output<
  typeof cheeseHeadScrewModelPropsSchema
>
export type CheeseHeadScrewModelDefinition = z.output<
  typeof cheeseHeadScrewModelDefinitionSchema
>
