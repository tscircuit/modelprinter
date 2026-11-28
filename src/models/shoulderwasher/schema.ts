import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateShoulderWasherProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  innerDiameter: positive.default(3.2),
  outerDiameter: positive.default(8),
  flangeHeight: positive.default(1),
  bossOuterDiameter: positive.default(5),
  bossLength: positive.default(3),
  round: z.literal(true).default(true),
}

export const shoulderWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateShoulderWasherProps)

export const shoulderWasherModelDefinitionSchema = z
  .object({ fn: z.literal("shoulderwasher"), ...shape })
  .strict()
  .superRefine(validateShoulderWasherProps)

export type ShoulderWasherModelPropsInput = z.input<
  typeof shoulderWasherModelPropsSchema
>
export type ShoulderWasherModelProps = z.output<
  typeof shoulderWasherModelPropsSchema
>
export type ShoulderWasherModelDefinition = z.output<
  typeof shoulderWasherModelDefinitionSchema
>
