import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeTimingPulleyProps } from "./normalize"
import { validateTimingPulleyProps } from "./validate"

const shape = {
  teeth: z.number().int().min(8).default(20),
  pitch: positive.default(5),
  boreDiameter: positive.default(5),
  width: positive.default(17),
  htd5m: z.literal(true).default(true),
  setScrew: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m3"),
}

export const timingPulleyModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTimingPulleyProps)
  .transform(normalizeTimingPulleyProps)

export const timingPulleyModelDefinitionSchema = z
  .object({ fn: z.literal("timingpulley"), ...shape })
  .strict()
  .superRefine(validateTimingPulleyProps)
  .transform(normalizeTimingPulleyProps)

export type TimingPulleyModelPropsInput = z.input<
  typeof timingPulleyModelPropsSchema
>
export type TimingPulleyModelProps = z.output<
  typeof timingPulleyModelPropsSchema
>
export type TimingPulleyModelDefinition = z.output<
  typeof timingPulleyModelDefinitionSchema
>
