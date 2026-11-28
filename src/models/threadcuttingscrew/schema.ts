import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeThreadCuttingScrewProps } from "./normalize"
import { validateThreadCuttingScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  length: positive.default(16),
  fullThread: z.literal(true).default(true),
  panHead: z.literal(true).default(true),
  headOuterDiameter: positive.default(8),
  headHeight: positive.default(3),
  phillips: z.literal(true).default(true),
  flutes: z.number().int().min(1).max(8).default(4),
  fluteLength: positive.default(4),
  fluteWidth: positive.default(0.8),
  fluteDepth: positive.default(0.6),
}

export const threadCuttingScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateThreadCuttingScrewProps)
  .transform(normalizeThreadCuttingScrewProps)

export const threadCuttingScrewModelDefinitionSchema = z
  .object({ fn: z.literal("threadcuttingscrew"), ...shape })
  .strict()
  .superRefine(validateThreadCuttingScrewProps)
  .transform(normalizeThreadCuttingScrewProps)

export type ThreadCuttingScrewModelPropsInput = z.input<
  typeof threadCuttingScrewModelPropsSchema
>
export type ThreadCuttingScrewModelProps = z.output<
  typeof threadCuttingScrewModelPropsSchema
>
export type ThreadCuttingScrewModelDefinition = z.output<
  typeof threadCuttingScrewModelDefinitionSchema
>
