import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeTrussHeadScrewProps } from "./normalize"
import { validateTrussHeadScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  length: positive.default(16),
  fullThread: z.literal(true).default(true),
  headOuterDiameter: positive.default(10),
  headHeight: positive.default(2),
  sphericalCap: z.literal(true).default(true),
  phillips: z.literal(true).default(true),
}

export const trussHeadScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTrussHeadScrewProps)
  .transform(normalizeTrussHeadScrewProps)

export const trussHeadScrewModelDefinitionSchema = z
  .object({ fn: z.literal("trussheadscrew"), ...shape })
  .strict()
  .superRefine(validateTrussHeadScrewProps)
  .transform(normalizeTrussHeadScrewProps)

export type TrussHeadScrewModelPropsInput = z.input<
  typeof trussHeadScrewModelPropsSchema
>
export type TrussHeadScrewModelProps = z.output<
  typeof trussHeadScrewModelPropsSchema
>
export type TrussHeadScrewModelDefinition = z.output<
  typeof trussHeadScrewModelDefinitionSchema
>
