import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizePluggableTerminalProps } from "./normalize"
import { validatePluggableTerminalProps } from "./validate"

const shape = {
  pitch: positive.default(5.08),
  poles: z.number().int().min(2).default(4),
  width: positive.default(20.32),
  height: positive.default(12),
  depth: positive.default(15),
  screwThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m2.5"),
  frontWire: z.literal(true).default(true),
  bottomFemale: z.literal(true).default(true),
}

export const pluggableTerminalModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePluggableTerminalProps)
  .transform(normalizePluggableTerminalProps)

export const pluggableTerminalModelDefinitionSchema = z
  .object({ fn: z.literal("pluggableterminal"), ...shape })
  .strict()
  .superRefine(validatePluggableTerminalProps)
  .transform(normalizePluggableTerminalProps)

export type PluggableTerminalModelPropsInput = z.input<
  typeof pluggableTerminalModelPropsSchema
>
export type PluggableTerminalModelProps = z.output<
  typeof pluggableTerminalModelPropsSchema
>
export type PluggableTerminalModelDefinition = z.output<
  typeof pluggableTerminalModelDefinitionSchema
>
