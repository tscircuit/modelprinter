import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeTerminalBarrierProps } from "./normalize"
import { validateTerminalBarrierProps } from "./validate"

const shape = {
  pitch: positive.default(8),
  poles: z.number().int().min(1).default(4),
  width: positive.default(40),
  depth: positive.default(20),
  height: positive.default(15),
  screwThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m3"),
  barrierThickness: positive.default(2),
  holes: z.literal(2).default(2),
  holeDiameter: positive.default(3),
  holePitch: positive.default(32),
}

export const terminalBarrierModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTerminalBarrierProps)
  .transform(normalizeTerminalBarrierProps)

export const terminalBarrierModelDefinitionSchema = z
  .object({ fn: z.literal("terminalbarrier"), ...shape })
  .strict()
  .superRefine(validateTerminalBarrierProps)
  .transform(normalizeTerminalBarrierProps)

export type TerminalBarrierModelPropsInput = z.input<
  typeof terminalBarrierModelPropsSchema
>
export type TerminalBarrierModelProps = z.output<
  typeof terminalBarrierModelPropsSchema
>
export type TerminalBarrierModelDefinition = z.output<
  typeof terminalBarrierModelDefinitionSchema
>
