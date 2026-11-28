import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { normalizeDoubleEndedStudProps } from "./normalize"
import { validateDoubleEndedStudProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  length: positive.default(40),
  threadLength: positive.default(12),
  equalEnds: z.literal(true).default(true),
  smoothMiddle: z.literal(true).default(true),
  chamferTip: z.literal(true).default(true),
  chamfer: nonNegative.default(0.5),
}

export const doubleEndedStudModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDoubleEndedStudProps)
  .transform(normalizeDoubleEndedStudProps)

export const doubleEndedStudModelDefinitionSchema = z
  .object({ fn: z.literal("doubleendedstud"), ...shape })
  .strict()
  .superRefine(validateDoubleEndedStudProps)
  .transform(normalizeDoubleEndedStudProps)

export type DoubleEndedStudModelPropsInput = z.input<
  typeof doubleEndedStudModelPropsSchema
>
export type DoubleEndedStudModelProps = z.output<
  typeof doubleEndedStudModelPropsSchema
>
export type DoubleEndedStudModelDefinition = z.output<
  typeof doubleEndedStudModelDefinitionSchema
>
