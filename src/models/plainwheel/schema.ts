import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePlainWheelProps } from "./validate"

const shape = {
  outerDiameter: positive.default(75),
  width: positive.default(25),
  boreDiameter: positive.default(10),
  hubDiameter: positive.default(30),
  axleBore: z.literal(true).default(true),
  hubWidth: positive.default(30),
  roundEdge: z.literal(true).default(true),
}

export const plainWheelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePlainWheelProps)

export const plainWheelModelDefinitionSchema = z
  .object({ fn: z.literal("plainwheel"), ...shape })
  .strict()
  .superRefine(validatePlainWheelProps)

export type PlainWheelModelPropsInput = z.input<
  typeof plainWheelModelPropsSchema
>
export type PlainWheelModelProps = z.output<typeof plainWheelModelPropsSchema>
export type PlainWheelModelDefinition = z.output<
  typeof plainWheelModelDefinitionSchema
>
