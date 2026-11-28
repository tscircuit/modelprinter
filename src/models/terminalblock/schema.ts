import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeTerminalBlockProps } from "./normalize"
import { validateTerminalBlockProps } from "./validate"

const shape = {
  pitch: positive.default(5),
  positions: z.number().int().min(1).max(36),
  width: positive.optional(),
  depth: positive.default(10),
  height: positive.default(12),
  wireEntryDiameter: positive.default(2.5),
  screwThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m2.5"),
  throughHole: z.literal(true).default(true),
  tailLength: positive.default(4),
}

export const terminalBlockModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTerminalBlockProps)
  .transform(normalizeTerminalBlockProps)

export const terminalBlockModelDefinitionSchema = z
  .object({ fn: z.literal("terminalblock"), ...shape })
  .strict()
  .superRefine(validateTerminalBlockProps)
  .transform(normalizeTerminalBlockProps)

export type TerminalBlockModelPropsInput = z.input<
  typeof terminalBlockModelPropsSchema
>
export type TerminalBlockModelProps = z.output<
  typeof terminalBlockModelPropsSchema
>
export type TerminalBlockModelDefinition = z.output<
  typeof terminalBlockModelDefinitionSchema
>
