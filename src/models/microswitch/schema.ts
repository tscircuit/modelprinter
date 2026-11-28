import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateMicroswitchProps } from "./validate"

const shape = {
  width: positive.default(20),
  height: positive.default(10),
  depth: positive.default(6),
  leverLength: positive.default(25),
  leverThickness: positive.default(0.5),
  holes: z.literal(2).default(2),
  holeDiameter: positive.default(2),
  holePitch: positive.default(9.5),
  contacts: z.union([z.literal(2), z.literal(3)]).default(3),
  solderLug: z.literal(true).default(true),
}

export const microswitchModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateMicroswitchProps)

export const microswitchModelDefinitionSchema = z
  .object({ fn: z.literal("microswitch"), ...shape })
  .strict()
  .superRefine(validateMicroswitchProps)

export type MicroswitchModelPropsInput = z.input<
  typeof microswitchModelPropsSchema
>
export type MicroswitchModelProps = z.output<typeof microswitchModelPropsSchema>
export type MicroswitchModelDefinition = z.output<
  typeof microswitchModelDefinitionSchema
>
