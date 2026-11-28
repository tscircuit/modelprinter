import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeCaptiveScrewProps } from "./normalize"
import { validateCaptiveScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m3"),
  length: positive.default(12),
  threadLength: positive.default(9),
  neckDiameter: positive.default(2.4),
  neckLength: positive.default(3),
  panHead: z.literal(true).default(true),
  headOuterDiameter: positive.default(5.5),
  headHeight: positive.default(2),
  phillips: z.literal(true).default(true),
}

export const captiveScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCaptiveScrewProps)
  .transform(normalizeCaptiveScrewProps)

export const captiveScrewModelDefinitionSchema = z
  .object({ fn: z.literal("captivescrew"), ...shape })
  .strict()
  .superRefine(validateCaptiveScrewProps)
  .transform(normalizeCaptiveScrewProps)

export type CaptiveScrewModelPropsInput = z.input<
  typeof captiveScrewModelPropsSchema
>
export type CaptiveScrewModelProps = z.output<
  typeof captiveScrewModelPropsSchema
>
export type CaptiveScrewModelDefinition = z.output<
  typeof captiveScrewModelDefinitionSchema
>
