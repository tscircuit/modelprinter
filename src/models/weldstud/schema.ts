import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeWeldStudProps } from "./normalize"
import { validateWeldStudProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  length: positive.default(25),
  fullThread: z.literal(true).default(true),
  baseOuterDiameter: positive.default(8),
  baseHeight: positive.default(1.5),
  weldTipDiameter: positive.default(2),
  weldTipLength: positive.default(1),
}

export const weldStudModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWeldStudProps)
  .transform(normalizeWeldStudProps)

export const weldStudModelDefinitionSchema = z
  .object({ fn: z.literal("weldstud"), ...shape })
  .strict()
  .superRefine(validateWeldStudProps)
  .transform(normalizeWeldStudProps)

export type WeldStudModelPropsInput = z.input<typeof weldStudModelPropsSchema>
export type WeldStudModelProps = z.output<typeof weldStudModelPropsSchema>
export type WeldStudModelDefinition = z.output<
  typeof weldStudModelDefinitionSchema
>
