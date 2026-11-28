import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateLinearRailProps } from "./validate"

const shape = {
  hgr15: z.literal(true).default(true),
  width: positive.default(15),
  height: positive.default(15),
  length: positive.default(300),
  pitch: positive.default(60),
  firstHole: positive.default(30),
  holes: z.number().int().min(1).default(5),
  holeDiameter: positive.default(4.5),
  counterboreDiameter: positive.default(7.5),
  counterboreDepth: positive.default(5.3),
}

export const linearRailModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLinearRailProps)

export const linearRailModelDefinitionSchema = z
  .object({ fn: z.literal("linearrail"), ...shape })
  .strict()
  .superRefine(validateLinearRailProps)

export type LinearRailModelPropsInput = z.input<
  typeof linearRailModelPropsSchema
>
export type LinearRailModelProps = z.output<typeof linearRailModelPropsSchema>
export type LinearRailModelDefinition = z.output<
  typeof linearRailModelDefinitionSchema
>
