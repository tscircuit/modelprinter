import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { normalizeFillisterHeadScrewProps } from "./normalize"
import { validateFillisterHeadScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m3"),
  length: positive.default(10),
  fullThread: z.literal(true).default(true),
  headOuterDiameter: positive.default(5),
  headHeight: positive.default(3),
  domeHeight: nonNegative.default(0.5),
  slotted: z.literal(true).default(true),
  slotWidth: positive.default(0.8),
  slotDepth: positive.default(1.2),
}

export const fillisterHeadScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFillisterHeadScrewProps)
  .transform(normalizeFillisterHeadScrewProps)

export const fillisterHeadScrewModelDefinitionSchema = z
  .object({ fn: z.literal("fillisterheadscrew"), ...shape })
  .strict()
  .superRefine(validateFillisterHeadScrewProps)
  .transform(normalizeFillisterHeadScrewProps)

export type FillisterHeadScrewModelPropsInput = z.input<
  typeof fillisterHeadScrewModelPropsSchema
>
export type FillisterHeadScrewModelProps = z.output<
  typeof fillisterHeadScrewModelPropsSchema
>
export type FillisterHeadScrewModelDefinition = z.output<
  typeof fillisterHeadScrewModelDefinitionSchema
>
