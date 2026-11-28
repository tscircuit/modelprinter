import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTerminalJumperProps } from "./validate"

const shape = {
  pitch: positive.default(5),
  poles: z.number().int().min(2).default(4),
  thickness: positive.default(1),
  stripWidth: positive.default(4),
  prongWidth: positive.default(2),
  prongLength: positive.default(8),
  comb: z.literal(true).default(true),
}

export const terminalJumperModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTerminalJumperProps)

export const terminalJumperModelDefinitionSchema = z
  .object({ fn: z.literal("terminaljumper"), ...shape })
  .strict()
  .superRefine(validateTerminalJumperProps)

export type TerminalJumperModelPropsInput = z.input<
  typeof terminalJumperModelPropsSchema
>
export type TerminalJumperModelProps = z.output<
  typeof terminalJumperModelPropsSchema
>
export type TerminalJumperModelDefinition = z.output<
  typeof terminalJumperModelDefinitionSchema
>
