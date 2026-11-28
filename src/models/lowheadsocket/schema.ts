import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeLowHeadSocketProps } from "./normalize"
import { validateLowHeadSocketProps } from "./validate"

const shape = {
  din7984: z.literal(true).default(true),
  thread: z.string().regex(/^m(?:\d+(?:\.\d+)?)$/i),
  length: positive,
  hexSocket: z.literal(true).default(true),
}

export const lowHeadSocketModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLowHeadSocketProps)
  .transform(normalizeLowHeadSocketProps)

export const lowHeadSocketModelDefinitionSchema = z
  .object({ fn: z.literal("lowheadsocket"), ...shape })
  .strict()
  .superRefine(validateLowHeadSocketProps)
  .transform(normalizeLowHeadSocketProps)

export type LowHeadSocketModelPropsInput = z.input<
  typeof lowHeadSocketModelPropsSchema
>
export type LowHeadSocketModelProps = z.output<
  typeof lowHeadSocketModelPropsSchema
>
export type LowHeadSocketModelDefinition = z.output<
  typeof lowHeadSocketModelDefinitionSchema
>
