import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTerminalEndPlateProps } from "./validate"

const shape = {
  width: positive.default(30),
  height: positive.default(40),
  thickness: positive.default(2),
  steppedTerminal: z.literal(true).default(true),
  th35x75: z.literal(true).default(true),
  pins: z.literal(2).default(2),
  pinOuterDiameter: positive.default(2),
  pinPitch: positive.default(20),
}

export const terminalEndPlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTerminalEndPlateProps)

export const terminalEndPlateModelDefinitionSchema = z
  .object({ fn: z.literal("terminalendplate"), ...shape })
  .strict()
  .superRefine(validateTerminalEndPlateProps)

export type TerminalEndPlateModelPropsInput = z.input<
  typeof terminalEndPlateModelPropsSchema
>
export type TerminalEndPlateModelProps = z.output<
  typeof terminalEndPlateModelPropsSchema
>
export type TerminalEndPlateModelDefinition = z.output<
  typeof terminalEndPlateModelDefinitionSchema
>
