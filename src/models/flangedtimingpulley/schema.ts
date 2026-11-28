import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeFlangedTimingPulleyProps } from "./normalize"
import { validateFlangedTimingPulleyProps } from "./validate"

const shape = {
  teeth: z.number().int().min(8).default(20),
  pitch: positive.default(5),
  boreDiameter: positive.default(5),
  width: positive.default(17),
  flangeOuterDiameter: positive.default(37),
  htd5m: z.literal(true).default(true),
  setScrew: z.literal(true).default(true),
  setScrewThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m3"),
}

export const flangedTimingPulleyModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFlangedTimingPulleyProps)
  .transform(normalizeFlangedTimingPulleyProps)

export const flangedTimingPulleyModelDefinitionSchema = z
  .object({ fn: z.literal("flangedtimingpulley"), ...shape })
  .strict()
  .superRefine(validateFlangedTimingPulleyProps)
  .transform(normalizeFlangedTimingPulleyProps)

export type FlangedTimingPulleyModelPropsInput = z.input<
  typeof flangedTimingPulleyModelPropsSchema
>
export type FlangedTimingPulleyModelProps = z.output<
  typeof flangedTimingPulleyModelPropsSchema
>
export type FlangedTimingPulleyModelDefinition = z.output<
  typeof flangedTimingPulleyModelDefinitionSchema
>
