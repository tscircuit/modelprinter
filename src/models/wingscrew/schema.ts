import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeWingScrewProps } from "./normalize"
import { validateWingScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m5"),
  length: positive.default(20),
  fullThread: z.literal(true).default(true),
  twinWing: z.literal(true).default(true),
  wingSpan: positive.default(28),
  wingHeight: positive.default(12),
  wingThickness: positive.default(3),
  bossOuterDiameter: positive.default(9),
}

export const wingScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWingScrewProps)
  .transform(normalizeWingScrewProps)

export const wingScrewModelDefinitionSchema = z
  .object({ fn: z.literal("wingscrew"), ...shape })
  .strict()
  .superRefine(validateWingScrewProps)
  .transform(normalizeWingScrewProps)

export type WingScrewModelPropsInput = z.input<typeof wingScrewModelPropsSchema>
export type WingScrewModelProps = z.output<typeof wingScrewModelPropsSchema>
export type WingScrewModelDefinition = z.output<
  typeof wingScrewModelDefinitionSchema
>
