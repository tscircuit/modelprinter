import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeLinearCarriageProps } from "./normalize"
import { validateLinearCarriageProps } from "./validate"

const shape = {
  hgh15ca: z.literal(true).default(true),
  railHgr15: z.literal(true).default(true),
  width: positive.default(34),
  length: positive.default(61.4),
  assemblyHeight: positive.default(28),
  holeGridX: positive.default(26),
  holeGridY: positive.default(26),
  tappedHoles: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  threadDepth: positive.default(5),
}

export const linearCarriageModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLinearCarriageProps)
  .transform(normalizeLinearCarriageProps)

export const linearCarriageModelDefinitionSchema = z
  .object({ fn: z.literal("linearcarriage"), ...shape })
  .strict()
  .superRefine(validateLinearCarriageProps)
  .transform(normalizeLinearCarriageProps)

export type LinearCarriageModelPropsInput = z.input<
  typeof linearCarriageModelPropsSchema
>
export type LinearCarriageModelProps = z.output<
  typeof linearCarriageModelPropsSchema
>
export type LinearCarriageModelDefinition = z.output<
  typeof linearCarriageModelDefinitionSchema
>
