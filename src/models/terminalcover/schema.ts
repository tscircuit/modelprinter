import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTerminalCoverProps } from "./validate"

const shape = {
  width: positive.default(70),
  depth: positive.default(35),
  height: positive.default(20),
  thickness: positive.default(2),
  uHood: z.literal(true).default(true),
  footWidth: positive.default(5),
  holes: z.literal(2).default(2),
  holeDiameter: positive.default(3),
  holePitch: positive.default(60),
}

export const terminalCoverModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTerminalCoverProps)

export const terminalCoverModelDefinitionSchema = z
  .object({ fn: z.literal("terminalcover"), ...shape })
  .strict()
  .superRefine(validateTerminalCoverProps)

export type TerminalCoverModelPropsInput = z.input<
  typeof terminalCoverModelPropsSchema
>
export type TerminalCoverModelProps = z.output<
  typeof terminalCoverModelPropsSchema
>
export type TerminalCoverModelDefinition = z.output<
  typeof terminalCoverModelDefinitionSchema
>
