import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTurnbuckleProps } from "./validate"

const shape = {
  threadDiameter: positive.default(6),
  bodyLength: positive.default(100),
  bodyWidth: positive.default(20),
  bodyHeight: positive.default(12),
  openLength: positive.default(70),
  openWidth: positive.default(10),
  eyeInnerDiameter: positive.default(10),
  eyeWireDiameter: positive.default(4),
  endLength: positive.default(40),
  opposedThread: z.literal(true).default(true),
  centered: z.literal(true).default(true),
}

export const turnbuckleModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTurnbuckleProps)

export const turnbuckleModelDefinitionSchema = z
  .object({ fn: z.literal("turnbuckle"), ...shape })
  .strict()
  .superRefine(validateTurnbuckleProps)

export type TurnbuckleModelPropsInput = z.input<
  typeof turnbuckleModelPropsSchema
>
export type TurnbuckleModelProps = z.output<typeof turnbuckleModelPropsSchema>
export type TurnbuckleModelDefinition = z.output<
  typeof turnbuckleModelDefinitionSchema
>
